import { Poppins } from "next/font/google";
import "./globals.css";

const myFont = Poppins({
  weight: ['200', '300', '400', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--my-font",
});

export const metadata = {
  title: "Gamescript",
  description: "Netflix clone that simulates a cloud-based gaming site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${myFont.variable} font-sans antialiased bg-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
