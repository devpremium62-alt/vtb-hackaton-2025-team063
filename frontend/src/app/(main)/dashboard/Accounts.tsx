import {Account, type AccountType} from "@/entities/account";

type Props = {
    firstAccount: AccountType;
    secondAccount: AccountType;
}

const Accounts = ({firstAccount, secondAccount}: Props) => {
    return <section className="flex items-center mb-6 gap-2.5 mx-4 md:mr-0">
        <Account className="flex-1" account={firstAccount}/>
        <Account className="flex-1" account={secondAccount}/>
    </section>
}

export default Accounts;