import Heading from "@/shared/ui/typography/Heading";
import {BankKey, banks, Consent} from "@/entities/bank";
import {Time} from "@/shared/ui/icons/Time";

type Props = {
    bankId: BankKey;
    selectBank: (bankId: BankKey) => void;
    consent?: Consent;
}

export const ConnectableBankOnRegister = ({bankId, selectBank, consent}: Props) => {
    let color = "bg-white";
    let icon = () => <></>
    switch (consent?.status) {
        case "active":
            color = "text-white bg-primary";
            break;
        case "pending":
            color = "bg-warning-light";
            icon = () => <Time className="text-warning"/>;
            break;
    }

    return <button key={bankId} onClick={() => selectBank(bankId)}
                   className={`p-5 flex items-center justify-between rounded-xl text-left cursor-pointer duration-300 transition-colors ${color}`}>
        <Heading className="leading-none!" level={3}>{banks[bankId].name}</Heading>
        {consent ? icon() : <></>}
    </button>;
}