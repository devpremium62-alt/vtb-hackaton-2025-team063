"use client";

import {Limit, LimitType} from "@/entities/limit";
import Heading from "@/shared/ui/typography/Heading";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {useState} from "react";
import {CreateLimit} from "@/widgets/create-limit";

type Props = {
    limits: LimitType[];
}

const Limits = ({limits}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-1">
            <Heading level={2}>Лимиты трат</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать лимит
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            {limits.map((limit) => (
                <Limit key={limit.id} limit={limit}/>
            ))}
        </div>
        <CreateLimit isActive={isModalOpen} setActive={setModalOpen}/>
    </section>;
}

export default Limits;