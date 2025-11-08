type Props = {
    size?: number;
}

const Loader = ({size = 10}: Props) => {
    return <div
        className={`animate-spin h-${size} w-${size} border-4 border-blue-600 border-t-transparent rounded-full`}></div>
}

export default  Loader;