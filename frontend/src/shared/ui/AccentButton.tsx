type Props = {
    className?: string;
    onClick?: () => void;
    children: any;
    background?: string;
    large?: boolean;
    textLarge?: boolean;
    disabled?: boolean;
    type?: "submit" | "reset" | "button";
}

const AccentButton = ({onClick, large, textLarge, background = "bg-accent", className = "", children, ...props}: Props) => {
    return <button onClick={onClick}
                   className={`${large || textLarge ? "text-base" : "text-sm"} ${large ? "py-2" : "py-1"} px-3 ${background} ${background}-hover text-white font-medium rounded-2xl cursor-pointer flex items-center transition-colors duration-300 ${className}`} {...props}>
        {children}
    </button>
}

export default AccentButton;