"use client";

import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import {getWallets, WalletItem} from "@/entities/wallet";
import {useState} from "react";
import {CreateWallet} from "@/widgets/create-wallet";
import {useQuery} from "@tanstack/react-query";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";

const Wallets = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: wallets = []} = useQuery({
        queryKey: ["wallets"],
        queryFn: getWallets,
        refetchInterval: 5000
    });

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Кошелек</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать кошелек
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {wallets.length
                    ? wallets.map((item) => (
                        <WalletItem key={item.id} item={item}/>
                    ))
                    : <CollectionEmpty>У вас пока нет созданных кошельков</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <CreateWallet isActive={isModalOpen} setActive={setModalOpen}/>
    </section>
}

export default Wallets;