import { useState } from "react";
import { Avatar, Badge, Popover, Space, Typography } from "antd";

import { CommonUtil } from "../../../utils/common-util";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Translate from "../../../components/Translate";

const { Text } = Typography;

const UserQuickView = (props: { user: any, children: any, inProduct?: boolean }) => {

    const { user, children, inProduct=true }  = props;

    const [copy, setCopy]               =   useState(false);

    const copyEmail = (email: string) => {
        window.navigator.clipboard.writeText(email)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  <Space><Badge status="success"/><div className='cm-font-size12 cm-letter-spacing03'><Translate i18nKey="common-labels.active"/></div></Space>
        }else if(status === "IN_ACTIVE"){
            return <Space><Badge status="warning"/><div className='cm-font-size12 cm-letter-spacing03'><Translate i18nKey="common-labels.inactive"/></div></Space>
        }else if(status === "INVITED"){
            return <Space><Badge status="processing"/><div className='cm-font-size12 cm-letter-spacing03'><Translate i18nKey="common-labels.invited"/></div></Space>
        }else if(status === "DELETED"){
            return <Space><Badge status="error"/><div className='cm-font-size12 cm-letter-spacing03'><Translate i18nKey="common-labels.deleted"/></div></Space>
        }
    }

    const UserInfo = () =>  {

        return  (
            <Space direction='vertical' className={inProduct ? "cm-padding20 cm-flex-center" : "cm-padding10 cm-flex-center"} style={{minWidth: inProduct ? "250px" : "180px", maxWidth: "200px"}} size={inProduct ? 16 : 8}>
                <Avatar size={inProduct ? 80 : 50} style = {{color: "#000", fontSize: "18px", display: "flex" }} src={user.profileUrl ? <img src={user.profileUrl} alt={CommonUtil.__getFullName(user.firstName, user.lastName)}/> : null}>
                    {CommonUtil.__getAvatarName(CommonUtil.__getFullName(user.firstName, user.lastName),2)}
                </Avatar>
                <Space direction='vertical' className="cm-flex-center cm-text-align-center" size={2}>
                    <Text ellipsis={{tooltip: CommonUtil.__getFullName(user.firstName, user.lastName)}} onClick={(event:any) => event.stopPropagation()} className={inProduct ? "cm-font-fam600 cm-font-size18 cm-letter-spacing03" : "cm-font-fam600 cm-font-size14 cm-letter-spacing03"}  style={{maxWidth: '200px',cursor: 'pointer'}}>
                        {CommonUtil.__getFullName(user.firstName, user.lastName)}
                    </Text>
                    {
                        user.uuid === "_room_owner" 
                            ?
                                <Text className="cm-font-fam500 cm-text-align-center" >On creating a room using this template, the room owner will be assigned to the action point</Text>
                            :
                                user.emailId 
                                ?
                                    <Space className="j-user-info-email cm-cursor-pointer cm-letter-spacing03" onClick={(event) => {event.stopPropagation(); copyEmail(user.emailId)}}>
                                        <Text ellipsis={{tooltip: user.emailId}} className={inProduct ? "cm-font-size12 cm-font-fam500 cm-letter-spacing03" : "cm-font-size11 cm-font-fam500 cm-letter-spacing03"} style={{maxWidth: "200px"}}>{user.emailId}</Text>
                                        <MaterialSymbolsRounded font={copy ? 'check' : 'content_copy'} size="14"/>
                                    </Space>
                                :
                                    <div className="cm-font-size14 cm-empty-text"><Translate i18nKey="common-empty.no-email-found"/></div>
                    }
                </Space>
                {getStatus(user.status)}
            </Space>
        )
    }

    return (
        <Popover rootClassName="j-user-popover" content={<UserInfo/>}>
            <div>
                {children}
            </div>
        </Popover>
    )
}

export default UserQuickView;