import RegisterHead from "@/app/register/RegisterHead";

export default function MainHead() {
    return <RegisterHead>
        <h1 className="text-3xl font-semibold leading-none mb-1.5">Добро пожаловать в семейный мультибанк!</h1>
        <p className="max-w-72 font-normal text-secondary leading-tight">Единое финансовое пространство для вас и ваших
            близких</p>
    </RegisterHead>;
}