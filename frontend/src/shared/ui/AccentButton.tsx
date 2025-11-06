type Props = {
    className?: string;
    onClick?: () => void;
    children: any;
    large?: boolean;
}

const AccentButton = ({onClick, large, className = "", children}: Props) => {
    return <button onClick={onClick} className={`${large ? "py-2" : "py-1"} px-3 bg-accent text-white text-sm font-medium rounded-2xl cursor-pointer flex items-center transition-colors duration-300 bg-accent-hover ${className}`}>
        {children}
    </button>
}

export default AccentButton;