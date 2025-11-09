import {useEffect} from "react";
import {useRouter} from "next/navigation";

function useAuthGuard() {
    const router = useRouter();

    useEffect(() => {
        const value = localStorage.getItem("user");
        if(!value) {
            router.push("/register");
        }
    }, []);
}

export default useAuthGuard;