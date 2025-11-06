"use client";

import {Search} from "@/shared/ui/icons/Search";

const SearchInput = ({className = "", ...props}: any) => {
    return <div className={`relative ${className}`}>
        <input name="search" type="text"
               className="pl-1.5 pr-8 py-2 text-xs placeholder:font-light placeholder:text-3xl text-inactive bg-tertiary rounded-xl font-normal w-full outline-primary" {...props} />
        <Search className="absolute top-1/2 right-2 -translate-y-1/2 text-inactive"/>
    </div>
}

export default SearchInput;