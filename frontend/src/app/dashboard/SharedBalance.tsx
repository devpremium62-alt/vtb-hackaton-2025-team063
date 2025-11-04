import Image, {StaticImageData} from "next/image";
import Heading from "@/shared/ui/typography/Heading";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import Avatar from "@/shared/ui/Avatar";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";

type Person = {
    avatar: string | StaticImageData;
    accountDigits: string;
}

type Props = {
    personFirst: Person;
    personSecond: Person;
    balance: number;
    monthlyIncome: number;
}

const SharedBalance = ({personFirst, personSecond, balance, monthlyIncome}: Props) => {
    return <section className="p-2 rounded-xl bg-shared-balance mb-5 text-white mx-4">
        <div className="mb-12 flex items-center justify-between">
            <CoupleAvatars firstAvatar={personFirst.avatar} secondAvatar={personSecond.avatar}/>
            <div className="bg-primary px-3 py-1.5 rounded-2xl shadow-xl z-1">
                <p className="text-base font-semibold leading-tight">+ <MoneyAmount value={monthlyIncome}/></p>
            </div>
        </div>

        <div className="flex items-end justify-between">
            <div>
                <p className="text-xs font-light mb-0.5 leading-tight">Общий баланс</p>
                <Heading level={1} className="flex items-center gap-1 tracking-[-0.06rem] leading-none mb-0 text-3xl xxs:text-4xl font-bold text-white">
                    <BalanceCounter value={balance}/>
                </Heading>
            </div>
            <div>
                <p className="text-base font-semibold leading-tight flex items-center gap-0.5">
                    <span>{personFirst.accountDigits}</span>
                    <span>•</span>
                    <span>{personSecond.accountDigits}</span>
                </p>
            </div>
        </div>
    </section>
}

export default SharedBalance;