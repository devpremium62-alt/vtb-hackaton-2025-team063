import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";
import { fetchMock } from "@/shared/lib/fetchMock";
import {PartnerType} from "@/entities/partner";

export default async function Settings() {
    const profile = await fetchMock("/api/users");
    profile.partners = profile.partners.map((p: PartnerType) => ({...p, date: new Date(p.date)}));

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <MyProfile settings={profile.settings}/>
            </div>
            <div>
                <ManageFamily partners={profile.partners}/>
                <AppData/>
            </div>
        </div>
    </div>
}