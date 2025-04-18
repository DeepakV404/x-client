import { gql } from "@apollo/client";

export const CRM_MAP_ROOM_STAGE = gql`
    mutation CRMMapRoomStage($crmDealStageId: String!, $bsStageUuid: String!){
        _crmMapRoomStage(crmDealStageId: $crmDealStageId, bsStageUuid: $bsStageUuid)
    }
`;

export const CRM_UPDATE_LATEST_DEAL_STAGES = gql`
    mutation CRMUpdateLatestDealStages{
        _crmUpdateLatestDealStages
    }
`;