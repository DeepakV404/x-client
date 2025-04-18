import { gql } from "@apollo/client";
import { ROOM_STAGE_FRAGMENT } from "../../rooms/api/rooms-fragment";


export const SEARCH_DEALS = gql`
    query SearchDeals($input: SearchDealInput!){
        searchDeals(input: $input){
            cursorPgOutput{
                hasNextPage
                nextCursor
            }
            deals{
                id 
                name
                isMapped
            }
  	    }
    }
`;

export const CRM_DEAL_STAGE_MAPPINGS = gql`
    ${ROOM_STAGE_FRAGMENT}
    query CrmDealStageMappings{
        _crmDealStageMappings{
            crmDealStage{
                id
                label
            }
            bsStage{
                ...RoomStageFragment
            }
        }
    }
`;

