import { useContext } from "react";
import { Space, Typography } from "antd";

import { LINK, VIDEO } from "../../../../pages/library/config/resource-type-config";
import { PLAY_VIDEO_IMAGE } from "../../../../constants/module-constants";
import { CommonUtil } from "../../../../utils/common-util";
import { DeckValuesContext } from "..";

const { Text }  =   Typography

const DeckResourceListSider = () => {

    const { selectedCard, resourceData, setSelectedCard }     =   useContext(DeckValuesContext)

    const handleListClick = (id: any) => {
        setSelectedCard((prevSelectedCard: any) => prevSelectedCard !== id ? id : prevSelectedCard)
    }

    return (
        <>  
            {resourceData?._dBuyerDeckResources.map(( item: any ) => (
                <a onClick={() => handleListClick(item.uuid)} key={item.uuid}>
                    <div className="cm-flex-center" style={{paddingBlock: "20px"}}>
                        <Space direction="vertical" className={`j-deck-resource-list-card cm-position-relative cm-cursor-pointer ${selectedCard !== null && selectedCard === item.uuid ? "j-deck-resource-list-card-active" : ""}`}>
                            <img className="j-deck-resource-list-card-image" height={60} width={100} src={item.content.thumbnailUrl ?? CommonUtil.__getResourceFallbackImage(item.content.type)} alt=""/>
                            {
                                (item.type === VIDEO || (item.type === LINK && CommonUtil.__checkVideoDomain(item.content.url))) &&
                                    <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -40px)"}}>
                                        <img style={{width: "50px", height: "50px"}} src={PLAY_VIDEO_IMAGE} alt="Play Video" />
                                    </div>
                            }
                            <Text className="j-deck-resource-list-card-title" ellipsis={{tooltip: item.title}}>{item.title}</Text>
                        </Space>
                    </div>
                </a>
            ))}
        </>
    )
}

export default DeckResourceListSider