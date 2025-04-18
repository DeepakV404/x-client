import { Space, Typography } from 'antd';

import { CommonUtil } from '../../../utils/common-util';

import { UPDATED_ACTION_POINT_STATUS, VIEWED_RESOURCE, VIEWED_USE_CASE, VIEWED_PITCH, INVITED_STAKEHOLDER, ENTERED_INTO_ROOM, ACCEPTED_ROOM_INVITATION, COMMENTED_ACTION_POINT, CREATED_ACTION_POINT, DELETED_ACTION_POINT, UPDATED_ACTION_POINT_ORDER, UPDATED_ACTION_POINT, UPDATED_ACTION_POINT_ASSIGNEE, UPDATED_ACTION_POINT_DUE, RE_INVITED_STAKEHOLDER, ENTERED_RESOURCE_SECTION, ENTERED_DEMO_SECTION, ENTERED_CUSTOM_SECTION, ENTERED_NEXT_STEPS_SECTION, ENTERED_TALK_TO_US_SECTION, ENTERED_FAQ_SECTION, ENTERED_WELCOME_SECTION,  } from "../config/activity-config";

const { Text } =   Typography;

const LatestActivity = (props: {isDashboard?: boolean, activity: any}) => {

    const { isDashboard, activity }  =   props;

    const getHTML = (activity: any) => {

        const stakeholder   =   activity.createdStakeholder;
        const section       =   activity?.activityData?.section;

        const getSectionAvtivity = () => {
            return <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - <span className='cm-font-fam600'>{section.emoji} {section.name}</span> </span> </span>
        }

        switch (activity.type) {
            case UPDATED_ACTION_POINT_STATUS:
                if(activity.activityData.updatedStatus === "COMPLETED"){
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> completed the action point</Text>  </span>
                    )
                }else {
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> changed the action point status</Text>  </span>
                    )
                }
            
            case VIEWED_RESOURCE:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has viewed the</Text> <span >resource</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`}  </span>
                )
            
            case VIEWED_USE_CASE:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has viewed the</Text> <span >usecase</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`}  </span>
                )

            case VIEWED_PITCH:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text><Text> has viewed the</Text> <span >pitch video</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`}  </span>
                )

            case INVITED_STAKEHOLDER:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has invited</Text> <span className='cm-font-fam500 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span>  </span>
                )
            
            case RE_INVITED_STAKEHOLDER:
                return (
                    <span><span className="cm-font-fam500">{activity.createdCommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</span> has re-invited <span className='cm-font-fam500 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )

            case ENTERED_INTO_ROOM:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has accessed the portal</Text>  </span>
                )
            
            case ACCEPTED_ROOM_INVITATION:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has accepted the portal invitation</Text>  </span>
                )
            
            case COMMENTED_ACTION_POINT: 
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has commented in the action point</Text>  </span>
                )
            
            case CREATED_ACTION_POINT:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has created an Action point</Text>  </span>
                )
            
            case DELETED_ACTION_POINT:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has deleted an Action point</Text>  </span>
                )
            
            case UPDATED_ACTION_POINT_ORDER:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> changed the action point status</Text>  </span>
                )
            
            case UPDATED_ACTION_POINT:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> updated the action point</Text>  </span>
                )

            case UPDATED_ACTION_POINT_ASSIGNEE:
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has updated Action point assignee</Text>  </span>
                )
            
            case UPDATED_ACTION_POINT_DUE:
                if(!activity.activityData.oldDue){
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has added a due date to the action point</Text>  </span>
                    )
                }else if(!activity.activityData.updatedDue){
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has removed the action point due date</Text>  </span>
                    )
                }else if(activity.activityData.oldDue && activity.activityData.updatedDue){
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has updated Action point due date</Text>  </span>
                    )
                }
                return (
                    <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has updated Action point due date</Text>  </span>
                )

            case ENTERED_CUSTOM_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - {activity.activityData.hasData ? <span className='cm-font-fam600'>{activity?.activityData?.section?.name}</span> : null}</span> </span>
                    )
                }

            case ENTERED_WELCOME_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has viewed the <span className='cm-font-fam600'> Welcome section</span></Text>  </span>
                    )
                }
            
            case ENTERED_RESOURCE_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has viewed the <span className='cm-font-fam600'> Resource section</span></Text>  </span>
                    )
                }

            case ENTERED_DEMO_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><Text ellipsis={{ tooltip: CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}} className='cm-font-fam500 cm-margin0'>{CommonUtil.__getFullName(stakeholder.firstName, stakeholder.lastName)}</Text> <Text> has viewed the <span className='cm-font-fam600'> Demo section</span></Text>  </span>
                    )
                }
            
            case ENTERED_TALK_TO_US_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Talk to us section</span> </span> </span>
                    )
                }
            
            
            case ENTERED_NEXT_STEPS_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Next steps </span></span></span>
                    )
                }

            case ENTERED_FAQ_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> FAQ </span></span></span>
                    )
                }
                
            default:
                return (
                    <span className="cm-font-size12 cm-empty-text">No activity found</span>
                )
        }
    }

    return (
        <Space direction='vertical'>
            {getHTML(activity)}
            {!isDashboard && activity ? <div className="cm-font-size12" style={{color: "#636363"}}>{CommonUtil.__getDateDay(activity.createdAt)} - {CommonUtil.__format_AM_PM(activity.createdAt)}</div> : null}
        </Space>
    )
}

export default LatestActivity