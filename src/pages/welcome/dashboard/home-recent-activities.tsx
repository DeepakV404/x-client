import { useContext, useEffect } from 'react';
import { Space, Tag, Typography } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { ACCEPTED_ROOM_INVITATION, COMMENTED_ACTION_POINT, CREATED_ACTION_POINT, DELETED_ACTION_POINT, ENTERED_CUSTOM_SECTION, ENTERED_DEMO_SECTION, ENTERED_FAQ_SECTION, ENTERED_INTO_ROOM, ENTERED_NEXT_STEPS_SECTION, ENTERED_RESOURCE_SECTION, ENTERED_TALK_TO_US_SECTION, ENTERED_WELCOME_SECTION, INVITED_STAKEHOLDER, UPDATED_ACTION_POINT, UPDATED_ACTION_POINT_ASSIGNEE, UPDATED_ACTION_POINT_DUE, UPDATED_ACTION_POINT_ORDER, UPDATED_ACTION_POINT_STATUS, VIEWED_PITCH, VIEWED_RESOURCE, VIEWED_USE_CASE } from '../../rooms/config/activity-config';
import { STAGE_STATUS_CONFIG } from '../../../buyer-view/pages/journey/config/stage-status-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import Loading from '../../../utils/loading';
import { RECENT_ACTIVITIES } from '../../analytics/account-overview/api/analytics-query';

const { Text }  =   Typography;

