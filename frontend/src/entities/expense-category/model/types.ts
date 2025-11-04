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
    name: ExpenseCategoryName;
    spent: number;
    color: string;
    icon: string;
}

export const ExpenseseCategoryIcons: Record<ExpenseCategoryName, string> = {
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

export const ExpenseseCategoryColors: Record<ExpenseCategoryName, string> = {
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
