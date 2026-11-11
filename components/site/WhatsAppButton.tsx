import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "529871052528";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about a tour.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[88px] right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-lg shadow-black/25 transition hover:scale-105 hover:shadow-xl sm:bottom-6 sm:right-6"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 shrink-0" fill="currentColor" />
      <span className="hidden text-sm font-bold sm:inline">WhatsApp</span>
    </a>
  );
}
