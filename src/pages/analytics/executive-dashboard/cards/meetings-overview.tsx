import { Divider, Space, Typography } from "antd";

const { Text }  =   Typography

const MeetingsOverview = (props: { data: any }) => {

    const { data }  = props

    let totalMeetingsPlannedBySeller    =   0
    let totalMeetingsCompletedBySeller  =   0
    let totalMeetingsPlannedByBuyer     =   0
    let totalMeetingsCompletedByBuyer   =   0

    if (data && data._edMeetingsOverview) {
        data._edMeetingsOverview.forEach((record: any) => {
            record.meetingsByRoom.forEach((room: any) => {                
                totalMeetingsPlannedBySeller    += (room.meetingsBySeller?.meetingsPlanned);
                totalMeetingsCompletedBySeller  += (room.meetingsBySeller?.meetingsCompleted);
            });
        });
        data._edMeetingsOverview.forEach((record: any) => {
            record.meetingsByRoom.forEach((room: any) => {
                totalMeetingsPlannedByBuyer += (room.meetingsByBuyer?.meetingsPlanned);
                totalMeetingsCompletedByBuyer += (room.meetingsByBuyer?.meetingsCompleted);
            });
        });
    }

    return (
        <div className="cm-background-white cm-padding15 cm-flex-direction-column cm-border-radius6 cm-border-light" style={{height: "375px", padding: 0}}>
            <div className="cm-flex-direction-column cm-flex-center cm-height100">
                <Space direction="vertical" className="cm-text-align-center">
                    <Text className="cm-font-fam500" style={{fontSize: "40px"}}>{totalMeetingsCompletedBySeller}<span style={{fontSize: "18px"}}> / {totalMeetingsPlannedBySeller}</span></Text>
                    <Text className="cm-font-fam500" style={{opacity: "67%"}}>Total Meetings By Seller</Text>
                </Space>
                <Divider />
                <Space direction="vertical" className="cm-text-align-center">
                    <Text className="cm-font-fam500" style={{fontSize: "40px"}}>{totalMeetingsCompletedByBuyer}<span style={{fontSize: "18px"}}> / {totalMeetingsPlannedByBuyer}</span></Text>
                    <Text className="cm-font-fam500" style={{opacity: "67%"}}>Total Meetings By Buyer</Text>
                </Space>
            </div>
        </div>
    )
}

export default MeetingsOverview