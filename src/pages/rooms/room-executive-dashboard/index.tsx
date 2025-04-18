import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { ROOM_ED_BLUR } from "../../../constants/module-constants";
import { ROOM_DASHBOARD_OVERALL } from "../api/rooms-query";
import { GlobalContext } from "../../../globals";
import { useRoomContext } from "../room-layout";

import AnalyticsUpgradeModal from "../../analytics/analytics-upgrade/analytics-upgrade-modal";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import ApStatusAnalytics from "./room-ap-status-analytics";
import RoomStageAnalytics from "./room-stage-analytics";
// import RoomStageTimeline from "./room-stage-timeline";
// import RoomSalespeople from "./room-salespeople";
import Loading from "../../../utils/loading";
import TaskProgress from "./task-progress";
import Stakeholders from "./stakeholders";

const RoomExecutiveDashboard = () => {

    const { roomId }    =   useParams();

    const { $featData } =   useContext(GlobalContext)

    const { room }      =   useRoomContext();

    const roomOwnerId   =   room?.owner?.uuid;

    const [ showUpgradeModal, setShowUpgradeModal ]   =   useState(false);

    const { data, loading, error }  = useQuery(ROOM_DASHBOARD_OVERALL, {
        variables: {
            roomUuid: roomId
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if($featData?.room_executive_dashboard?.isRestricted){
            setShowUpgradeModal(true);
        }
    },[])

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    const overAllApStats    =   data?._rdOverAll?.overAllApStats
    const latestActivity    =   data?._rdOverAll?.recentSellerActivity
    const sellerWiseApStats =   data?._rdOverAll?.sellerWiseApStats
    const stageWiseApStats  =   data?._rdOverAll?.stageWiseApStats

    const ownerStats = sellerWiseApStats.map((_salesPerson: any) => {
        return _salesPerson?.sellerStub?.uuid === roomOwnerId ? _salesPerson : null;
    })

    return (
        <>
            {
                $featData?.room_executive_dashboard?.isRestricted 
                ? 
                    <div className="cm-width100 cm-height100" style={{overflow: "hidden"}}>
                        <img src={ROOM_ED_BLUR} width={"100%"} style={{filter: "blur(6px)"}}/>
                    </div> 
                :
                    <div className="cm-width100" style={{overflowX: "hidden"}}>
                        <div className="j-room-ed-layout cm-padding20">
                            <ApStatusAnalytics overAllApStats={overAllApStats} latestActivity={latestActivity} roomInfo={room} ownerStats={ownerStats}/>
                            <RoomStageAnalytics stageWiseApStats={stageWiseApStats}/>
                            {/* <RoomSalespeople sellerWiseApStats={sellerWiseApStats}/> */}
                            {/* <RoomStageTimeline stageWiseApStats={stageWiseApStats}/> */}
                            <div className="cm-width100 cm-flex cm-margin-top20" style={{columnGap: "20px"}}>
                                <Stakeholders roomId={roomId!}/>
                                <TaskProgress roomId={roomId!}/>
                            </div>
                        </div>
                    </div>
            }
            <AnalyticsUpgradeModal 
                isOpen      =   {showUpgradeModal} 
                onClose     =   {() => setShowUpgradeModal(false)} 
            />
        </>
    )
}

export default RoomExecutiveDashboard
