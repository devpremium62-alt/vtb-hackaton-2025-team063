import {ChevronLeft} from "@/shared/ui/icons/ChevronLeft";
import {ChevronRight} from "@/shared/ui/icons/ChevronRight";
import React, {Dispatch, SetStateAction} from "react";

type Props = {
    firstPage?: boolean;
    lastPage?: boolean;
    setPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({firstPage, lastPage, setPage}: Props) => {
    return <div className="flex items-center gap-1">
        <button
            disabled={firstPage}
            onClick={() => setPage((page) => page - 1)}
            className={`cursor-pointer w-7 h-7 rounded-full flex justify-center items-center transition-color duration-300 ${!firstPage ? "active:bg-blue-200 active:text-active hover:bg-blue-200 hover:text-active" : ""} disabled:text-neutral-500`}>
            <ChevronLeft/>
        </button>
        <button
            disabled={lastPage}
            onClick={() => setPage((page) => page + 1)}
            className={`cursor-pointer w-7 h-7 rounded-full flex justify-center items-center transition-color duration-300 ${!lastPage ? "active:bg-blue-200 active:text-active hover:bg-blue-200 hover:text-active" : ""} disabled:text-neutral-500`}>
            <ChevronRight className="ml-0.5"/>
        </button>
    </div>
}

export default Pagination;