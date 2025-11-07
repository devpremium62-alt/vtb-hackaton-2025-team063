import RegisterForm from "@/app/register/RegisterForm";
import WithVideoBg from "@/shared/ui/WithVideoBg";

export default async function Register() {
    return <WithVideoBg>
        <RegisterForm/>
    </WithVideoBg>
}