import {useQuery} from "@tanstack/react-query";
import {BankKey, banks, getConsents} from "@/entities/bank";
import {Control, Controller} from "react-hook-form";
import Select from "@/shared/ui/inputs/Select";
import {useMemo} from "react";

type Props = {
    name: string;
    control: Control<any, any, any>;
    error?: string;
}

const BankSelect = ({name, control, error}: Props) => {
    const {data: consents = []} = useQuery({
        queryKey: ["consents"],
        queryFn: getConsents,
    });

    const bankToConsent = useMemo(() => {
        return Object.fromEntries(consents.map(c => [c.bankId, c.clientId]));
    }, [consents]);

    return <div className="mb-2.5 flex flex-col">
        <label className="font-medium text-sm mb-1" htmlFor="goalBankId">Банк</label>
        <Controller
            name="goalBankId"
            control={control}
            render={({field}) => (
                <Select error={error}
                        onChange={(value) => field.onChange(value)}
                        large placeholder="Выберите банк" value={field.value} id="goalBankId"
                        options={Object.keys(bankToConsent).map((bankId) => ({
                            value: bankId,
                            label: banks[bankId as BankKey].name
                        }))}/>
            )}
        />
    </div>;
}

export default BankSelect;