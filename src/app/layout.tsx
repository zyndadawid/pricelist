import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Event Horizon — Dawid Zynda', description: 'A first draft of the Dawid Zynda artwork catalogue.', robots: {index:false,follow:false} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
