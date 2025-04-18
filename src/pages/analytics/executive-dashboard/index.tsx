import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@apollo/client"
import { Col, Row } from "antd";

import { ED_MEETINGS_OVERVIEW, ED_OVERALL_INSIGHTS } from "./api/executive-dashboard-query";
import { AgentPerformance, DealPerformance } from "./cards/overview-card";

import EdAgentVsTaskCompletionTime from "./graphs/ed-agent-vs-task-completion-time";
import EdAgentVsTaskDueDateChange from "./graphs/ed-agent-vs-task-due-date-change";
import EdAgentVsDealPerformance from "./table/ed-agent-vs-deal-performance";
import EdAgentVsDealOverview from "./graphs/ed-agent-vs-deal-overview";
import EdAgentVsMeeting from "./table/ed-agent-vs-meeting";
import EdAgentsVsTasks from "./graphs/ed-agents-vs-tasks";
import MeetingsOverview from "./cards/meetings-overview";
import { EXECUTIVE_DASHBOARD_BLUR } from "../../../constants/module-constants";
import { GlobalContext } from "../../../globals";
import AnalyticsUpgradeModal from "../analytics-upgrade/analytics-upgrade-modal";

const ExecutiveDashboard = () => {

    const { from, to, selectedUser } = useOutletContext<{ from: number, to: number, selectedDates: string, selectedUser: string }>(); 

    const { $featData }     =   useContext(GlobalContext)

    const [meetingPlanned, setMeetingPlanned]   =   useState(0)
    const [ showUpgradeModal, setShowUpgradeModal ]   =   useState(false)

    useEffect(() => {
        if($featData?.executive_dashboard?.isRestricted){
            setShowUpgradeModal(true);
        }
    },[])
    
    const { data, loading }      =   useQuery(ED_OVERALL_INSIGHTS, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from:   from,
                to  :   to
            },
            userUuids : selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    })

    const { data: meetingData, loading: meetingLoading, error: meetingError } = useQuery(ED_MEETINGS_OVERVIEW, {
        fetchPolicy: "network-only",
        variables: {
            timeSpan: {
                from: from,
                to: to,
            },
            userUuids: selectedUser === 'all_agents' ? undefined : [selectedUser],
        }
    });   
    
    useEffect(() => {
        let totalMeetingsCount = 0
        if (meetingData?._edMeetingsOverview) {
            meetingData._edMeetingsOverview.forEach((record: any) => {
                record.meetingsByRoom.forEach((room: any) => {                
                    totalMeetingsCount    += (room.meetingsBySeller?.meetingsPlanned);
                });
            });
            meetingData._edMeetingsOverview.forEach((record: any) => {
                record.meetingsByRoom.forEach((room: any) => {
                    totalMeetingsCount += (room.meetingsByBuyer?.meetingsPlanned);
                });
            });
        }
        setMeetingPlanned(totalMeetingsCount)
    }, [meetingData])

    return (
        <>
            {
                $featData?.executive_dashboard?.isRestricted 
                ? 
                    <div className="cm-width100 cm-height100" style={{overflow: "hidden"}}>
                        <img src={EXECUTIVE_DASHBOARD_BLUR} width={"100%"} style={{filter: "blur(6px)"}}/>
                    </div> 
                :
                    <Row style={{background: "#f5f7f9", padding: "0 15px 15px 15px"}}>
                        <Col span={12} style={{paddingRight: "7.5px"}}>
                            <DealPerformance data={data} loading={loading} />
                        </Col>
                        <Col span={12} style={{paddingLeft: "7.5px"}}>
                            <AgentPerformance data={data} loading={loading} meetingPlanned={meetingPlanned}/>
                        </Col>
                        <Col span={24} className="cm-margin-top15">
                            <EdAgentVsDealPerformance />
                        </Col>
                        <Col span={24} className="cm-margin-top15">
                            <EdAgentVsDealOverview />
                        </Col>
                        <Col span={24} className="cm-margin-top15">
                            <EdAgentsVsTasks />
                        </Col>
                        <Col span={24} className="cm-margin-top15">
                            <EdAgentVsTaskCompletionTime />
                        </Col>
                        <Col span={24} className="cm-margin-top15">
                            <EdAgentVsTaskDueDateChange />
                        </Col>
                        <div className="cm-flex cm-width100 cm-margin-top15 cm-margin-bottom20" style={{gap: "15px"}}>
                            <div style={{width: "calc(100% - 265px)"}}>
                                <EdAgentVsMeeting data={meetingData} loading={meetingLoading} error={meetingError}/>
                            </div>
                        <div style={{minWidth: "250px"}}>
                                <MeetingsOverview data={meetingData}/>
                        </div>
                        </div>
                    </Row>
            }
            <AnalyticsUpgradeModal 
                isOpen      =   {showUpgradeModal} 
                onClose     =   {() => setShowUpgradeModal(false)} 
            />
        </>
    )
}

export default ExecutiveDashboard