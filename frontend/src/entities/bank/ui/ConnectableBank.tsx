import {Bank, BankIcon, BankKey, deleteConsent} from "@/entities/bank";
import {Check} from "@/shared/ui/icons/Check";
import {motion} from "framer-motion";
import {useQueryClient} from "@tanstack/react-query";
import useDelete from "@/shared/hooks/useDelete";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";

type Props = {
    bankId: BankKey;
    bank: Bank;
    isConnected: boolean;
    onClick: (bankId: BankKey) => void;
}

export const ConnectableBank = ({bankId, bank, isConnected, onClick}: Props) => {
    const queryClient = useQueryClient();
    const onDelete = useDelete(bankId, deleteConsent, onSuccess, "Удаление согласия...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["consents"]});
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete canSwipe={isConnected} onDelete={onDelete}>
            <article
                onClick={() => onClick(bankId)}
                className={`${isConnected ? "bg-primary-light" : "bg-tertiary"} rounded-xl cursor-pointer px-1.5 py-2.5`}>
                <motion.div className="flex items-center justify-between"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <div className="flex items-center gap-2">
                        <BankIcon bankId={bankId}/>
                        <p className="text-base font-semibold">{bank.name}</p>
                    </div>
                    {isConnected && <div className="text-active"><Check/></div>}
                </motion.div>
            </article>
        </SwipeForDelete>
    </div>
}