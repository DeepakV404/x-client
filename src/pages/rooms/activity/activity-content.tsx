import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Timeline, Card } from "antd";
import { ClockCircleOutlined } from '@ant-design/icons';

import { ROOM_ACTIVITIES } from "../api/rooms-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import NoResultFound from "../../../components/no-result-found";
import Loading from "../../../utils/loading";
import ActivityIcon from "./activity-icon";
import ActivityItem from "./activity-item";

const ActivityContent = () => {

    const params    =   useParams();

    const { data, loading, error } = useQuery(ROOM_ACTIVITIES, {
        variables: {
            roomUuid:   params.roomId,
        },
        fetchPolicy: "network-only",
    });

    if (loading) return <Card bordered={false} className="j-room-activity-card cm-width100 cm-flex-center"><Loading /></Card>;
    if (error) return <SomethingWentWrong/>;

    let currentDate:null | String = null; 

    return (
        <Card bordered={false} className="j-room-activity-card cm-width100 cm-flex-center">
            {
                data.roomActivities.length > 0 ? 
                    (
                        <Timeline className="cm-width100 j-room-activity-timeline">
                            {data.roomActivities.map((_activity:any, index:number) => {
                                const activityDate = new Date(_activity.createdAt);
                                const showDateHeader = Boolean(!currentDate || currentDate !== activityDate.toDateString());

                                if (showDateHeader) {
                                    currentDate = activityDate.toDateString();
                                }

                                return (
                                    <React.Fragment key={index}>
                                        {showDateHeader && (
                                            <Timeline.Item dot={<ClockCircleOutlined />}>
                                                <h3>{`${activityDate.getDate()} ${activityDate.toLocaleString("en-US", { month: "short" })} ${activityDate.getFullYear()}`}</h3>
                                            </Timeline.Item>
                                        )}
                                        <Timeline.Item dot={<ActivityIcon activity={_activity} />}>
                                            <ActivityItem activity={_activity} />
                                        </Timeline.Item>
                                    </React.Fragment>
                                );
                            })}
                        </Timeline>
                ) 
            : 
                (
                    <div className="cm-height100 cm-flex-center">
                        <NoResultFound message={"No activities yet!"} description={"Activities will be tracked once they start using the portal."}/>
                    </div>
                )
            }
        </Card>
    );
};

export default ActivityContent;
