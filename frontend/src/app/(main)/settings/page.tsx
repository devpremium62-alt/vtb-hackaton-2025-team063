import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";
import fetchWrap from "@/shared/lib/fetchWrap";
import {PartnerType} from "@/entities/partner";

export default async function Settings() {
    const profile = await fetchWrap("/api/users");
    profile.partners = profile.partners.map((p: PartnerType) => ({...p, date: new Date(p.date)}));

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <MyProfile profileData={profile.profile} settings={profile.settings}/>
            </div>
            <div>
                <ManageFamily partners={profile.partners}/>
                <AppData/>
            </div>
        </div>
    </div>
}