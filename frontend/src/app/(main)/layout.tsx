"use client";

import {Navbar} from "@/widgets/navbar";
import {ReactNode} from "react";

export default function MainLayout({children}: Readonly<{ children: ReactNode; }>) {
    return <>
        <main className="w-full mx-auto max-w-screen-2xl relative py-4">
            {children}
        </main>
        <Navbar/>
    </>
}
