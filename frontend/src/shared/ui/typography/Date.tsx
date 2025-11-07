type Props = {
    date: Date;
}

const Date = ({date}: Props) => {
    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date).slice(0, -3);

    return <time className="text-ellipsis min-w-0 overflow-hidden whitespace-nowrap text-light font-light text-xs">{formattedDate}</time>;
}

export default Date;