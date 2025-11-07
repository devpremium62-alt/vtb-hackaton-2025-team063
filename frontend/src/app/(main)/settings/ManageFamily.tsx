"use client";

import Heading from "@/shared/ui/typography/Heading";
import React, {useState} from "react";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Partner, PartnerType} from "@/entities/partner";
import {InvitePartner} from "@/widgets/invite-partner";

type Props = {
    partners: PartnerType[];
}

const MyProfile = ({partners}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between flex-wrap">
            <Heading level={2}>Управление семьей</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Пригласить партнера
            </AccentButton>
        </div>
        <div className="flex flex-col items-stretch gap-1 mb-[1.875rem]">
            {partners.map(partner => <Partner key={partner.date.getTime()} partner={partner}/> )}
        </div>
        <InvitePartner isActive={isModalOpen} setActive={setModalOpen} code={705726} validTo={new Date(Date.now() + 1000 * 60 * 60 * 24)}/>
    </section>
}

export default MyProfile;