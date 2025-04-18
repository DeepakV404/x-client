import { FC, useContext } from "react";
import { Avatar, Badge, Col, DatePicker, Row, Space } from "antd";

import { BOOK_MEETING, DOWNLOAD, GOTO_URL, TEXT, UPLOAD, VIEW_DOCUMENT, WATCH_VIDEO } from "./config/action-point-type-config";
import { ERROR_CONFIG } from "../../../config/error-config";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import StakeholderDropdown from "../../../components/stakeholder-dropdown/stakeholder-dropdown";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../custom-hooks/use-translation-hook";
import SellerAvatar from "../../../components/avatars/seller-avatar";
import BuyerAvatar from "../../../components/avatars/buyer-avatar";
import UserQuickView from "../../components/user-quick-view";
import DownloadAction from "./action-types/download-action";
import UploadAction from "./action-types/upload-action";
import Translate from "../../../components/Translate";
import GoToUrl from "./action-types/go-to-url";
import ViewDoc from "./action-types/view-doc";
import dayjs from "dayjs";

interface ActionTypeProps
{
    actionId            :   string;
    actionPoint         :   any;
}

const ActionType: FC<ActionTypeProps> = (props) => {

    const { actionPoint, actionId }   =   props;

    const { $allUsers }    =   useContext(BuyerGlobalContext);

    const { translate }     =   useLocalization();

    let defaultActionType           =   actionPoint.type;

    const _getActionByType = () => {
        switch (defaultActionType) {
            case UPLOAD:
                return (
                    <UploadAction actionId={actionId} actionPoint={actionPoint}/>
                )
            case DOWNLOAD:
                return (
                    <DownloadAction resources={actionPoint.resources} />
                )
            case BOOK_MEETING:
                return (
                    <GoToUrl type={BOOK_MEETING} actionPoint={actionPoint}/> 
                )
            case VIEW_DOCUMENT:
                return (
                    <ViewDoc actionPoint={actionPoint}/>
                )
            case GOTO_URL:
                return ( 
                    <GoToUrl actionPoint={actionPoint} type={GOTO_URL}/> 
                )

            case WATCH_VIDEO:
                return (
                    <ViewDoc actionPoint={actionPoint}/>
                )
            case TEXT: 
                return (
                    <>
                        {
                            actionPoint?.textContent && actionPoint?.textContent.trim() !== "" ?
                                <>
                                    <div className="cm-font-size13" style={{opacity: "65%"}}>Note:</div>
                                    <div className="tiptap" style={{padding: "0px 0px 15px 0px"}} dangerouslySetInnerHTML={{__html: actionPoint?.textContent || ""}}></div> 
                                </>
                            :
                                null
                        }
                    </>
                )
            
            default: 
                return (
                    <>
                        {
                            actionPoint?.textContent && actionPoint?.textContent.trim() !== "" ?
                                <>
                                    <div className="cm-font-size13" style={{opacity: "65%"}}>Note:</div>
                                    <div className="tiptap" style={{padding: "0px 0px 15px 0px"}} dangerouslySetInnerHTML={{__html: actionPoint?.textContent || ""}}></div> 
                                </>
                            :
                                null
                        }
                    </>
                )
        }
    }

    const disabledDate = (current: any) => {
        const currentDate = dayjs();
        return current && current < currentDate.startOf('day');
    }

    const handleUserChange = (value: any) => {
        BuyerAgent.addActionPointAssignees({
            variables: {
                actionPointsUuid    :   [actionPoint.uuid],
                buyersUuid          :   [value.uuid]
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDueChange = (value: any) => {
        BuyerAgent.updateActionPointDue({
            variables: {
                actionPointsUuid    :   [actionPoint.uuid],
                dueAt               :   new Date(value).valueOf()
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const removeUser = (user: any) => {

        let input: any = {
            actionPointsUuid: [actionPoint.uuid]
        }

        input["buyersUuid"]     =   [user.uuid]

        BuyerAgent.removeActionPointAssignees({
            variables: input,
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.assignee-remove-message" />);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    let filteredUsers   = $allUsers?.filter((_filterUser: any) => _filterUser.__typename !== "AccountUserOutput")
    const customFormat  =   (value: any) => `${CommonUtil.__getDateDay(new Date(dayjs(value).valueOf()))}, ${new Date(dayjs(value).valueOf()).getFullYear()}`;

    return (
        <Space direction="vertical" className="cm-height100 cm-width100" size={15}>
            <Row className="cm-width100">
                <Col span={12}>
                    <span style={{opacity: "65%"}} className="cm-font-size13 cm-flex-align-center cm-height100"><Translate i18nKey={"common-labels.due-date"}/></span>
                </Col>
                <Col span={12}>
                    <div style={{width: "130px"}}>
                        <DatePicker defaultValue={actionPoint.dueAt ? dayjs(actionPoint.dueAt) : undefined} disabledDate={disabledDate} onChange={(event) => handleDueChange(event)} bordered={false} placeholder={translate("common-labels.select-date")} className={`cm-cursor-pointer j-buyer-ap-date-picker cm-text-align-center cm-background-white ${actionPoint.dueAt ? "" : "empty"}`} format={customFormat} allowClear={true} suffixIcon={<MaterialSymbolsRounded font="calendar_month" size="18" color="#000"/>}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <span style={{opacity: "65%"}} className="cm-font-size13 cm-flex-align-center cm-height100"><Translate i18nKey={"common-labels.assigned-to"}/></span>
                </Col>
                <Col span={12}>
                    <div className="cm-flex-space-between">     
                        <Space>
                            <Avatar.Group style={{display: "flex"}} maxCount={4} size={27} className="j-action-avatar-group">
                                {
                                    actionPoint.assignedBuyers.map((_stakeHolder: any) => (
                                        <UserQuickView user={_stakeHolder}>
                                            <Badge className="j-action-point-buyer-avatar cm-cursor-pointer" count={<MaterialSymbolsRounded font="cancel" size="14" className="j-buyer-avatar-close" onClick={(event) =>{event.stopPropagation() ,removeUser(_stakeHolder)}}/>}>
                                                <BuyerAvatar buyer={_stakeHolder} size={30} fontSize={12}/>
                                            </Badge>
                                        </UserQuickView>
                                    ))
                                }
                                {
                                    actionPoint.assignedSellers.map((_assignedSeller: any) => (
                                        <UserQuickView user={_assignedSeller}>
                                            <SellerAvatar seller={_assignedSeller} size={30} fontSize={12}/>
                                        </UserQuickView>
                                    ))
                                }
                            </Avatar.Group>
                            <StakeholderDropdown
                                buyers          =   {filteredUsers}
                                selectedSellers =   {actionPoint.assignedSellers}
                                selectedBuyers  =   {actionPoint.assignedBuyers}
                                onSelect        =   {handleUserChange}
                                shouldTraslate  =   {true}
                            />
                        </Space>
                    </div>
                </Col>
            </Row>
            {_getActionByType()}
        </Space>
    )
}

export default ActionType