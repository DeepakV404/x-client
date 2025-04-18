import { useContext, useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";

import { OWNER_PLACEHOLDER } from "../../../constants/module-constants";
import { PermissionCheckers } from "../../../config/role-permission";
import { FEATURE_ROOMS } from "../../../config/role-permission-config";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import TalkToUsHeader from "./room-talk-to-us/talk-to-us-header";
import { useOutletContext } from "react-router-dom";

const { Text }      =   Typography;
const { useForm }   =   Form;

const RoomTalkToUs = () => {

    const { room }            =   useOutletContext<any>()

    const [form]    =  useForm();

    const { $user }    =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const [selectedCard, setSelectedCard] = useState<number | null>(room.calendarUrl ? 2 : 1);

    const handleCardClick = (cardIndex: number) => {
        setSelectedCard(cardIndex ?? null);
    };

    const onFinish = (values: any) => {
        RoomsAgent.updateRoom({
            variables: {
                roomUuid        :   room.uuid,
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
        <div className="cm-height100 cm-overflow-auto cm-padding15">
            <TalkToUsHeader />
            <div className="j-talk-to-us-wrapper cm-flex-center cm-flex-direction-column" style={{height: "calc(100% - 45px)"}}>
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
                                <Text>{room.owner ? CommonUtil.__getFullName(room.owner.firstName, room.owner.lastName) : "Room owner name"}</Text>
                                {
                                    room.owner && room.owner.calendarUrl ? 
                                        <Text style={{maxWidth: "350px"}} ellipsis={{tooltip: room.owner.calendarUrl}} className="j-hyperlink-text" onClick={(event) => {event.stopPropagation(); window.open(room.owner.calendarUrl, "_blank")}}>{room.owner.calendarUrl}</Text> 
                                    : 
                                        <Text className="cm-empty-text">No calendar found</Text> 
                                }
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
                                <Text className="cm-font-size13">Buyer can see the below calendar link in their portal</Text>
                            </div>
                            <div className="cm-flex-center cm-flex" style={{height: "calc(100% - 95px)"}}>
                                <Form form={form} onFinish={onFinish} className='cm-width100 cm-padding15 cm-form'>
                                    <Form.Item name={"calendar_link"} initialValue={room.calendarUrl} rules={[{required: selectedCard === 2 && true, message: "Calendar link is required"}]}>
                                        <Input placeholder={"Paste a calendar link"} prefix={<MaterialSymbolsRounded font="link"/>}/>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Space>
                </div>
                {
                    RoomEditPermission &&
                        <div className="cm-flex-center" style={{marginTop: "40px"}}>
                            <Button type="primary" onClick={() => form.submit()}>Save</Button>
                        </div>
                }
            </div>
        </div>
    )
}

export default RoomTalkToUs