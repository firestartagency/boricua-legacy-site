import type { Metadata } from "next";
import { Noto_Serif, Great_Vibes } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
    subsets: ["latin"],
    variable: "--font-noto-serif",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    variable: "--font-great-vibes",
    display: "swap",
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "Boricua Legacy",
    description: "The Women Who Made History",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </head>
            <body className={`${notoSerif.variable} ${greatVibes.variable}`}>
                {children}
            </body>
        </html>
    );
}
