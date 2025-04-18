import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Typography } from "antd";
import "./deck.css"

import { COMPANY_FALLBACK_ICON } from "../../../constants/module-constants";
import { BUYER_DECK, BUYER_DECK_RESOURCES } from "./API/deck-query";
import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import DeckResourceCardGrid from "./deck-resource-card-grid";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import DeckResourceView from "./deck-resource-view";

interface DeckValuesContextType {
    themeSwitcher       :   string;
    setThemeSwitcher    :   Dispatch<SetStateAction<string>>;
    selectedCard        :   number | string | null,
    setSelectedCard     :   Dispatch<SetStateAction<string | null>>;
    resourceData        :   any
    resourceLoading     :   boolean
    buyerDeckData       :   any
    buyerDeckLoading    :   boolean
    isMobile            :   boolean
}

export const DeckValuesContext = createContext<DeckValuesContextType>({
    themeSwitcher       :   "light",
    setThemeSwitcher    :   () => {},  
    selectedCard        :   null, 
    setSelectedCard     :   () => {},
    resourceData        :   [],
    resourceLoading     :   false,
    buyerDeckData       :   [],
    buyerDeckLoading    :   false,
    isMobile            :   false
});

const { Text } = Typography

const DeckResourcesOverview = () => {

    const { translate }     =   useLocalization();

    const { data: resourceData, loading: resourceLoading }      =   useQuery(BUYER_DECK_RESOURCES, {
        fetchPolicy: "network-only",
    })

    const { data: buyerDeckData, loading: buyerDeckLoading }    =   useQuery(BUYER_DECK, {
        fetchPolicy: "network-only"
    })
    
    const [themeSwitcher, setThemeSwitcher]             =   useState(localStorage.getItem("theme") || "light")
    const [selectedCard, setSelectedCard]               =   useState<any>(resourceData?._dBuyerDeckResources?.length === 1 ? (resourceData?._dBuyerDeckResources[0]?.uuid ? resourceData?._dBuyerDeckResources[0]?.uuid : null): null)
    const [copy, setCopy]                               =   useState(false);
    const [isMobile, setIsMobile]                       =   useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                setIsMobile(true);
                document.body.classList.add("mobile");
            } else {
                setIsMobile(false);
                document.body.classList.remove("mobile");
            }
        };

        handleResize();
        
        window.addEventListener("resize", handleResize);
    
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); 

    const DeckInfo = {
        themeSwitcher,
        setThemeSwitcher,
        selectedCard,
        setSelectedCard,
        resourceData,
        resourceLoading,
        buyerDeckData,
        buyerDeckLoading,
        isMobile
    };

    useEffect(() => {        
        if(localStorage.getItem("theme") === "light"){
            document.body.classList.add("light-mode")
        } else {
            document.body.classList.remove("light-mode")
        }
    }, [themeSwitcher])

    useEffect(() => {
        if(resourceData && resourceData?._dBuyerDeckResources?.length === 1){
            setSelectedCard(resourceData?._dBuyerDeckResources[0]?.uuid)
        }
    }, [resourceData])
    
    const handleButtonClicked = (link: string) => {
        setCopy(true)
        CommonUtil.__copyToClipboard(link + "?ref=reshare")
        setTimeout(() => {
            setCopy(false)
        }, 1500)
    }

    return (
        <DeckValuesContext.Provider value={DeckInfo}>
            <div className="j-deck-hero">
                {
                    selectedCard !== null 
                    ? 
                        <DeckResourceView/>
                    : 
                        <div className="cm-width100 cm-height100" style={{overflowX: "hidden"}}>
                            <div className="j-deck-header">
                                <div className="cm-padding-inline20 cm-width100 cm-flex-align-center cm-flex-space-between">
                                    <img height={40} width={40} src={buyerDeckData?._dBuyerDeck.logoUrl ?? COMPANY_FALLBACK_ICON} alt="" />
                                    <Text className="j-deck-header-title">{buyerDeckData?._dBuyerDeck.title}</Text>
                                    <Button type="primary" onClick={() => handleButtonClicked(buyerDeckData?._dBuyerDeck.copyLink)} style={{width: "115px"}} icon={<MaterialSymbolsRounded font={!copy ? "link" : "check"} size="20"/>}>{copy ? translate("common-labels.copied") : translate("common-labels.copy-link")}</Button>
                                </div>
                            </div>
                            <div className="j-deck-container" style={{padding: !resourceLoading ? "100px 40px 40px 40px" : ""}}>
                                <DeckResourceCardGrid/>
                            </div>
                        </div>
                }
            </div>
        </DeckValuesContext.Provider>
    )
}

export default DeckResourcesOverview