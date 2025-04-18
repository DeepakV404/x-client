import { Space, Tag } from 'antd';

import { ACCEPTED_ROOM_INVITATION, COMMENTED_ACTION_POINT, CREATED_ACTION_POINT, DELETED_ACTION_POINT, ENTERED_CUSTOM_SECTION, ENTERED_DEMO_SECTION, ENTERED_FAQ_SECTION, ENTERED_INTO_ROOM, ENTERED_NEXT_STEPS_SECTION, ENTERED_RESOURCE_SECTION, ENTERED_TALK_TO_US_SECTION, ENTERED_WELCOME_SECTION, INVITED_STAKEHOLDER, RE_INVITED_STAKEHOLDER, UPDATED_ACTION_POINT, UPDATED_ACTION_POINT_ASSIGNEE, UPDATED_ACTION_POINT_DUE, UPDATED_ACTION_POINT_ORDER, UPDATED_ACTION_POINT_STATUS, VIEWED_PITCH, VIEWED_RESOURCE, VIEWED_USE_CASE } from '../config/activity-config';
import { STAGE_STATUS_CONFIG } from '../../../buyer-view/pages/journey/config/stage-status-config';
import { CommonUtil } from '../../../utils/common-util';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const ActivityItem = (props: {activity: any}) => {

    const { activity }  =   props;

    const getHTML = () => {

        const section       =   activity?.activityData?.section;

        const getSectionAvtivity = () => {
            return <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - <span className='cm-font-fam600'>{section.emoji} {section.name}</span> </span> </span>
        }

        switch (activity.type) {
            case UPDATED_ACTION_POINT_STATUS:
                if(activity.activityData.updatedStatus === "COMPLETED"){
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>completed the Action point </span>
                            {
                                activity.activityData.hasData 
                                ? 
                                    <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                : 
                                    null
                            }
                        </span>
                    )
                }else {
                    return (
                        <Space direction='vertical'>
                            <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>changed the status of the Action point </span>
                                {
                                    activity.activityData.hasData 
                                    ? 
                                        <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                    : 
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <Space direction='vertical' className='cm-width100' size={4}>
                                        <Space>
                                            <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[activity.activityData.oldStatus].tag, backgroundColor: STAGE_STATUS_CONFIG[activity.activityData.oldStatus].backgroundColor}}>
                                                {STAGE_STATUS_CONFIG[activity.activityData.oldStatus].displayName}
                                            </Tag>
                                            <MaterialSymbolsRounded font="trending_flat" size='18'/>
                                            <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[activity.activityData.updatedStatus].tag, backgroundColor: STAGE_STATUS_CONFIG[activity.activityData.updatedStatus].backgroundColor}}>
                                                {STAGE_STATUS_CONFIG[activity.activityData.updatedStatus].displayName}
                                            </Tag>
                                        </Space>
                                    </Space>
                                :
                                    null
                            }
                        </Space>
                    )
                }
            
            case VIEWED_RESOURCE:
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has viewed </span> <span className='cm-font-fam600'>
                            {
                                activity.activityData.hasData 
                                ? 
                                    <span><span className='cm-font-fam600'>{activity.activityData.resource.title}</span></span>
                                : 
                                    <span>resource</span>
                            }
                        </span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
            
                    </Space>
                )
            
            case VIEWED_USE_CASE:
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has viewed </span> <span className='cm-font-fam600'>
                            {
                                activity.activityData.hasData 
                                ? 
                                    <span className='cm-font-fam600'>{activity.activityData.resource.title} (usecase)</span>
                                : 
                                    <span>usecase</span>
                            }
                            </span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                    </Space>
                )

            case VIEWED_PITCH:
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has viewed </span> <span className='cm-font-fam600'>
                            {
                                activity.activityData.hasData 
                                ? 
                                    <span className='cm-font-fam600'>{activity.activityData.resource.title} (pitch video)</span>
                                : 
                                    <span>pitch video</span>
                            }
                            </span> for {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                    </Space>
                )

            case INVITED_STAKEHOLDER:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has invited </span> <span className='cm-font-fam600 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )
            
            case RE_INVITED_STAKEHOLDER:
                return (
                    <span><span className="cm-font-fam500">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> has re-invited <span className='cm-font-fam500 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )
            
            case ENTERED_INTO_ROOM:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has entered into the Room </span> </span>
                )
            
            case ACCEPTED_ROOM_INVITATION:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has accepted the portal invitation </span> </span>
                )
            
            case COMMENTED_ACTION_POINT: 
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has commented on the Action point </span>
                        {
                            activity.activityData.hasData 
                            ?
                                <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                        </span>
                    </Space>
                )
            
            case CREATED_ACTION_POINT:
                return (
                    <Space direction='vertical'>
                        <span>
                            <span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has created an Action point </span>
                            {
                                activity.activityData.hasData ?
                                    <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                :
                                    null
                            }
                        </span>
                    </Space>
                )
            
            case DELETED_ACTION_POINT:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has deleted the Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )
            
            case UPDATED_ACTION_POINT_ORDER:
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>changed the status of the Action point </span>
                            {
                                activity.activityData.hasData ?
                                    <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                :
                                    null
                            }
                        </span>
                        {
                            activity.activityData.hasData
                            ? 
                                <Space  className='cm-width100' >
                                    <div>{activity.activityData.oldOrder}</div>
                                    <MaterialSymbolsRounded font="trending_flat" size='18'/>
                                    <div>{activity.activityData.updatedOrder}</div>
                                </Space>
                            :
                                null
                        }
                    </Space>
                )
            
            case UPDATED_ACTION_POINT:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>updated the Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )

            case UPDATED_ACTION_POINT_ASSIGNEE:
                return (
                    <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has updated the assignee of the Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )
            
            case UPDATED_ACTION_POINT_DUE:
                if(!activity.activityData.oldDue){
                    return (
                        <Space direction='vertical'>
                            <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has added a due date to the Action point </span>
                                {
                                    activity.activityData.hasData ?
                                        <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                    :
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <Space direction='vertical' className='cm-width100' size={4}>
                                        <span><span className='cm-font-size10'>Due date: </span><span className='cm-font-fam600'>
                                            {CommonUtil.__getDateDay(new Date(activity.activityData.updatedDue))}, {new Date(activity.activityData.updatedDue).getFullYear()}
                                        </span></span>
                                    </Space>
                                :
                                    null
                            }
                        </Space>
                    )
                }else if(!activity.activityData.updatedDue){
                    return (
                        <Space direction='vertical'>
                            <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has removed the due date from the Action point </span>
                                {
                                    activity.activityData.hasData ?
                                        <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                    :
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <span><span className='cm-font-size10'>Old due date: </span><span className='cm-font-fam600 cm-font-size13'>
                                        {CommonUtil.__getDateDay(new Date(activity.activityData.oldDue))}, {new Date(activity.activityData.oldDue).getFullYear()}
                                    </span></span>
                                :
                                    null
                            }
                        </Space>
                    )
                }else if(activity.activityData.oldDue && activity.activityData.updatedDue){
                    return (
                        <Space direction='vertical'>
                            <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has updated due date to the Action point </span>
                                {
                                    activity.activityData.hasData ?
                                        <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                    :
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <Space direction='vertical' className='cm-width100' size={4}>
                                        <Space>
                                            <div className='cm-font-fam600'>
                                                {CommonUtil.__getDateDay(new Date(activity.activityData.oldDue))}, {new Date(activity.activityData.oldDue).getFullYear()}
                                            </div>
                                            <MaterialSymbolsRounded font="trending_flat" size='18'/>
                                            <div className='cm-font-fam600'>
                                                {CommonUtil.__getDateDay(new Date(activity.activityData.updatedDue))}, {new Date(activity.activityData.updatedDue).getFullYear()}
                                            </div>
                                        </Space>
                                    </Space>
                                :
                                    null
                            }
                        </Space>
                    )
                }
                return (
                    <Space direction='vertical'>
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'>has updated due date to the Action Point </span>
                            {
                                activity.activityData.hasData ?
                                    <span className='cm-font-fam600'>{activity.activityData.actionPoint.name}</span>
                                :
                                    null
                            }
                        </span>
                        {
                            activity.activityData.hasData
                            ? 
                                <Space className='cm-width100'>
                                    <div className='cm-font-fam600'>
                                        {activity.activityData.oldDue}
                                    </div>
                                    <div className=''>
                                        {activity.activityData.updatedDue}
                                    </div>
                                </Space>
                            :
                                null
                        }
                    </Space>
                )
            
            case ENTERED_CUSTOM_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - Custom Section</span> </span>
                    )
                }
            
            case ENTERED_WELCOME_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Welcome Section </span></span></span>
                    )
                }
            
            case ENTERED_RESOURCE_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Resource section</span> </span> </span>
                    )
                }

            case ENTERED_DEMO_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Demo section</span> </span> </span>
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
                break;
        }
    }

    return (
        <Space direction="vertical" className='cm-padding-bottom10'>
            {getHTML()}
            <span className="cm-font-size12 cm-light-text">{new Date(activity.createdAt).toDateString().split(" ")[0] + ", " + CommonUtil.__getDateDay(activity.createdAt) + " - " + CommonUtil.__format_AM_PM(activity.createdAt)}</span>
        </Space>
    )
}

export default ActivityItem