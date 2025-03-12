import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/ui/home/nav-bar";

const roboto = Roboto({
  weight:['400', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WindPMS",
  description: "AI-Powered predictive maintenance system for wind turbines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased text-text`}
      >
        <div>
            <NavBar/>
            <div className="">{children}</div>
        </div>
      </body>
    </html>
  );
}
