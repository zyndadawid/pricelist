"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Artwork } from "../data/artworks";
import { messages, type Language } from "../data/i18n";

type Props = { artwork: Artwork; language: Language; onClose: () => void };

function EnquiryForm({ artwork, language, formId, onBusy }: Omit<Props, "onClose"> & {
  formId: string; onBusy: (busy: boolean) => void;
}) {
  const t = messages[language];
  const [state, submit, reset] = useForm(formId);
  const locked = useRef(false);
  const [networkError, setNetworkError] = useState(false);
  useEffect(() => {
    if (state.errors) locked.current = false;
  }, [state.errors]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || state.submitting || state.succeeded || !event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    data.set("artwork_title", artwork.title);
    data.set("artwork_id", artwork.id);
    const artworkUrl = new URL(window.location.pathname, window.location.origin);
    artworkUrl.hash = `artwork-${artwork.id}`;
    data.set("artwork_url", artworkUrl.href);
    data.set("subject", `Artwork enquiry: ${artwork.title}`);
    // Formspree uses the email field as the notification's Reply-To address.
    locked.current = true;
    setNetworkError(false);
    onBusy(true);
    try {
      await submit(data);
      // Keep locked after success so this form cannot send twice.
    } catch {
      reset();
      locked.current = false;
      setNetworkError(true);
    } finally {
      onBusy(false);
    }
  }

  if (state.succeeded) return <p className="enquiry-feedback" role="status">{t.enquirySuccess}</p>;
  return (
    <form onSubmit={handleSubmit} className="enquiry-form" aria-busy={state.submitting}>
      <fieldset disabled={state.submitting}>
        <label htmlFor="enquiry-email">{t.email}</label>
        <input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        <label htmlFor="enquiry-message">{t.message} <span>({t.optional})</span></label>
        <textarea id="enquiry-message" name="message" rows={4} maxLength={10000} />
        {(networkError || state.errors) && <div className="enquiry-feedback" role="alert">
          <p>{t.enquiryError}</p>
          <ValidationError errors={state.errors} />
          <ValidationError field="email" prefix={t.email} errors={state.errors} />
          <ValidationError field="message" prefix={t.message} errors={state.errors} />
        </div>}
        <button className="contact-button primary" type="submit" disabled={state.submitting}>
          {state.submitting ? t.sending : t.sendEnquiry}
        </button>
      </fieldset>
    </form>
  );
}

export function EnquiryModal({ artwork, language, onClose }: Props) {
  const t = messages[language];
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  useEffect(() => { dialog.current?.showModal(); }, []);
  return (
    <dialog ref={dialog} className="enquiry-modal" aria-labelledby="enquiry-heading" aria-describedby="enquiry-subtitle"
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={(event) => { if (!busy && event.target === event.currentTarget) onClose(); }}>
      <button className="close-dialog" type="button" aria-label={t.close} disabled={busy} onClick={onClose}>×</button>
      <h2 id="enquiry-heading">{t.enquiryTitle}</h2>
      <p className="dialog-note" id="enquiry-subtitle">{t.enquirySubtitle}</p>
      <p className="enquiry-artwork">{artwork.title}</p>
      {formId ? <EnquiryForm key={artwork.id} artwork={artwork} language={language} formId={formId} onBusy={setBusy} /> : (
        <div>
          <p className="enquiry-feedback" role="status">{t.enquiryUnavailable}</p>
          <button className="contact-button primary" type="button" disabled>{t.sendEnquiry}</button>
        </div>
      )}
    </dialog>
  );
}
