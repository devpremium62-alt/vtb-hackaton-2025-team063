import {type AccountType} from "@/entities/account/model/types";
import Heading from "@/shared/ui/typography/Heading";
import Image from "next/image";

type Props = {
    className?: string;
    style?: object;
    account: AccountType;
}

export const Account = ({account, className = "", ...props}: Props) => {
    return <div className={`bg-tertiary rounded-xl px-2 py-1 ${className}`} {...props}>
        <div className="flex items-center gap-2 mb-2">
            <div className="w-[2.375rem] h-[2.375rem] relative">
                <Image src={account.avatar} alt={account.name} fill />
            </div>
            <Heading level={3}>{account.name}</Heading>
        </div>
        <div className="text-secondary">
            <p className="text-[0.6rem]">Баланс</p>
            <p className="text-2xl xxs:text-3xl leading-none font-semibold">{new Intl.NumberFormat('ru-RU').format(account.balance)} ₽</p>
        </div>
    </div>;
}