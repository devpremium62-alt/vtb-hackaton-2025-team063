import {ReactNode} from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <main className="flex min-h-screen items-center justify-center w-full">
        {children}
    </main>
}