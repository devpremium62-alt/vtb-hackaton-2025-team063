type Props = {
    size?: number;
}

const Loader = ({size = 2.5}: Props) => {
    return <div
        style={{width: `${size}rem`, height: `${size}rem`}}
        className={`animate-spin border-4 border-blue-600 border-t-transparent rounded-full`}></div>
}

export default  Loader;