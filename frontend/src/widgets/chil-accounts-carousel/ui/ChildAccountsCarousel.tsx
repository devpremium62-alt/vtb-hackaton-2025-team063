import {Carousel} from "@mantine/carousel";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";
import {JSX, useState} from "react";
import {ChildAccountCreateDummy} from "@/widgets/chil-accounts-carousel/ui/ChildAccountCreateDummy";
import {ChildAccountType} from "@/entities/child-account";
import {CreateChildAccount} from "@/features/create-child-account";

type Props = {
    childAccounts: ChildAccountType[];
    component: (account: ChildAccountType) => JSX.Element;
}

export const ChildAccountsCarousel = ({childAccounts, component}: Props) => {
    const [isModalActive, setModalActive] = useState(false);

    return <>
        <AnimatePresence>
            <Carousel withIndicators slideGap="0.5rem" classNames={{
                root: "px-9",
                controls: "px-0! pointer-events-none",
                control: "pointer-events-auto bg-white shadow-md hover:bg-gray-50 rounded-full w-7 h-7 flex items-center justify-center border border-gray-200",
                indicators: "-bottom-4!",
                indicator: "transition-all",
            }}>
                {
                    childAccounts.map((account) => {
                        return <Carousel.Slide key={account.id}>{component(account)}</Carousel.Slide>;
                    })
                }
                <Carousel.Slide>
                    <ChildAccountCreateDummy onClick={() => setModalActive(true)}/>
                </Carousel.Slide>
            </Carousel>
        </AnimatePresence>
        <CreateChildAccount isActive={isModalActive} setActive={setModalActive}/>
    </>;
}