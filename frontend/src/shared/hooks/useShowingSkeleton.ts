import {useEffect, useState} from "react";

function useShowingSkeleton(...deps: unknown[]) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 0);
        return () => clearTimeout(t);
    }, deps);

    return isLoading;
}

export default useShowingSkeleton;