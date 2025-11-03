import type { Metadata } from "next";
import { QueryProviders } from "./providers/QueryProvider";
import "./global.css";
import { Navbar } from "../components/Navbar";
import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "GardenBook",
  description: "Discover & Book Beautiful Garden Spaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div id="root">
          <QueryProviders>
             <Navbar />
            {children}
            </QueryProviders>
        </div>
      </body>
    </html>
  );
}
