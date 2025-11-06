type Props = {
    value: number;
    showCurrency?: boolean;
}

const MoneyAmount = ({value, showCurrency = true}: Props) => {
    return <>{value.toLocaleString("ru-RU", { useGrouping: true, minimumFractionDigits: 0 })}{showCurrency ? '₽' : ''}</>;
}

export default MoneyAmount;