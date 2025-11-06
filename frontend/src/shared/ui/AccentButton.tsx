type Props = {
    onClick?: () => void;
    children: any;
}

const AccentButton = ({onClick, children}: Props) => {
    return <button onClick={onClick} className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-2xl cursor-pointer flex items-center">
        {children}
    </button>
}

export default AccentButton;