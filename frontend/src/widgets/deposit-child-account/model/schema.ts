import * as yup from "yup";

export const schema = yup
    .object({
        chilAccountnewAdd: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму пополнения")
            .min(1, "Минимальная сумма - 1₽")
            .max(10000000, "Максимальная сумма - 1 000 000₽"),
    })
    .required();