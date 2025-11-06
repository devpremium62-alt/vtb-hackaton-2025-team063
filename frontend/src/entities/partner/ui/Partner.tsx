import {PartnerType} from "@/entities/partner";
import Avatar from "@/shared/ui/Avatar";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useState} from "react";
import AccentButton from "@/shared/ui/AccentButton";
import {motion} from "framer-motion";


type ModalProps = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const DisconnectPartner = ({isActive, setActive}: ModalProps) => {
    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <p>Вы уверены, что хотите удалить партнера?</p>
        </div>
        <div className="flex items-center justify-center gap-1">
            <AccentButton background="bg-light" type="button" onClick={() => setActive(false)}>Отмена</AccentButton>
            <AccentButton background="bg-error" type="submit">Удалить</AccentButton>
        </div>
    </ModalWindow>
}

type Props = {
    partner: PartnerType;
}

export const Partner = ({partner}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return <article className="px-1.5 py-2.5 bg-tertiary rounded-xl ">
        <motion.div className="flex items-center justify-between"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <div className="flex items-center gap-2">
                <Avatar avatar={partner.avatar}/>
                <p className="text-base font-medium">{partner.name}</p>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
                <Status partner={partner}/>
                {partner.status === "connected" &&
                    <button onClick={() => setModalOpen(true)}
                            className="text-light text-[0.6rem] cursor-pointer">Отключить</button>}
            </div>
        </motion.div>
        {partner.status === "connected" && <DisconnectPartner isActive={isModalOpen} setActive={setModalOpen}/>}
    </article>
}

const Status = ({
                    partner
                }: Props) => {
    const baseClass = "py-1.5 px-2.5 rounded-2xl text-xs text-white tracking-wide";

    switch (partner.status) {
        case "connected":
            return <p className={`${baseClass} bg-primary`}>Партнер подключен {partner.date.toLocaleDateString()}</p>;
        case "disconnected":
            return <p className={`${baseClass} bg-error`}>Партнер отклонен</p>;
    }
}