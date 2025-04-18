
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Timeline } from "antd";

import { ROOM_ACTIVITIES_BY_BUYER } from "../api/rooms-query";

import EmptyText from "../../../components/not-found/empty-text";
import ActivityItem from "../activity/activity-item";
import Loading from "../../../utils/loading";
import ActivityIcon from "./activity-icon";

const BuyerActivityContent = (props: {buyer: any}) => {

    const { buyer }  =  props;

    const params = useParams();

    const { data, loading, error }  =   useQuery(ROOM_ACTIVITIES_BY_BUYER, {
        variables: {
            roomUuid     :   params.roomId,
            contactUuid  :   buyer?.uuid
        },
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>
    if(error) return <div>Something went wrong</div>

    return (
        <div className="j-room-buyer-activity-card cm-width100 cm-flex-center">
            {
                data.roomActivitiesByBuyer.length > 0 ?
                    <Timeline className="cm-width100">
                        {
                            data.roomActivitiesByBuyer.map((_activity: any) => (
                                <Timeline.Item dot={<ActivityIcon activity={_activity}/>}>
                                    <ActivityItem activity={_activity} />
                                </Timeline.Item>
                            ))
                        }   
                    </Timeline>
                :
                    <EmptyText text="No activities found"/>
            }
        </div>
    )
}

export default BuyerActivityContent