import Heading from "@/shared/ui/typography/Heading";
import Image from "next/image";
import ProgressBar from "@/shared/ui/ProgressBar";

type Props = {
    moneyCollected: number;
    moneyNeed: number;
    avatar: string;
}

const ChildAccount = ({moneyCollected, moneyNeed, avatar}: Props) => {
    return <section className="mx-4 md:ml-0 mb-20">
        <Heading level={2}>Детский счет</Heading>
        <div className="bg-tertiary rounded-xl py-2 px-1.5">
            <div className="flex items-start justify-between mb-5">
                <p className="text-[2.5rem] mb-0.5 leading-none font-bold">{new Intl.NumberFormat('ru-RU').format(moneyCollected)} ₽</p>
                <div className="w-[2.375rem] h-[2.375rem] rounded-full relative">
                    <Image src={avatar} alt="Ребенок" fill/>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-secondary font-medium text-xs mb-0.5">
                        из {new Intl.NumberFormat('ru-RU').format(moneyNeed)}
                    </p>
                    <div className="w-2/3">
                        <ProgressBar value={moneyCollected} max={moneyNeed}/>
                    </div>
                </div>
                <div>
                    <button className="bg-accent text-white text-base font-medium px-3 py-1 rounded-2xl cursor-pointer">Пополнить</button>
                </div>
            </div>
        </div>
    </section>
}

export default ChildAccount;