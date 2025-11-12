import {ChangeEvent, useEffect, useRef, useState} from "react";
import InputError from "@/shared/ui/inputs/InputError";
import usePhotoSelection from "@/shared/hooks/usePhotoSelection";

type Props = {
    className?: string;
    id?: string;
    placeholder?: string;
    value?: File;
    onChange?: (value: File | null) => void;
    large?: boolean;
    error?: string;
}

const ImageInput = ({id, value, className, placeholder, onChange, large, error}: Props) => {
    const [wasChanged, setWasChanged] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showPlaceholder = placeholder && !wasChanged;

    const {file, onFileChange, setFile} = usePhotoSelection();

    useEffect(() => {
        setFile(value || null);
    }, [value]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setWasChanged(true);
        onFileChange(e);

        if(onChange){
            const files = e.target.files;
            onChange(files ? files[0] : null);
        }
    }

    return <>
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`${className} ${showPlaceholder ? "text-placeholder" : "text-primary"} ${error ? "border-error" : ""} ${large ? "text-sm py-2.5" : "py-1.5 text-xs"} pl-1.5 pr-2.5 bg-tertiary rounded-xl flex items-center justify-between gap-4`}>
            <p>{showPlaceholder ? placeholder : file?.name}</p>
        </div>
        <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
        />
        <InputError error={error}/>
    </>
}

export default ImageInput;