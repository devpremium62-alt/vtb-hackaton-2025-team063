type Props = {
    error?: string;
}

const InputError = ({error}: Props) => {
    if (!error) {
        return <></>;
    }

    return <p className="text-[0.6rem] text-error font-medium mt-0.5">{error}</p>;
}

export default InputError;