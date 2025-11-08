export type ExpenseCategoryName =
    "ЖКХ и связь"
    | "Продукты"
    | "Транспорт"
    | "Кафе и рестораны"
    | "Развлечения"
    | "Одежда и обувь"
    | "Здоровье"
    | "Подарки"
    | "Прочее";

export type ExpenseCategoryType = {
    id: number;
    name: ExpenseCategoryName;
    spent: number;
    color: string;
    icon: string;
}

export const ExpensesCategoryIcons: Record<ExpenseCategoryName, string> = {
    "ЖКХ и связь": "tv.png",
    "Продукты": "cart.png",
    "Транспорт": "car.png",
    "Кафе и рестораны": "pizza.png",
    "Развлечения": "movie.png",
    "Одежда и обувь": "clothes.png",
    "Здоровье": "pills.png",
    "Подарки": "gift.png",
    "Прочее": "lightning.png",
}

export const ExpensesCategoryColors: Record<ExpenseCategoryName, string> = {
    "ЖКХ и связь": "#C3CCEF",
    "Продукты": "#BED3CB",
    "Транспорт": "#C3D1DF",
    "Кафе и рестораны": "#F2B8BE",
    "Развлечения": "#FBDAB0",
    "Одежда и обувь": "#D5C7D9",
    "Здоровье": "#BEE4F5",
    "Подарки": "#F7BFC5",
    "Прочее": "#D1D2D3",
}

export const ExpensesCategoriesOptions = [
    {label: "Развлечения", value: "1"},
    {label: "Продукты", value: "2"},
    {label: "ЖКХ и связь", value: "3"},
    {label: "Транспорт", value: "4"},
    {label: "Одежда и обувь", value: "5"},
    {label: "Подарки", value: "6"},
    {label: "Здоровье", value: "7"},
    {label: "Кафе и рестораны", value: "8"},
    {label: "Прочее", value: "9"},
]
