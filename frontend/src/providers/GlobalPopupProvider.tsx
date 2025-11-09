"use client";

import {createContext, useContext, useState, ReactNode, useCallback} from "react";
import GlobalPopup from "@/shared/ui/popups/GlobalPopup";

type PopupData = {
    id?: number;
    opened?: boolean;
    text: string;
    background?: string;
    icon?: () => ReactNode;
};

type PopupContextType = {
    showPopup: (data: PopupData) => void;
    closePopup: () => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export const usePopup = () => {
    return useContext(PopupContext) as PopupContextType;
};

export const PopupProvider = ({children}: {children: ReactNode}) => {
    const [popup, setPopup] = useState<PopupData | null>(null);

    const showPopup = useCallback((data: PopupData) => {
        setPopup({...data, opened: true, id: Date.now()});
    }, []);

    const closePopup = useCallback(() => {
        if(popup) {
            setPopup({...popup, opened: false});
        }
    }, [popup]);

    return (
        <PopupContext.Provider value={{showPopup, closePopup}}>
            {children}
            {popup && (
                <GlobalPopup
                    id={popup.id}
                    opened={popup.opened}
                    text={popup.text || ""}
                    icon={popup.icon}
                    background={popup.background}
                />
            )}
        </PopupContext.Provider>
    );
};
