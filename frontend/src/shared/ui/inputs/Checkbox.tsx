type Props = {
    value: boolean;
    onChange: (value: boolean) => void;
}

const Checkbox = ({value, onChange}: Props) => {
    return <div onClick={() => onChange(!value)} className={`cursor-pointer w-12 h-5 bg-secondary rounded-full overflow-hidden relative`}>
        <div className={`h-full bg-primary rounded-full transition-all duration-300 ${value ? "w-12" : "w-0"}`}></div>
        <div className={`absolute top-[1px] bottom-[1px] bg-white rounded-full w-7 transition-all duration-300 ${value ? "left-[19px]" : "left-[1px]"}`}></div>
    </div>
}

export default Checkbox;