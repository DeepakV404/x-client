import { APIHandler } from "../../../api-handler";
import { ROOM_STAGES } from "../../settings/api/settings-query";

import { CRM_MAP_ROOM_STAGE, CRM_UPDATE_LATEST_DEAL_STAGES } from "./crm-mutations";

import { CRM_DEAL_STAGE_MAPPINGS } from "./crm-query";

interface CommonParamProps{
    variables?      :   any;
    onCompletion?   :   (response: any) => void;
    errorCallBack?  :   (errors: any) => void;
}

interface CRMAgentProps{
    _updateLatestDealStages: (params: CommonParamProps) => void;
    _mapRoomStage: (params: CommonParamProps) => void;
}

export const CRMAgent = {} as CRMAgentProps;

CRMAgent._updateLatestDealStages = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CRM_UPDATE_LATEST_DEAL_STAGES,
        variables       :   variables,
        refetchQueries  :   [CRM_DEAL_STAGE_MAPPINGS]
    }).then(
        (response: any) => {
            onCompletion && onCompletion(response.data)
        },
        (errors: any) => errorCallBack && errorCallBack(errors)
    )
}

CRMAgent._mapRoomStage = ({variables, onCompletion, errorCallBack}) => {
    APIHandler.client.mutate({
        mutation        :   CRM_MAP_ROOM_STAGE,
        variables       :   variables,
        refetchQueries  :   [CRM_DEAL_STAGE_MAPPINGS, ROOM_STAGES]
    }).then(
        (response: any) => {
            onCompletion && onCompletion(response.data)
        },
        (errors: any) => errorCallBack && errorCallBack(errors)
    )
}