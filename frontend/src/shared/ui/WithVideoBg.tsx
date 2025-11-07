const WithVideoBg = ({children}: any) => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/bg.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>

            <div className="relative z-10 flex flex-col items-center justify-center h-full bg-login">
                {children}
            </div>
        </div>
    );
};

export default WithVideoBg;
