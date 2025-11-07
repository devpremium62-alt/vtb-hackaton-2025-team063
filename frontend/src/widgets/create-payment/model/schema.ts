import * as yup from "yup";

export const schema = yup
    .object({
        paymentName: yup
            .string()
            .required("Введите название платежа")
            .min(1, "Название слишком короткое")
            .max(128, "Название не должно превышать 128 символов"),

        paymentValue: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму платежа")
            .min(1, "Минимальная сумма - 1₽")
            .max(10000000, "Максимальная сумма - 1 000 000₽"),

        paymentDate: yup
            .date()
            .required("Выберите дату платежа")
            .test('is-future', 'Дата платежа должна быть в будущем', (value) => {
                if (!value) {
                    return true;
                }

                return value > new Date();
            }),

        paymentCategory: yup
            .string()
            .required("Выберите категорию платежа"),
    })
    .required();