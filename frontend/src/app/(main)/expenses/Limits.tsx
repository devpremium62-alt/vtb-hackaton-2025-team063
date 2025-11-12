"use client";

import {getLimits, Limit} from "@/entities/limit";
import Heading from "@/shared/ui/typography/Heading";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {useState} from "react";
import {CreateLimit} from "@/features/create-limit";
import {useQuery} from "@tanstack/react-query";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";

const Limits = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: limits = []} = useQuery({
        queryKey: ["limits"],
        queryFn: getLimits,
        refetchInterval: 5000
    });

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-1">
            <Heading level={2}>Лимиты трат</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать лимит
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {limits.length
                    ? limits.map((limit) => (
                        <Limit key={limit.id} limit={limit}/>
                    ))
                    : <CollectionEmpty>У вас пока нет созданных лимитов</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <CreateLimit isActive={isModalOpen} setActive={setModalOpen}/>
    </section>;
}

export default Limits;