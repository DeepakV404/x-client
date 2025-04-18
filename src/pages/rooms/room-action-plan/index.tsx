import { createContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { R_ACTION_POINT } from "../api/rooms-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import ActionViewDetails from "./action-view-details";
import Loading from "../../../utils/loading";

export const ActionPointViewContext = createContext<any>(null);

const RoomMutualActionPlan = (props: {onClose: () => void, actionId: string}) => {

    const { onClose, actionId }     =   props;

    const { roomId }        =   useParams();

    const { data, loading, error, refetch }  =   useQuery(R_ACTION_POINT, {
        variables: {
            roomUuid        :   roomId,
            actionPointUuid :   actionId
        },
        fetchPolicy: "network-only"
    });
    
    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    let actionPointViewContext = {
        actionPoint :   data._rActionPoint,
        refetch     :   refetch
    }

    return (
        <ActionPointViewContext.Provider 
            value={{
                ...actionPointViewContext
            }}
        >
            <ActionViewDetails onClose={onClose} totalComments={data._rActionPoint.totalComments} />
        </ActionPointViewContext.Provider>
    )
}

export default RoomMutualActionPlan