"use client";

import {motion} from "framer-motion";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {TransactionCategoryAvatar} from "@/entities/transaction-category";
import {Status} from "@/entities/wallet/ui/Status";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {deleteWallet, WalletType} from "@/entities/wallet";
import {useQueryClient} from "@tanstack/react-query";
import useDelete from "@/shared/hooks/useDelete";

type Props = {
    item: WalletType;
    onClick: (wallet: WalletType) => void;
};

export const WalletItem = ({item, onClick}: Props) => {
    const percent = Math.round(((item.amount - item.currentAmount) / item.amount) * 100);
    const isOverflow = percent >= 100;

    const queryClient = useQueryClient();
    const onDelete = useDelete(item.id, deleteWallet, onSuccess, "Удаление кошелька...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["wallets"]});
    }

    return (
        <div className="relative overflow-hidden">
            <SwipeForDelete onDelete={onDelete}>
                <motion.article onClick={() => onClick(item)}
                                className="cursor-pointer bg-tertiary md:bg-violet-100/75! rounded-xl px-2.5 py-3"
                                exit={{opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0}}
                                transition={{duration: 0.3}}
                                layout>
                    <motion.div
                        className="flex items-center justify-start gap-2"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}
                    >
                        <TransactionCategoryAvatar categoryId={item.categoryId}/>
                        <div className="flex flex-col min-w-0">
                            <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                                {item.name}
                            </p>
                            <p className="text-light font-light text-xs flex items-center gap-[0.15rem]">
                                <span className="hidden xxs:inline-block">Осталось</span>
                                <span><MoneyAmount value={Math.max(0, item.currentAmount)}/></span>
                                <span>из</span>
                                <span><MoneyAmount value={item.amount}/></span>
                            </p>
                        </div>
                        <div className="shrink-0 ml-auto flex flex-col items-end">
                            <p className={`leading-none font-bold text-xl mb-2${isOverflow ? " text-error" : ""}`}>
                                {percent}%
                            </p>
                            <div className="w-20 mb-1.5">
                                <ProgressBar value={item.amount - item.currentAmount} max={item.amount} indicators/>
                            </div>
                            <Status percent={percent}/>
                        </div>
                    </motion.div>
                </motion.article>
            </SwipeForDelete>
        </div>
    );
};