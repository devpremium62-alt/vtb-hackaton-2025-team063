import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";

export default async function Settings() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <MyProfile profileData={{
                    avatar: "/images/woman.png",
                    email: "anna@yandex.ru",
                    name: "Анна",
                    phone: "+7 (988) 675-34-34"
                }}
                pushEnabled={true}/>
            </div>
            <div>
                <ManageFamily partners={[
                    {name: "Михаил", date: new Date(2023, 9, 5), avatar: "/images/man.png", status: "connected"},
                    {name: "Михаил", date: new Date(2023, 6, 5), avatar: "/images/man.png", status: "disconnected"},
                ]}/>
                <AppData/>
            </div>
        </div>
    </div>
}