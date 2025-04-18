import { createContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { RT_ACTION_POINT } from "../../api/room-templates-query";

import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import TemplateActionPointView from "./action-point-view";
import Loading from "../../../../utils/loading";

export const TemplateActionPointContext = createContext<any>(null);

const TemplateActionPoint = (props: {onClose: () => void, actionId: string}) => {

    const { onClose, actionId }     =   props;

    const { roomTemplateId }        =   useParams();

    const { data, loading, error }  =   useQuery(RT_ACTION_POINT, {
        fetchPolicy: "network-only",
        variables: {
            templateUuid    :   roomTemplateId,
            actionPointUuid :   actionId
        }
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    let actionPointViewContext = {
        actionPoint :   data._rtActionPoint,
        onClose     :   onClose
    }

    return (
        <TemplateActionPointContext.Provider 
            value={{
                ...actionPointViewContext
            }}
        >
            <TemplateActionPointView />
        </TemplateActionPointContext.Provider>
    )
}

export default TemplateActionPoint