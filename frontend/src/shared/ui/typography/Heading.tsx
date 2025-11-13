type Props = {
    level: number;
    className?: string;
    children: any;
}

const Heading = ({level, children, className = ""}: Props) => {
    switch (level) {
        case 1:
            return <h1 className={`text-3xl xxs:text-[2.5rem] font-semibold ${className}`}>{children}</h1>;
        case 2:
            return <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>;
        case 3:
            return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
        case 4:
            return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
        default:
            return <></>;
    }
}

export default Heading;