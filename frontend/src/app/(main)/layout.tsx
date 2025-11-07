import {Navbar} from "@/widgets/navbar";

export default function MainLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <>
        <main className="w-full mx-auto max-w-screen-2xl relative py-4">
            {children}
        </main>
        <Navbar/>
    </>
}
