import { useContext, useEffect, useRef } from "react";
import { Layout } from "antd";

import { DeckValuesContext } from "..";

import DeckResourceContentPreview from "./deck-resource-content-preview";
import DeckResourceListSider from "./deck-resource-list-sider";

const { Sider }  =  Layout;

const DeckResourceView = () => {

    const { selectedCard, buyerDeckData, resourceData }     =   useContext(DeckValuesContext)

    const siderRef      =   useRef<any>(null);

    useEffect(() => {
        if (selectedCard !== null && siderRef.current) {
            const activeElement = siderRef.current.querySelector(".j-deck-resource-list-card-active");

            if (activeElement) {
                const { top, bottom } = activeElement.getBoundingClientRect();
                const { top: containerTop, bottom: containerBottom } = siderRef.current.getBoundingClientRect();

                if (top < containerTop || bottom > containerBottom) {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });              
                }
            }
        }
    }, [selectedCard]);

    return (
        <Layout className="cm-flex j-deck-wrapper cm-height100">
            {
                resourceData?._dBuyerDeckResources?.length > 1 &&
                    <Sider className="j-deck-sider" collapsible trigger={null}>
                        <div className="j-deck-sider-header">
                            <img height={40} width={40}src={buyerDeckData?._dBuyerDeck?.logoUrl} alt="buyerstage_logo" />
                        </div>
                        <div ref={siderRef} style={{height: "calc(100% - 50px)", overflow: "auto"}}>
                            <DeckResourceListSider />
                        </div>
                    </Sider>
            }
            <DeckResourceContentPreview/>
        </Layout>
    )
}

export default DeckResourceView