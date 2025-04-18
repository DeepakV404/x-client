import { TEXT, BOOK_MEETING, DOWNLOAD, GOTO_URL, UPLOAD, VIEW_DOCUMENT, WATCH_VIDEO } from "../../../../buyer-view/pages/journey/config/action-point-type-config";

import ActionDownloadType from "./action-download-type";
import LinkAction from "./link-action";
import ActionTextType from "./action-text-type";

const ActionItemInfo = (props: {actionType: string, setActionType: (arg0: string) => void}) => {

    const { actionType } =   props;

    const STAKEHOLDER_BUYER     =   "BuyerContactOutput";
    const STAKEHOLDER_SELLER    =   "AccountUserOutput";

    let actionItemCreatedBy     =   STAKEHOLDER_SELLER;

    const getBuyerActionItem = () => {
        switch (actionType) {
            case UPLOAD:
                return (
                    <ActionDownloadType actionType={actionType}/>
                )
        
            case BOOK_MEETING:
                return (
                    <LinkAction actionType={actionType}/>
                )
        }
    }

    const getSellerActionItem = () => {
        switch (actionType) {
            case UPLOAD:
                return (
                    <ActionDownloadType actionType={actionType}/>
                )

            case DOWNLOAD:
                return (
                    <ActionDownloadType actionType={actionType}/>
                )

            case WATCH_VIDEO:
                return (
                    <ActionDownloadType actionType={actionType}/>
                )

            case VIEW_DOCUMENT:
                return (
                    <ActionDownloadType actionType={actionType}/>
                )
            
            case GOTO_URL:
                return (
                    <LinkAction actionType={actionType} />
                )
            
            case BOOK_MEETING:
                return (
                    <LinkAction actionType={actionType} />
                )

            case TEXT:
                return(
                    <ActionTextType/>
                )
        
            default:
                return (
                    <div></div>
                )
        }
    }

    const getHTML = () => {
        switch (actionItemCreatedBy) {
            case STAKEHOLDER_BUYER:
                return getBuyerActionItem()
        
            case STAKEHOLDER_SELLER:
                return getSellerActionItem()
        }
    }

    if(actionType){
        return getHTML()
    }else{
        return null
    }
}

export default ActionItemInfo