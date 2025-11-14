import {BankIcon, BankKey, banks, Consent, deleteConsent} from "@/entities/bank";
import {Check} from "@/shared/ui/icons/Check";
import {motion} from "framer-motion";
import {useQueryClient} from "@tanstack/react-query";
import useDelete from "@/shared/hooks/useDelete";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {Time} from "@/shared/ui/icons/Time";

type Props = {
    bankId: BankKey;
    consent?: Consent;
    onClick: (bankId: BankKey) => void;
}

export const ConnectableBank = ({bankId, consent, onClick}: Props) => {
    const queryClient = useQueryClient();
    const onDelete = useDelete(bankId, deleteConsent, onSuccess, "Удаление согласия...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["consents"]});
    }

    let bgColor = "bg-tertiary";
    let icon = () => <></>
    switch (consent?.status) {
        case "active":
            bgColor = "bg-primary-light";
            icon = () => <Check className="text-active"/>;
            break;
        case "pending":
            bgColor = "bg-warning-light";
            icon = () => <Time className="text-warning"/>;
            break;
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete canSwipe={Boolean(consent)} onDelete={onDelete}>
            <article
                onClick={() => onClick(bankId)}
                className={`${bgColor} rounded-xl cursor-pointer px-1.5 py-2.5`}>
                <motion.div className="flex items-center justify-between"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <div className="flex items-center gap-2">
                        <BankIcon bankId={bankId}/>
                        <p className="text-base font-semibold">{banks[bankId].name}</p>
                    </div>
                    {consent ? icon() : <></>}
                </motion.div>
            </article>
        </SwipeForDelete>
    </div>
}