import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SubmissionError } from "@formspree/core";
import { EnquiryModal } from "./enquiry-modal";
import { artworks } from "../data/artworks";

const { submit } = vi.hoisted(() => ({ submit: vi.fn() }));
vi.mock("@formspree/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@formspree/react")>();
  return { ...actual, useForm: (id: string) => actual.useForm(id, {
    client: { submitForm: submit } as never,
  }) };
});
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_FORMSPREE_FORM_ID", "test-only");
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  submit.mockReset();
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });
function open() {
  const onClose = vi.fn();
  render(<EnquiryModal artwork={artworks[0]} language="en" onClose={onClose} />);
  return onClose;
}
function send() {
  fireEvent.change(screen.getByLabelText("Your email"), { target: { value: "visitor@example.com" } });
  fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);
}
it("disables sending without configuration", () => {
  vi.stubEnv("NEXT_PUBLIC_FORMSPREE_FORM_ID", "");
  open();
  expect((screen.getByRole("button", { name: "Send message" }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole("status").textContent).toContain("temporarily unavailable");
  expect(submit).not.toHaveBeenCalled();
});
it("submits artwork identity and email, blocks duplicates and dismissal, then confirms success", async () => {
  let resolve!: (value: {kind: string}) => void;
  submit.mockImplementation(() => new Promise(r => { resolve = r; }));
  const close = open();
  expect((screen.getByLabelText(/Message/) as HTMLTextAreaElement).value).toBe("");
  send();
  const form = screen.getByRole("button", { name: "Sending…" }).closest("form")!;
  fireEvent.submit(form);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
  expect(close).not.toHaveBeenCalled();
  expect(submit).toHaveBeenCalledTimes(1);
  const data = submit.mock.calls[0][1] as FormData;
  expect(data.get("email")).toBe("visitor@example.com");
  expect(data.get("artwork_title")).toBe(artworks[0].title);
  expect(data.get("artwork_id")).toBe(artworks[0].id);
  expect(data.get("message")).toBe("");
  expect(data.get("subject")).toBe(`Artwork enquiry: ${artworks[0].title}`);
  const url = new URL(data.get("artwork_url") as string);
  expect(url.origin).toBe(window.location.origin);
  expect(decodeURIComponent(url.hash)).toBe(`#artwork-${artworks[0].id}`);
  await act(async () => resolve({ kind: "success" }));
  expect(screen.getByRole("status").textContent).toBe("Thank you for your interest. I'll be in touch soon.");
  expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();
});
it.each(["server", "network"])("preserves input and allows retry after a %s error", async (kind) => {
  if (kind === "server") submit.mockResolvedValueOnce(new SubmissionError({ field: "email", code: "TYPE_EMAIL", message: "Please enter a valid email address" }));
  else submit.mockRejectedValueOnce(new Error("offline"));
  open();
  send();
  const error = await screen.findByRole("alert");
  if (kind === "server") expect(error.textContent).toContain("Please enter a valid email address");
  expect((screen.getByLabelText("Your email") as HTMLInputElement).value).toBe("visitor@example.com");
  submit.mockResolvedValueOnce({ kind: "success" });
  send();
  await screen.findByRole("status");
  expect(submit).toHaveBeenCalledTimes(2);
});
it("requires a valid email", () => {
  open();
  fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);
  expect(submit).not.toHaveBeenCalled();
});
it.each(["pl", "fr"] as const)("renders translated form labels in %s", (language) => {
  render(<EnquiryModal artwork={artworks[1]} language={language} onClose={() => {}} />);
  expect(screen.getByText(artworks[1].title)).toBeTruthy();
  expect(screen.getByLabelText(language === "pl" ? "Twój e-mail" : "Votre e-mail")).toBeTruthy();
});

it("resets the confirmed form when another artwork is opened", async () => {
  submit.mockResolvedValue({ kind: "success" });
  const view = render(<EnquiryModal artwork={artworks[0]} language="en" onClose={() => {}} />);
  send();
  await screen.findByRole("status");
  view.rerender(<EnquiryModal artwork={artworks[1]} language="en" onClose={() => {}} />);
  expect(screen.queryByRole("status")).toBeNull();
  expect((screen.getByLabelText("Your email") as HTMLInputElement).value).toBe("");
  expect((screen.getByLabelText(/Message/) as HTMLTextAreaElement).value).toBe("");
  send();
  await screen.findByRole("status");
  expect((submit.mock.calls[1][1] as FormData).get("artwork_id")).toBe(artworks[1].id);
});
