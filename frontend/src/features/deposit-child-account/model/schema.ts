import * as yup from "yup";
import {AccountType} from "@/entities/account/model/types";
import {validateBalance} from "@/shared/lib/validateBalanceFromCtx";

export const schema = yup
    .object({
        chilAccountnewAdd: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму пополнения")
            .min(1, "Минимальная сумма - 1₽")
            .max(10000000, "Максимальная сумма - 1 000 000₽"),

        childAccountFrom: yup
            .mixed<AccountType>()
            .required('Выберите счет')
            .when("chilAccountnewAdd", (amount, schema) =>
                schema.test(
                    "enough-balance",
                    "Недостаточно средств на счёте",
                    (account) => validateBalance(account, amount)
                )
            ),
    })
    .required();