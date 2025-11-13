import {BankKey, banks} from "@/entities/bank";

type Props = {
    bankId: BankKey;
    size?: number;
    className?: string;
}

export const BankIcon = ({bankId, size = 2, className = ""}: Props) => {
    return <div style={{background: banks[bankId].iconBg, width: `${size}rem`, height: `${size}rem`}}
                className={`rounded-md text-lg flex justify-center items-center ${className}`}>
        🏦
    </div>
}