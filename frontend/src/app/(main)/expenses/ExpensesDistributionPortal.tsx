"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@mantine/hooks";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
};

export const ExpensesDistributionPortal = ({ firstAvatar, secondAvatar }: Props) => {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        const element = document.getElementById(isDesktop ? "right-column" : "left-column");
        setTarget(element);
    }, [isDesktop]);

    if (!target) {
        return null;
    }

    return createPortal(
        <ExpensesDistribution
            className="mx-4 md:mx-0 md:order-3 md:p-3"
            firstAvatar={firstAvatar}
            secondAvatar={secondAvatar}
        />,
        target
    );
};
