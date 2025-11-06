import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Export} from "@/shared/ui/icons/Export";

function PhotoStep() {
    return <div className="p-4 rounded-xl bg-white">
        <div className="mb-2.5">
            <Heading level={3}>
                Добавьте фото
            </Heading>
        </div>
        <div className="mb-2.5 flex flex-col items-stretch gap-2.5">
            <AccentButton large background="bg-primary" className="justify-center gap-1.5 text-base! py-2.5! font-normal!">
                Загрузить с устройства
                <Export/>
            </AccentButton>
            <AccentButton large background="bg-primary" className="justify-center text-base! py-2.5! font-normal!">
                Сделать фото
            </AccentButton>
        </div>
    </div>
}

export default PhotoStep;