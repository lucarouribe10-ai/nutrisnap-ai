import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "NutriSnap AI — Tu foto no ve el aceite. NutriSnap sí lo pregunta",
  description: "Registra tus comidas en 3 segundos con foto, voz y escáner. El Chequeo de Grasas Ocultas atrapa lo que la cámara no ve. 3 días gratis y aviso antes de cobrar.",
};
export const viewport: Viewport = { themeColor: "#F6F8F1", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${figtree.variable}`}>
      <body><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
