import { Martel_Sans } from "next/font/google";
import "./globals.css";

const martel = Martel_Sans({ 
  weight: ['200', '300', '400', '600', '700', '800', '900'],
  subsets: ["latin"], 
});

export const metadata = {
  title: "Gamescript",
  description: "Netflix clone that simulates a cloud-based gaming site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={martel.className}>{children}</body>
    </html>
  );
}
