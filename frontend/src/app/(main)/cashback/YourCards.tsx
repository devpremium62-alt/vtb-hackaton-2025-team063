"use client";

import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import Heading from "@/shared/ui/typography/Heading";
import {UserType} from "@/entities/user";
import {
    CashbackCard,
    CashbackType,
    CategoryCashback,
    getFamilyCashback
} from "@/entities/cashback";
import React, {useMemo, useState} from "react";
import {Carousel} from "@mantine/carousel";
import {AnimatePresence} from "framer-motion";
import {useMediaQuery} from "@mantine/hooks";

type Props = {
    familyInitial: UserType[];
    cashbackInitial: CashbackType[];
    className?: string;
}

const BestCashbackList = ({familyInitial, cashbackInitial, className = ""}: Props) => {
    const [activeSlide, setActiveSlide] = useState(0);

    const {data: family = []} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    const {data: cashback = []} = useQuery({
        queryKey: ["family-cashback"],
        initialData: cashbackInitial,
        queryFn: getFamilyCashback,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    const firstAvatar = family[0] ? family[0].avatar : "";
    const firstId = family[0] ? family[0].id : "";
    const secondAvatar = family[1] ? family[1].avatar : "";

    const isLarge = useMediaQuery("(min-width: 1200px)");

    const visibleCards = useMemo(() => {
        const slideSizePercent = isLarge ? 33 : 50;
        const visibleCount = Math.floor(100 / slideSizePercent);
        const start = activeSlide;
        const end = activeSlide + visibleCount - 1;

        return cashback.slice(start, end + 1);
    }, [isLarge, activeSlide, cashback]);

    return <section className={`${className} mb-[1.875rem]`}>
        <Heading className="mb-2.5" level={2}>Ваши карты</Heading>
        <div className="flex flex-col gap-1">
            <AnimatePresence>
                <Carousel className="mb-5" withIndicators slideGap="0.625rem" withControls={false}
                          emblaOptions={{ align: 'start', slidesToScroll: isLarge ? 3 : 2 }}
                          slideSize={{base: '50%', lg: "33%"}} onSlideChange={setActiveSlide} classNames={{
                              indicators: "-bottom-3!",
                              indicator: "transition-all",
                          }}>
                    {
                        cashback.map((card) => {
                            return <Carousel.Slide key={card.card + card.user}>
                                <CashbackCard avatar={card.user === firstId ? firstAvatar : secondAvatar}
                                              cardWithCashback={card}/>
                            </Carousel.Slide>;
                        })
                    }
                </Carousel>
            </AnimatePresence>
            <div className="grid grid-cols-2 1200:grid-cols-3 gap-2.5">
                {visibleCards.map((card) => {
                    return <div key={card.card + card.user} className="flex flex-col gap-1">
                        {card.cashback.map(c => <CategoryCashback key={c.category} categoryCashback={c}/>)}
                    </div>
                })}
            </div>
        </div>
    </section>
}

export default BestCashbackList;