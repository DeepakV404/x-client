import { Typography } from "antd";
import { useContext } from "react";

import { DeckValuesContext } from ".";
import { PLAY_VIDEO_IMAGE } from "../../../constants/module-constants";
import { LINK, VIDEO } from "../../../pages/library/config/resource-type-config";
import { CommonUtil } from "../../../utils/common-util";
import { D_TrackDeckResource } from "./API/deck-mutation";
import { useMutation } from "@apollo/client";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import EmptyText from "../../../components/not-found/empty-text";
import Loading from "../../../utils/loading";

const { Text }          =   Typography

interface ResourceItem {
    uuid            : string
    content         : {thumbnailUrl: string | null, type: string, url: string, downloadableUrl : string}
    title           : string
    isNew           : boolean
    type            : string
}

const DeckResourceCardGrid = () => {
    
    const { resourceData, resourceLoading, setSelectedCard, buyerDeckData } = useContext(DeckValuesContext)
    const { translate }     =   useLocalization();

    const [trackDeckResource]   =   useMutation(D_TrackDeckResource)

    if (resourceLoading){
        return (
            <div className="cm-flex-center cm-width100" style={{height: "calc(100vh - 150px)"}}>
                <Loading className="cm-background-black" color="#ffffff" />
            </div>
        )
    }

    const trackDownload = (resource: any) => {        
        window.open(resource.content.downloadableUrl, "_self")        
        trackDeckResource({
            variables: {
                input: {
                    resourceUuid: resource.uuid,
                    isDownloaded: true
                }
            }
        })
    }

    return (
        <>
            {
                !(resourceData?._dBuyerDeckResources.length)
                ? 
                    <div className="cm-font-fam400 cm-whitespace-no-wrap" style={{height: "calc(100vh - 200px)", width: "calc(100% - 10px)"}}>
                        <EmptyText text={translate("common-empty.no-resources-found")}/>
                    </div>
                :
                    resourceData?._dBuyerDeckResources.map((item: ResourceItem) => (
                        <div className="j-deck-resource-card hover-item" key={item.uuid} onClick={() => setSelectedCard(item.uuid)}>
                            <div className="cm-text-align-center" style={{position: "relative"}}>
                                <img src={item.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(item.content.type)} alt="" className="j-deck-resource-card-image" />
                                {
                                    (item.type === VIDEO || (item.type === LINK && CommonUtil.__checkVideoDomain(item.content.url))) &&
                                        <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -40px)"}}>
                                            <img src={PLAY_VIDEO_IMAGE} alt="Play Video" />
                                        </div>
                                }
                            </div>
                            <div className="j-deck-resource-card-content cm-flex cm-margin-top15">
                                <Text className="j-deck-resource-card-content-title" ellipsis={{ tooltip: item.title }} style={{ maxWidth: "100%" }}>
                                    {item.title}
                                </Text>
                                {buyerDeckData?._dBuyerDeck?.settings?.allowDownloads && item.type !== LINK && <MaterialSymbolsRounded font="download" size="22" color="white" className="cm-margin-right15 show-on-hover-icon" onClick={(e) => {e.stopPropagation(); trackDownload(item)}}/>}
                                {/* {item.isNew && (
                                    <div className="j-deck-resource-card-content-is-new cm-flex-align-center cm-gap8">
                                        <div style={{ height: "6px", width: "6px", background: "#F48125", borderRadius: "50%" }}></div>
                                        <Text>New</Text>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))
            }
        </>
    )
}

export default DeckResourceCardGrid
