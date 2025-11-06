import * as yup from "yup";

export const schema = yup
    .object({
        walletName: yup
            .string()
            .required("Введите название кошелька")
            .min(1, "Название слишком короткое")
            .max(128, "Название не должно превышать 128 символов"),

        walletLimit: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите лимит кошелька")
            .min(1, "Минимальный лимит - 1₽")
            .max(10000000, "Максимальный лимит - 10 000 000₽"),

        walletCategory: yup
            .string()
            .required("Укажите категорию кошелька"),

        walletPeriod: yup
            .string()
            .required("Выберите период списания"),

        walletBank: yup
            .string()
            .required("Выберите банк"),
    })
    .required();