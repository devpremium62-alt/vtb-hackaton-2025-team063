import type {Metadata, Viewport} from "next";
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import '@mantine/dates/styles.css';
import "./globals.css";
import localFont from "next/font/local";
import MantineClientProvider from "@/providers/MantineClientProvider";
import {ColorSchemeScript} from "@mantine/core";
import ServiceWorker from "@/providers/ServiceWorker";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import {PopupProvider} from "@/providers/GlobalPopupProvider";

const sfPro = localFont({
    src: [
        {
            path: "./fonts/SF-Pro-Display-Light.otf",
            weight: "300",
            style: "light",
        },
        {
            path: "./fonts/SF-Pro-Display-Regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/SF-Pro-Display-Medium.otf",
            weight: "500",
            style: "medium",
        },
        {
            path: "./fonts/SF-Pro-Display-Semibold.otf",
            weight: "600",
            style: "semibold",
        },
        {
            path: "./fonts/SF-Pro-Display-Bold.otf",
            weight: "700",
            style: "bold",
        },
    ],
    variable: "--font-sf-pro",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Семейный Мультибанк",
    description: "Семейный Мультибанк - приложение для управления общими финансами пары. Общий баланс, планирование бюджета, финансовые цели, детские счета и аналитика расходов. Безопасное подключение банковских счетов.",
    manifest: "/manifest.json",
    icons: {
        icon: "/icons/icon-192x192.png",
        apple: "/icons/icon-512x512.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#0066ff",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <html lang="ru" data-mantine-color-scheme="light">
    <head>
        <ColorSchemeScript defaultColorScheme="light"/>
    </head>
    <body className={`${sfPro.variable} antialiased bg-[#F8F9FB] text-white relative`}>
        <ReactQueryProvider>
            <MantineClientProvider>
                <PopupProvider>
                    {children}
                </PopupProvider>
            </MantineClientProvider>
            <ServiceWorker/>
        </ReactQueryProvider>
    </body>
    </html>
}
