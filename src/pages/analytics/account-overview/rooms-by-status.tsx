import { useLazyQuery } from "@apollo/client";
import { Space, Typography } from "antd";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../../globals";
import { ROOMS_BY_STATUS } from "./api/analytics-query";
import GetRoomEngagementStatus from "../../../components/get-room-engagement-status";
import Loading from "../../../utils/loading";

const { Text } = Typography

const RoomsByStatus = (props: { from: any, to: any, home?: any }) => {

    const { from, to, home } = props;

    const { $user } = useContext(GlobalContext);

    const [_getRoomsByStatus, { data, loading }] = useLazyQuery(ROOMS_BY_STATUS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to
            },
            userUuids: home ? [$user.uuid] : undefined
        }
    });

    useEffect(() => {
        if (from && to) {
            _getRoomsByStatus()
        }
    }, [from, to])

    return (
        <div className="cm-flex-direction-column j-analytics-overview-card cm-padding15 cm-text-align-center cm-height100" style={{rowGap: "12px"}}>
            <div>
                <Text className="cm-font-fam500 cm-secondary-text" style={{ float: "left" }}>Rooms by Status</Text>
            </div>
            {
                loading 
                    ? 
                        <Loading />
                    :
                        <>
                            <Space size={0} direction="vertical" className="cm-flex-align-center">
                                <Text className="cm-font-fam600 cm-font-size26">{data?.roomsByEngagementStatus.hot}</Text>
                                <GetRoomEngagementStatus roomStatus={"HOT"}/>
                            </Space>
                            <Space size={0} direction="vertical" className="cm-flex-align-center">
                                <Text className="cm-font-fam600 cm-font-size26">{data?.roomsByEngagementStatus.warm}</Text>
                                <GetRoomEngagementStatus roomStatus={"WARM"}/>
                            </Space>
                            <Space size={0} direction="vertical" className="cm-flex-align-center">
                                <Text className="cm-font-fam600 cm-font-size26">{data?.roomsByEngagementStatus.cold}</Text>
                                <GetRoomEngagementStatus roomStatus={"COLD"}/>
                            </Space>
                            <Space size={0} direction="vertical" className="cm-flex-align-center">
                                <Text className="cm-font-fam600 cm-font-size26">{data?.roomsByEngagementStatus.notEngaged}</Text>
                                <GetRoomEngagementStatus roomStatus={"NOT_ENGAGED"}/>
                            </Space>
                        </>
            }
        </div>
    )
}

export default RoomsByStatus