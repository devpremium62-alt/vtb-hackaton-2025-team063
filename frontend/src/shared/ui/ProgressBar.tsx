type Props = {
    value: number;
    max: number;
}

const ProgressBar = ({value, max}: Props) => {
    return <div className="h-1 w-full bg-accent-transparent rounded-2xl">
        <div style={{width: `${value / max * 100}%`}} className="h-1 w-full bg-accent rounded-2xl"></div>
    </div>;
}

export default ProgressBar;