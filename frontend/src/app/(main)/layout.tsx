"use client";

import {Navbar} from "@/widgets/navbar";
import useAuthGuard from "@/shared/hooks/useAuthGuard";

export default function MainLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    useAuthGuard();

    return <>
        <main className="w-full mx-auto max-w-screen-2xl relative py-4">
            {children}
        </main>
        <Navbar/>
    </>
}
