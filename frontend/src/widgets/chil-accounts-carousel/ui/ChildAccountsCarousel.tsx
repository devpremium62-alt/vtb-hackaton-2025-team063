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
            <Carousel className="select-none" withIndicators slideGap="0.5rem" withControls={false} slideSize={{base: '100%', xs: '50%', sm: "100%", md: "50%"}}
                      classNames={{
                          indicators: "-bottom-3!",
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