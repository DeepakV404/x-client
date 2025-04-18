import { useContext, useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";

import { OWNER_PLACEHOLDER } from "../../../../constants/module-constants";
import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import useLocalization from "../../../../custom-hooks/use-translation-hook";
import Translate from "../../../../components/Translate";
import TalkToUsHeader from "./talk-to-us-header";

const { Text }      =   Typography;
const { useForm }   =   Form;

const TemplateTalkToUs = (props: {roomTemplate: any, id: string, sectionData: any}) => {

    const { roomTemplate, id }  =   props;

    const [form]        =   useForm();

    const { translate } = useLocalization();

    const { $user }    =    useContext(GlobalContext);

    const TemplateEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const [selectedCard, setSelectedCard]       = useState<number | null>(roomTemplate.calendarUrl ? 2 : 1);

    const handleCardClick = (cardIndex: number) => {
        setSelectedCard(cardIndex ?? null);
    };

    const onFinish = (values: any) => {
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid    :   roomTemplate.uuid,
                input           :   {
                    calendarUrl :  selectedCard === 1 ? "" : values.calendar_link
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Calendar updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })

        if(selectedCard === 1){
            form.setFieldsValue({
                ["calendar_link"]  : ""
            })
        }
    }

    return (
        <div className="cm-width100 cm-height100 cm-row cm-padding15 cm-background-gray" >
            <TalkToUsHeader id={id}/>
            <div className={`cm-overflow-auto j-talk-to-us-wrapper cm-flex-center cm-flex-direction-column`} style={{height: "calc(100% - 45px)"}}>
                <div className="cm-flex-center">
                    <Space size={30}>
                        <div className={`j-talk-to-us-card cm-cursor-pointer ${selectedCard === 1 ? 'j-talk-to-us-card-selected-card' : ''}`} onClick={() => handleCardClick(1)}>
                            {selectedCard === 1 &&
                                <div className="cm-width100">
                                    <MaterialSymbolsRounded className="cm-float-right cm-padding10" font="check_circle" filled color="#0065E5"/>
                                </div>
                            }
                            <div className="cm-text-align-center" style={{marginTop: "45px"}}>
                                <Text className="cm-font-fam500 cm-font-size16">Use Owner Calendar</Text> <br/>
                                <Text className="cm-font-size13">Buyer can see the room owner's calendar link in their portal</Text>
                            </div>
                            <div className="cm-flex-center" style={{height: "calc(100% - 95px)", flexDirection: "column", gap: "10px"}}>
                                <div className="cm-flex-center" style={{height: "60px", width: "60px", background: "#F4F9FF", borderRadius: "8px", border: "1px solid #C6E0FF"}}>
                                    <img src={OWNER_PLACEHOLDER} height={"100%"} width={"100%"}/>
                                </div>
                                <Text>{CommonUtil.__getFullName(roomTemplate.createdBy.firstName, roomTemplate.createdBy.lastName)}</Text>
                                {roomTemplate.createdBy.calendarUrl ? <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: roomTemplate.createdBy.calendarUrl}} className="j-hyperlink-text">{roomTemplate.createdBy.calendarUrl}</Text> : <div className="cm-font-size13 cm-empty-text">No calendar found</div>}
                                <div className="cm-text-align-center cm-light-text cm-font-size11">Room owner's calendar will be used when a room is created using this template</div>
                            </div>
                        </div>
                        <div className={`j-talk-to-us-card cm-cursor-pointer ${selectedCard === 2 ? 'j-talk-to-us-card-selected-card' : ''}`} onClick={() => handleCardClick(2)}>
                            {selectedCard === 2 &&
                                <div className="cm-width100">
                                    <MaterialSymbolsRounded className="cm-float-right cm-padding10" font="check_circle" filled color="#0065E5"/>
                                </div>
                            }
                            <div className="cm-text-align-center" style={{marginTop: "45px"}}>
                                <Text className="cm-font-fam500 cm-font-size16">Customize Calendar</Text> <br/>
                                <Text className="cm-font-size13">Buyer can see below calendar link in their portal</Text>
                            </div>
                            <div className="cm-flex-center cm-flex" style={{height: "calc(100% - 95px)"}}>
                                <Form form={form} onFinish={onFinish} className='cm-width100 cm-padding15 cm-form'>
                                    <Form.Item name={"calendar_link"} initialValue={roomTemplate.calendarUrl} rules={[{required: selectedCard === 2 && true, message: <Translate i18nKey="common-placeholder-required-message.calendar-link-required"/>}]}>
                                        <Input placeholder={translate("common-placeholder.paste-calendar-link")} prefix={<MaterialSymbolsRounded font="link"/>}/>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Space>
                </div>
                {
                    TemplateEditPermission &&
                        <div className="cm-flex-center" style={{marginTop: "40px"}}>
                            <Button type="primary" onClick={() => form.submit()}>Save</Button>
                        </div>
                }
            </div>
        </div>
    )
}

export default TemplateTalkToUs