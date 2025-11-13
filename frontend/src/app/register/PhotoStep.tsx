"use client";

import {useRef, useState} from "react";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Export} from "@/shared/ui/icons/Export";
import {motion} from "framer-motion";
import MainHead from "@/app/register/MainHead";
import usePhotoSelection from "@/shared/hooks/usePhotoSelection";

type Props = {
    onSuccess: (photo: File, photoSrc: string) => void;
}

const PhotoStep = ({onSuccess}: Props) => {
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        file,
        isCameraActive,
        setCameraActive,
        takePhoto,
        onFileChange,
        videoRef,
        canvasRef
    } = usePhotoSelection(setPhoto);

    return (
        <>
            <MainHead/>
            <motion.div
                className="p-4 rounded-xl bg-white"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.3}}
            >
                <div className="mb-2.5">
                    <Heading level={3}>Добавьте фото</Heading>
                </div>

                {photo && file && (
                    <>
                        <div className="mb-2 flex justify-center">
                            <img src={photo} alt="Фото пользователя"
                                 className="rounded-xl max-h-48 aspect-square object-cover"/>
                        </div>
                        <AccentButton
                            large background="bg-accent"
                            className="w-full mb-4 justify-center gap-1.5 py-2.5! font-normal!"
                            onClick={() => onSuccess(file, photo)}
                        >
                            Использовать это фото
                        </AccentButton>
                    </>
                )}

                <div className="mb-2.5 flex flex-col items-stretch gap-2.5">
                    <AccentButton
                        large background="bg-primary"
                        className="justify-center gap-1.5 py-2.5! font-normal!"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Загрузить с устройства
                        <Export/>
                    </AccentButton>

                    <AccentButton
                        large background="bg-primary"
                        className="justify-center py-2.5! font-normal!"
                        onClick={() => setCameraActive(true)}
                    >
                        Сделать фото
                    </AccentButton>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                    />
                </div>

                {isCameraActive && (
                    <div className="flex flex-col items-center gap-2 mt-3">
                        <video ref={videoRef} autoPlay playsInline className="rounded-xl max-h-64"/>
                        <div className="flex gap-2">
                            <AccentButton background="bg-primary" onClick={takePhoto}>
                                Сделать снимок
                            </AccentButton>
                            <AccentButton background="bg-gray-400" onClick={() => setCameraActive(false)}>
                                Отмена
                            </AccentButton>
                        </div>
                        <canvas ref={canvasRef} className="hidden"/>
                    </div>
                )}
            </motion.div>
        </>
    );
}

export default PhotoStep;