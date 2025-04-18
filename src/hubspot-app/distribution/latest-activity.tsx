import { ACCEPTED_ROOM_INVITATION, COMMENTED_ACTION_POINT, CREATED_ACTION_POINT, DELETED_ACTION_POINT, ENTERED_INTO_ROOM, INVITED_STAKEHOLDER, RE_INVITED_STAKEHOLDER, UPDATED_ACTION_POINT, UPDATED_ACTION_POINT_ASSIGNEE, UPDATED_ACTION_POINT_DUE, UPDATED_ACTION_POINT_ORDER, UPDATED_ACTION_POINT_STATUS, VIEWED_PITCH, VIEWED_RESOURCE, VIEWED_USE_CASE } from '../../pages/rooms/config/activity-config';
import { CommonUtil } from '../../utils/common-util';

const LatestActivity = (props: {activity: any}) => {

    const { activity }  =   props;

    const getHTML = (activity: any) => {
        switch (activity.type) {
            case UPDATED_ACTION_POINT_STATUS:
                if(activity.activityData.updatedStatus === "COMPLETED"){
                    return (
                        <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> completed the action point </span>
                    )
                }else {
                    return (
                        <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> changed the action point status</span>
                    )
                }
            
            case VIEWED_RESOURCE:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has viewed the <span className='cm-font-fam500'>resource</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )
            
            case VIEWED_USE_CASE:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has viewed the <span className='cm-font-fam500'>usecase</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )

            case VIEWED_PITCH:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has viewed the <span className='cm-font-fam500'>pitch video</span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )

            case INVITED_STAKEHOLDER:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has invited <span className='cm-font-fam500 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )
            
            case ENTERED_INTO_ROOM:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has entered into the Room </span>
                )

            case RE_INVITED_STAKEHOLDER:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has re-invited <span className='cm-font-fam500 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )
            
            case ACCEPTED_ROOM_INVITATION:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has accepted the portal invitation </span>
                )
            
            case COMMENTED_ACTION_POINT: 
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has commented in the action point </span>
                )
            
            case CREATED_ACTION_POINT:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has created an Action point </span>
                )
            
            case DELETED_ACTION_POINT:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has deleted an Action point </span>
                )
            
            case UPDATED_ACTION_POINT_ORDER:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> changed the action point status</span>
                )
            
            case UPDATED_ACTION_POINT:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> updated the action point</span>
                )

            case UPDATED_ACTION_POINT_ASSIGNEE:
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has updated Action point assignee</span>
                )
            
            case UPDATED_ACTION_POINT_DUE:
                if(!activity.activityData.oldDue){
                    return (
                        <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has added a due date to the action point</span>
                    )
                }else if(!activity.activityData.updatedDue){
                    return (
                        <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has removed the action point due date </span>
                    )
                }else if(activity.activityData.oldDue && activity.activityData.updatedDue){
                    return (
                        <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has updated Action point due date </span>
                    )
                }
                return (
                    <span><span className="cm-font-fam500">{activity.createdStakeholder.firstName}</span> has updated Action point due date </span>
                )

            default:
                break;
        }
    }

    return (
        <div className='cm-font-size12'>
            {getHTML(activity)}
        </div>
    )
}

export default LatestActivity