import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s · Família Palitot",
    default: "Família Palitot · Nossas memórias",
  },
  description:
    "Um espaço íntimo da família Palitot para guardar e celebrar nossas memórias juntos.",
  metadataBase: new URL("https://palitot.com.br"),
  openGraph: {
    siteName: "Família Palitot",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: false, // Site privado — não indexar no Google
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2D4A2D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
