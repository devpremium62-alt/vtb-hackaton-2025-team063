"use client";

import AccentButton from "@/shared/ui/AccentButton";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {logoutUser} from "@/entities/user/api/api";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const DeleteDataModal = ({isActive, setActive}: Props) => {
    const router = useRouter();

    const {mutate: logout, isPending} = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            router.push("/login");
        },
    });

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5 text-center">
            <p>Вы уверены, что хотите очистить данные приложения?</p>
        </div>
        <div className="flex items-center justify-center gap-1">
            <AccentButton background="bg-light" type="button" onClick={() => setActive(false)}>Отмена</AccentButton>
            <AccentButton background="bg-error" type="submit" onClick={() => logout()}>Очистить</AccentButton>
        </div>
    </ModalWindow>;
}

export default DeleteDataModal;