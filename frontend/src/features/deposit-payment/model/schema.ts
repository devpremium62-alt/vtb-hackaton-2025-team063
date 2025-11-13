import * as yup from "yup";
import {AccountType} from "@/entities/account/model/types";
import {validateBalanceFromCtx} from "@/shared/lib/validateBalanceFromCtx";

export const schema = yup
    .object({
        depositAccount: yup
            .mixed<AccountType>()
            .required('Выберите счет')
            .test(
                "enough-balance",
                "Недостаточно средств на счёте",
                    validateBalanceFromCtx
            ),
    })
    .required();