import SharedBalance from "@/app/dashboard/SharedBalance";
import Accounts from "@/app/dashboard/Accounts";
import ShortGoals from "@/app/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/dashboard/ShortUpcomingPayments";
import ShortChildAccount from "@/app/dashboard/ShortChildAccount";

export default async function Dashboard() {
    return <div>
        <SharedBalance personFirst={{avatar: "/images/man.png", accountDigits: "0934"}}
                       personSecond={{avatar: "/images/woman.png", accountDigits: "1289"}} balance={12345000}
                       monthlyIncome={120000}/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Accounts firstAccount={{name: "Мария", balance: 120000, avatar: "/images/woman.png"}}
                          secondAccount={{name: "Пётр", balance: 120000, avatar: "/images/man.png"}}/>
                <ShortUpcomingPayments payments={[
                    {
                        date: new Date(2025, 10, 3),
                        money: 5000,
                        name: "На квартиру",
                        payed: true
                    },
                    {
                        date: new Date(2025, 10, 2),
                        money: 4500,
                        name: "Детский счет",
                        payed: false
                    },
                    {
                        date: new Date(2025, 10, 10),
                        name: "Подписка",
                        money: 500,
                        payed: false
                    },
                    {
                        date: new Date(2025, 10, 20),
                        name: "Кредит",
                        money: 10000,
                        payed: false
                    },
                    {
                        date: new Date(2025, 11, 3),
                        money: 5000,
                        name: "На квартиру",
                        payed: false
                    }
                ]}/>
            </div>
            <div>
                <ShortGoals goals={[
                    {
                        id: 1,
                        name: "Поездка на море",
                        deadline: new Date(2025, 8, 29),
                        moneyCollected: 200000,
                        moneyNeed: 230000
                    },
                    {
                        id: 2,
                        name: "Квартира у моря",
                        deadline: new Date(2026, 3, 14),
                        moneyCollected: 80000000,
                        moneyNeed: 450000000
                    },
                ]}/>
                <ShortChildAccount moneyCollected={50000} moneyPerDay={2500} avatar="/images/woman.png"/>
            </div>
        </div>
    </div>
}