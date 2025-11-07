import {AccountAggregate, type AccountAggregateType} from "@/entities/account";

type Props = {
    firstAccount: AccountAggregateType;
    secondAccount: AccountAggregateType;
}

const Accounts = ({firstAccount, secondAccount}: Props) => {
    return <section className="flex items-center mb-6 gap-2.5 mx-4 md:mr-0">
        <AccountAggregate className="flex-1" account={firstAccount}/>
        <AccountAggregate className="flex-1" account={secondAccount}/>
    </section>
}

export default Accounts;