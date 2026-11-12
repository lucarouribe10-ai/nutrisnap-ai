import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap" });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "NutriSnap AI — Tu foto no ve el aceite. NutriSnap sí lo pregunta",
  description: "Registra tus comidas en 3 segundos con foto, voz y escáner. El Chequeo de Grasas Ocultas atrapa lo que la cámara no ve. 7 días gratis y aviso antes de cobrar.",
};
export const viewport: Viewport = { themeColor: "#EFF2ED", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${jakarta.variable} ${hanken.variable}`}>
      <body><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
