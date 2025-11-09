import {ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState} from "react";

function usePhotoSelection(setPhoto: Dispatch<SetStateAction<string | null>>) {
    const [isCameraActive, setCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isCameraActive || !videoRef.current) return;

        let stream: MediaStream;

        const startStream = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({video: true});
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                alert("Не удалось получить доступ к камере");
                setCameraActive(false);
            }
        };

        startStream();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isCameraActive]);

    function takePhoto() {
        if (!videoRef.current || !canvasRef.current) {
            return;
        }

        const video = videoRef.current;
        const context = canvasRef.current.getContext("2d");
        if (!context) {
            return;
        }

        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setPhoto(canvasRef.current.toDataURL("image/png"));
        setCameraActive(false);
    }

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = ev => setPhoto(ev.target?.result as string);
        reader.readAsDataURL(file);
    }

    return {isCameraActive, setCameraActive, onFileChange, takePhoto, videoRef, canvasRef};
}

export default usePhotoSelection;