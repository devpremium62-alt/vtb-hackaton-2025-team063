import * as yup from "yup";

export const schema = yup
    .object({
        chilAccountnewLimit: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите лимит")
            .min(1, "Минимальный лимит - 1₽")
            .max(10000000, "Максимальный лимит - 100 000₽"),
    })
    .required();