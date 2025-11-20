import SharedCashback from "@/app/(main)/cashback/SharedCashback";
import {getFamily} from "@/entities/family";
import BestCashbackList from "@/app/(main)/cashback/BestCashbackList";
import YourCards from "@/app/(main)/cashback/YourCards";
import CashbackPromo from "@/app/(main)/cashback/CashbackPromo";
import {getFamilyCashback} from "@/entities/cashback";

export default async function Cashback() {
    const [family, familyCashback] = await Promise.all([getFamily(), getFamilyCashback()]);

    return <div className="mb-24">
        <SharedCashback familyInitial={family} cashbackInitial={familyCashback}/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
            <div>
                <BestCashbackList className="mx-4 md:mr-0" familyInitial={family} cashbackInitial={familyCashback}/>
                <CashbackPromo className="mx-4 md:mr-0" cashbackInitial={familyCashback}/>
            </div>
            <div>
                <YourCards className="mx-4 md:ml-0" familyInitial={family} cashbackInitial={familyCashback}/>
            </div>
        </div>
    </div>
}