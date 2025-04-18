import { Space, Tag, Dropdown, Menu, Input, Form, Divider, Row, Col } from "antd";
import { FC, useCallback, useContext } from "react";
import { useQuery } from "@apollo/client";
import { debounce } from 'lodash';

import { STAGE_STATUS_CONFIG, TODO } from "./config/stage-status-config";
import { Length_Input } from "../../../constants/module-constants";
import { BuyerGlobalContext } from "../../../buyer-globals";
import { BUYER_ACTION_POINT } from "../../api/buyers-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { BuyerAgent } from "../../api/buyer-agent";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import useLocalization from "../../../custom-hooks/use-translation-hook";
import Translate from "../../../components/Translate";
import ActionComment from "./action-view-comment";
import Loading from "../../../utils/loading";
import ActionType from "./action-type";

const { TextArea }  =   Input;
const { useForm }   =   Form;

interface ActionViewProps
{
    onClose :   () => void;
    actionId    :   string;
}

const ActionView: FC <ActionViewProps> = (props) => {

    const { onClose, actionId }     =   props;

    const { translate }             =   useLocalization();

    const [form]                    =   useForm();

    const { $allUsers, $sellers, $buyerData }   =   useContext(BuyerGlobalContext);

    const { data, loading, error }  =   useQuery(BUYER_ACTION_POINT, {
        fetchPolicy:    "network-only",
        variables: {
            actionPointUuid :   actionId
        }
    });

    const debouncedSubmit = useCallback(
        debounce(() => {
          form.submit();
        }, 1000),
        []
    );

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    const handleStatusChange = (value: any) => {
        BuyerAgent.updateActionPointStatus({
            variables: {
                actionPointsUuid    :   [actionId],
                status              :   value.key
            },
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.status-updated-message" />);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleUpdateActionPoint = (values: any) => {
        BuyerAgent.updateActionPoint({
            variables: {
                actionPointUuid :   actionId,
                input           :   {
                    title       :   values.title,
                    description :   values.description
                },
            },
            onCompletion: () => {
                CommonUtil.__showSuccess(<Translate i18nKey="success-message.title-update-message" />);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const Statuses = (
        <Menu onClick={(event) => handleStatusChange(event)}>
            {
                Object.values(STAGE_STATUS_CONFIG).map((_status) => (
                    <Menu.Item key={_status.key}>
                        <Tag bordered={false} style={{ backgroundColor: _status.backgroundColor, color: _status.tag}}>
                            <Translate i18nKey={`action-point-status.${_status.i18nkey}`}/>
                        </Tag>
                    </Menu.Item>
                ))
            }
        </Menu>
    )

    let filteredUsers = $allUsers.filter((_filterUser) => _filterUser.__typename !== "AccountUserOutput")

    return (
        <>
            <div className="j-buyer-action-slider-view-header cm-flex-space-between">
                <Form form={form} onFinish={handleUpdateActionPoint} style={{width: "calc(100% - 180px)"}}>
                    <Form.Item noStyle name={"title"} rules={[{required: true, whitespace: true}]} initialValue={data?.buyerActionPoint.title}>
                        <Input className="cm-font-size16 cm-font-fam500" maxLength={Length_Input} required bordered={false} style={{padding: "0px"}} onChange={debouncedSubmit} disabled={data?.buyerActionPoint.createdStakeholder.__typename !== "ContactOutput"} />
                    </Form.Item>
                    {
                        data?.buyerActionPoint.createdStakeholder.__typename !== "ContactOutput" ?
                            <Form.Item noStyle name={"description"} initialValue={data.buyerActionPoint.description}>
                                <TextArea className="cm-light-text" autoSize style={{padding: "0px", alignContent: "center"}} placeholder={data?.buyerActionPoint.createdStakeholder.__typename === "ContactOutput" ? translate("common-placeholder.enter-a-description") : ""} onChange={debouncedSubmit} variant="borderless" disabled={data?.buyerActionPoint.createdStakeholder.__typename !== "ContactOutput"} />
                            </Form.Item>
                        :
                            (
                                data.buyerActionPoint.description ? 
                                    <Form.Item noStyle name={"description"} initialValue={data.buyerActionPoint.description}>
                                        <TextArea className="cm-light-text" autoSize style={{padding: "0px", alignContent: "center"}} placeholder={data?.buyerActionPoint.createdStakeholder.__typename === "ContactOutput" ? translate("common-placeholder.enter-a-description") : ""} onChange={debouncedSubmit} variant="borderless" disabled={data?.buyerActionPoint.createdStakeholder.__typename !== "ContactOutput"} />
                                    </Form.Item>
                                :
                                    null
                            )
                    }
                </Form>
                <Space className="cm-flex-align-center">
                    <div className="j-action-view-status">
                        {
                            data?.buyerActionPoint.status ?
                                <Dropdown overlay={Statuses} trigger={["click"]}>
                                    <Space size={0} className="cm-cursor-pointer">
                                        <Tag bordered={false}  style={{ backgroundColor: STAGE_STATUS_CONFIG[data?.buyerActionPoint.status].backgroundColor, color: STAGE_STATUS_CONFIG[data?.buyerActionPoint.status].tag}}>
                                            <Translate i18nKey={`action-point-status.${STAGE_STATUS_CONFIG[data?.buyerActionPoint.status].i18nkey}`}/>
                                        </Tag>
                                        <MaterialSymbolsRounded font="expand_more" size="16"/>
                                    </Space>
                                </Dropdown>
                            :
                                <Dropdown overlay={filteredUsers.length > 0 ? Statuses : <></>} trigger={["click"]}>
                                    <Space size={0} className="cm-cursor-pointer">
                                        <Tag bordered={false} style={{backgroundColor: STAGE_STATUS_CONFIG[TODO].backgroundColor, color: STAGE_STATUS_CONFIG[TODO].tag}}>
                                            <Translate i18nKey={`action-point-status.${STAGE_STATUS_CONFIG[TODO].i18nkey}`}/>
                                        </Tag>
                                        <MaterialSymbolsRounded font="expand_more" size="16"/>
                                    </Space>
                                </Dropdown>
                        }
                    </div>
                    <div className="cm-padding5 cm-cursor-pointer" onClick={() => onClose()}>
                        <MaterialSymbolsRounded font="close" size="21"/>
                    </div>
                </Space>
            </div>
            <Divider style={{margin: 0}}/>
            <Row style={{height: "calc(100% - 82px)"}}>
                <Col span={$buyerData?.properties?.isCommentsEnabled ? 12 : 24} className="cm-height100 cm-padding15 cm-overflow-auto" style={{background: "#F7F9FA"}}>
                    <ActionType actionPoint={data.buyerActionPoint} actionId={actionId}/>
                </Col>
                {
                    $buyerData?.properties?.isCommentsEnabled &&
                        <Col span={12} className="cm-height100">
                            <ActionComment actionId={actionId} actionPoint={data} sellers={$sellers} buyers={$buyerData?.buyers}/>
                        </Col>
                }
            </Row>
        </>
    )
}

export default ActionView