const HomeRecentActivities = (props: { from: any, to: any }) => {

    const { from, to }  =   props;

    const navigate      =   useNavigate();

    const { $user }     =   useContext(GlobalContext);

    const [_getRecentActivities, { data, loading }]     =   useLazyQuery(RECENT_ACTIVITIES, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if(from && to){
            _getRecentActivities({
                variables: {
                    timeSpan: {
                        from    :   from,
                        to      :   to
                    },
                    userUuids: [$user.uuid]
                }
            })
        }
    }, [from, to])

    if(loading) return <div style={{height: "calc(100vh - 350px)"}}><Loading/></div>

    const getHTML = (activity: any) => {

        const section       =   activity?.activityData?.section;

        const getSectionAvtivity = () => {
            return <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - <span className='cm-font-fam600'> {section.emoji} {section.name}</span> </span> </span>
        }

        switch (activity.type) {
            case UPDATED_ACTION_POINT_STATUS:
                if(activity.activityData.updatedStatus === "COMPLETED"){
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>completed the Action point </span>
                            {
                                activity.activityData.hasData 
                                ? 
                                    <span className='cm-font-fam600'> {activity.activityData.actionPoint.name}</span>
                                : 
                                    null
                            }
                        </span>
                    )
                }else {
                    return (
                        <Space direction='vertical'>
                            <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>changed the status of the Action point </span>
                                {
                                    activity.activityData.hasData 
                                    ? 
                                        <span className='cm-font-fam600'> {activity.activityData.actionPoint.name}</span>
                                    : 
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <Space direction='vertical' className='cm-width100 cm-font-size13' size={4}>
                                        <Space>
                                            <Tag bordered={false} style={{color: STAGE_STATUS_CONFIG[activity.activityData.oldStatus].tag, backgroundColor:STAGE_STATUS_CONFIG[activity.activityData.oldStatus].backgroundColor}}>
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
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has viewed </span>
                    {
                        activity.activityData.hasData 
                        ? 
                            <span className='cm-font-fam600'>{activity.activityData.resource.title}</span>
                        : 
                            <span> the resource</span>
                    }
                    <span className='j-activity-text'> for </span> {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )
            
            case VIEWED_USE_CASE:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has viewed the </span>
                        {
                            activity.activityData.hasData 
                            ? 
                                <span className='cm-font-fam600 '>{activity.activityData.resource.title} (usecase)</span>
                            : 
                                <span> the resource</span>
                        }
                    <span className='j-activity-text'> for</span> {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )

            case VIEWED_PITCH:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has viewed the </span>
                        {
                            activity.activityData.hasData 
                            ? 
                                <span className='cm-font-fam600 '>{activity.activityData.resource.title} (pitch video)</span>
                            : 
                                <span> the resource</span>
                        }
                    <span className='j-activity-text'> for</span> {`${CommonUtil.__getFormatDuration(activity.activityData.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`} </span>
                )

            case INVITED_STAKEHOLDER:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> has invited <span className='cm-font-fam600 cm-font'><a href={`mailto: ${activity.activityData.emailId}`}>{activity.activityData.emailId}</a></span> </span>
                )
            
            case ENTERED_INTO_ROOM:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> has entered into the Room </span>
                )
            
            case ACCEPTED_ROOM_INVITATION:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> has accepted the portal invitation </span>
                )
            
            case COMMENTED_ACTION_POINT: 
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has commented on the Action point </span></span>
                )
            
            case CREATED_ACTION_POINT:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has created an Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )
            
            case DELETED_ACTION_POINT:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has deleted an Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )
            
            case UPDATED_ACTION_POINT_ORDER:
                return (
                    <Space direction='vertical'>
                        <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>changed the status of the ActionPoint </span>
                            {
                                activity.activityData.hasData ?
                                    <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                                :
                                    null
                            }
                        </span>
                        {
                            activity.activityData.hasData
                            ? 
                                <Space className='cm-width100'>
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
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>updated the Action point </span>
                        {
                            activity.activityData.hasData ?
                                <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )

            case UPDATED_ACTION_POINT_ASSIGNEE:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has updated assignee of the Action point </span>
                        {
                            activity.activityData.hasData
                            ? 
                                <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                            :
                                null
                        }
                    </span>
                )
            
            case UPDATED_ACTION_POINT_DUE:
                if(!activity.activityData.oldDue){
                    return (
                        <Space direction='vertical'>
                            <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has added a due date to the Action point </span>
                                {
                                    activity.activityData.hasData
                                    ? 
                                        <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                                    :
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <span><span className='cm-font-size10'>Due date: </span><span className='cm-font-fam600 '>
                                        {CommonUtil.__getDateDay(new Date(activity.activityData.updatedDue))}, {new Date(activity.activityData.updatedDue).getFullYear()}
                                    </span></span>
                                :
                                    null
                            }
                        </Space>
                    )
                }else if(!activity.activityData.updatedDue){
                    return (
                        <Space direction='vertical'>
                            <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has removed the due date for the Action point </span>
                                {
                                    activity.activityData.hasData
                                    ? 
                                        <span className='cm-font-fam600 '>{activity.activityData.actionPoint.name}</span>
                                    :
                                        null
                                }
                            </span>
                            {
                                activity.activityData.hasData
                                ? 
                                    <span><span className='cm-font-size10'>Old due date: </span><span className='cm-font-fam600 '>
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
                            <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'>has updated the due date for the Action point </span>
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
                                    <Space className='cm-width100'>
                                        <div className=' cm-font-fam600'>
                                            {CommonUtil.__getDateDay(new Date(activity.activityData.oldDue))}, {new Date(activity.activityData.oldDue).getFullYear()}
                                        </div>
                                        <MaterialSymbolsRounded font="trending_flat" size='18'/>
                                        <div className=' cm-font-fam600'>
                                            {CommonUtil.__getDateDay(new Date(activity.activityData.updatedDue))}, {new Date(activity.activityData.updatedDue).getFullYear()}
                                        </div>
                                    </Space>
                                :
                                    null
                            }
                        </Space>
                    )
                }else{
                    return (
                        <Space direction='vertical'>
                            <span className='cm-font-size13'><span className="cm-font-fam600">{activity.createdStakeholder.firstName}</span> <span className='j-activity-text'> has updated the due date for the Action point </span>
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
                                    <Space className='cm-width100'>
                                        <div className=' cm-font-fam600'>
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
                }

            case ENTERED_CUSTOM_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the section - {activity.activityData.hasData ? <span className='cm-font-fam600'>{activity?.activityData?.section?.name}</span> : null}</span> </span>
                    )
                }
            
            
            case ENTERED_RESOURCE_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Resource section</span> </span> </span>
                    )
                }

            case ENTERED_WELCOME_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Welcome section</span> </span> </span>
                    )
                }

            case ENTERED_DEMO_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Demo section</span> </span> </span>
                    )
                }
            
            case ENTERED_TALK_TO_US_SECTION:
                if(section){
                    return getSectionAvtivity()
                }else{
                    return (
                        <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Talk to us section</span> </span> </span>
                    )
                }
            
            case ENTERED_NEXT_STEPS_SECTION:
                return (
                    <span className='cm-font-size13'><span className="cm-font-fam600">{CommonUtil.__getFullName(activity.createdStakeholder.firstName, activity.createdStakeholder.lastName)}</span> <span className='j-activity-text'> has viewed the <span className='cm-font-fam600'> Next steps</span> </span></span>
                )

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

    return(
        <>
            <div>
                {
                    data && data.recentActivities.length > 0
                    ?
                        data.recentActivities.map((activity: any) => (
                            <Space className='cm-width100 j-home-room-activity cm-space-inherit cm-cursor-pointer' direction='vertical' onClick={() => {navigate(`/rooms/${activity.accountStub.uuid}/${activity.roomStub.uuid}/sections`) }}>
                                <div className='cm-flex-space-between cm-width100' style={{columnGap: "10px"}}>
                                    <div className='cm-flex-direction-row cm-flex-align-center' style={{maxWidth: "calc(100% - 110px)", columnGap: "8px"}}>
                                        <img src={activity.accountStub.logoUrl} style={{borderRadius: "5px", objectFit:"contain"}} width={20} height={20}/>
                                        <Text className='cm-font-fam500' style={{maxWidth: "calc(100% - 30px)"}} ellipsis={{tooltip: activity.roomStub.title}}>{activity.roomStub.title}</Text>
                                    </div>
                                    <div className='cm-font-size11 cm-dark-grey-text cm-flex cm-flex-direction-row cm-flex-center'>
                                        {CommonUtil.__getDateDay(new Date(activity.createdAt))} {CommonUtil.__format_AM_PM(activity.createdAt)}
                                    </div>
                                </div>
                                {getHTML(activity)}
                            </Space>
                        ))
                    :
                        <div className="cm-flex-center cm-secondary-text" style={{height: "calc(100vh - 350px)"}}>No recent activities</div>
                    
                }
            </div>
        </>
    )
}

export default HomeRecentActivities