import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"

import { MODULE_ROOM } from "../../../constants/module-constants";
import { R_SECTIONS } from "../api/rooms-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import FromScratchOptions from "../../templates/create-template/template-options";
import Loading from "../../../utils/loading";
import RoomSettings from ".";


const RoomSettingsLayout = () => {

    const params    =   useParams();

    const { data, loading, error }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId
        },
        fetchPolicy: "network-only"
    })

    if(loading) return <Loading/>;
    if(error) return <SomethingWentWrong/>;

    return (
        <>
            {
                data?._rSections?.length > 0 ?
                    <RoomSettings sectionsData={data?._rSections}/>
                :
                    <FromScratchOptions module={MODULE_ROOM}/>
            }
        </>
    )
}

export default RoomSettingsLayout