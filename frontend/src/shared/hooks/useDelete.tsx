import {usePopup} from "@/providers/GlobalPopupProvider";
import {MutationFunction, useMutation} from "@tanstack/react-query";
import {Delete} from "@/shared/ui/icons/Delete";

function useDelete(id: number | string, mutationFn: MutationFunction<unknown, any>, onSuccess: Function, deletionText: string) {
    const {showPopup, closePopup} = usePopup();

    const {mutate, isPending} = useMutation({
        mutationFn,
        onSuccess: () => {
            closePopup();
            onSuccess();
        },
    });

    function onDelete() {
        if (isPending) {
            return;
        }

        showPopup({
            text: deletionText,
            background: "var(--error-color)",
            icon: () => <Delete/>,
        });

        mutate(id);
    }

    return onDelete;
}

export default useDelete;