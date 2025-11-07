import * as yup from "yup";

export const schema = yup
    .object({
        limitName: yup
            .string()
            .required("Введите название лимита")
            .min(1, "Название слишком короткое")
            .max(128, "Название не должно превышать 128 символов"),

        limitValue: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите значение лимит")
            .min(1, "Минимальный лимит - 1₽")
            .max(10000000, "Максимальный лимит - 10 000 000₽"),

        limitCategory: yup
            .string()
            .required("Укажите категорию лимита"),
    })
    .required();