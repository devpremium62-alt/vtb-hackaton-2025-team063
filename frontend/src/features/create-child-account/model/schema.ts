import * as yup from "yup";

export const schema = yup
    .object({
        accountMoneyPerDay: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите дневной лимит")
            .min(1, "Минимальный сумма - 1₽")
            .max(1000000000, "Максимальная сумма - 1 000 000₽"),

        accountBankId: yup
            .string()
            .required("Выберите банк"),

        accountAvatar: yup
            .mixed()
            .required('Загрузите изображение')
            .test(
                "is-valid-type",
                "Неподдерживаемый формат изображения",
                (value: any) => value && ['image/jpeg', 'image/png'].includes(value.type)
            )
            .test(
                "is-valid-size",
                "Максимальный размер изображения - 50МБ",
                (value: any) => value && value.size <= 50_000_000
            )
    })
    .required();