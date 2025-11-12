"use client";

import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Avatar from "@/shared/ui/Avatar";
import AccentButton from "@/shared/ui/AccentButton";
import {ChildAccountType} from "@/entities/child-account";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {useQueryClient} from "@tanstack/react-query";
import useDelete from "@/shared/hooks/useDelete";
import {deleteChildAccount} from "@/entities/child-account/api/api";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";

type Props = {
    account: ChildAccountType;
    onDepositClick: (account: ChildAccountType) => void;
}

export const ChildAccountSimple = ({account, onDepositClick}: Props) => {
    const queryClient = useQueryClient();
    const onDelete = useDelete(account.id, deleteChildAccount, onSuccess, "Удаление детского счета...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["child-accounts"]});
        queryClient.invalidateQueries({queryKey: ["transactions"]});
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete direction="y" onDelete={onDelete}>
            <motion.article className="bg-tertiary rounded-xl py-2 px-1.5"
                            exit={{opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0}}
                            transition={{duration: 0.3}}
                            layout>
                <motion.div initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <div className="flex items-start justify-between mb-5">
                        <p className="text-3xl mb-0.5 leading-none font-bold">
                            <MoneyAmount value={account?.balance || 0}/>
                        </p>
                        <Avatar avatar={getAbsoluteSeverUrl(account?.avatar)} alt="Ребенок"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-light font-medium text-xs mb-0.5">
                                <MoneyAmount value={account?.moneyPerDay || 0}/> в день
                            </p>
                            <div className="w-2/3">
                                <ProgressBar indicators value={(account?.moneyPerDay || 0) * 30}
                                             max={account?.balance || 0}/>
                            </div>
                        </div>
                        <div>
                            <AccentButton onClick={() => onDepositClick(account)}>Пополнить</AccentButton>
                        </div>
                    </div>
                </motion.div>
            </motion.article>
        </SwipeForDelete>
    </div>;
}
