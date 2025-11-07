import {Dispatch, ReactNode, SetStateAction} from "react";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
}

const ModalWindow = ({isActive, setActive, children}: Props) => {
    return <div onClick={() => setActive(false)} className={`modal px-4 overflow-y-auto fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 transition-opacity duration-300 ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div onClick={e => e.stopPropagation()} className={`min-w-[300px] py-2.5 px-4 rounded-xl bg-white transition-transform duration-300 ${isActive ? "translate-y-0" : "-translate-y-1/2"}`}>
            {children}
        </div>
    </div>
}

export default ModalWindow;