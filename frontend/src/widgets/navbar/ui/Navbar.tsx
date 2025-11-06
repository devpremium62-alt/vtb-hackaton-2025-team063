"use client";

import NavLink from "@/shared/ui/NavLink";
import {Card} from "@/shared/ui/icons/Card";
import {Enchant} from "@/shared/ui/icons/Enchant";
import {Money} from "@/shared/ui/icons/Money";
import {Settings} from "@/shared/ui/icons/Settings";
import {usePathname} from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();
    const hideNavbar = ["/register"].includes(pathname);

    if(hideNavbar) {
        return <></>;
    }

    return <div className="fixed bottom-4 z-20 flex justify-center left-0 right-0 w-full">
        <nav
            className="navbar flex justify-between md:justify-evenly md:w-1/2 lg:w-1/3 xl:w-1/4 items-stretch rounded-xl px-6 py-3 gap-8 text-center list-none">
            <li>
                <NavLink
                    className="h-full text-[0.7rem] text-light font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/dashboard">
                    <Card className="mb-0.5 flex-1"/>
                    Обзор
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="h-full text-[0.7rem] text-light font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/expenses">
                    <Money className="mb-0.5 flex-1"/>
                    Расходы
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="h-full text-[0.7rem] text-light font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/budget">
                    <Enchant className="mb-0.5 flex-1"/>
                    Бюджет
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="h-full text-[0.7rem] text-light font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/settings">
                    <Settings className="mb-0.5 flex-1"/>
                    Настройки
                </NavLink>
            </li>
        </nav>
    </div>;
}