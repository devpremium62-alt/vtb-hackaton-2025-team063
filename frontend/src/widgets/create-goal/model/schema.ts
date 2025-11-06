import * as yup from "yup";

export const schema = yup
    .object({
        goalName: yup
            .string()
            .required("Введите название цели")
            .min(1, "Название слишком короткое")
            .max(128, "Название не должно превышать 128 символов"),

        goalValue: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму цели")
            .min(1, "Минимальный сумма - 1₽")
            .max(1000000000, "Максимальная сумма - 1 000 000 000₽"),

        goalIcon: yup
            .string()
            .required("Выберите иконку"),
    })
    .required();