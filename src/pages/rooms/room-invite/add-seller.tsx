import { useContext, useState } from "react";
import { useParams } from "react-router";
import { Avatar, Button, Form, Select, Space } from "antd"

import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { Option }    =   Select;
const { useForm }   =   Form;

const AddSeller = (props: {onClose: () => void, roomData: any, setCurrentView: any}) => {

    const { onClose, roomData }     =   props;

    const params        =   useParams();
    const [form]        =   useForm();

    const { $sellers }  =   useContext(GlobalContext);

    const [submitState, setSubmitState]   =   useState({
        text    :   "Add",
        loading :   false
    })

    const onFinish = (values: any) => {
        setSubmitState({
            text    :   "Adding...",
            loading :   true
        })
        RoomsAgent.addUsersToRoom({
            variables: {
                roomUuid:   params.roomId,
                userUuids   :   values.userIds
            },
            onCompletion: () => {
                onClose()
                CommonUtil.__showSuccess("Team members added successfully")
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text    :   "Add",
                    loading :   false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    let filteredSellers = $sellers.filter((_seller) => {
        return (
          _seller.status !== "DELETED" &&
          !roomData?.users?.some((_user: any) => _user?.uuid === _seller.uuid) &&
          roomData?.owner?.uuid !== _seller.uuid
        );
      });
    
    return (
        <div className="j-share-room-link-wrap cm-width100">
            <Form form={form} className="cm-width100 cm-form cm-modal-content" layout='vertical' onFinish={onFinish} style={{padding: "10px 0 20px 0", minHeight: "217px"}}>
                <Form.Item name={"userIds"} label={"Select your team"} rules={[{required: true, message: "Select Team Members"}]}>
                    <Select 
                        showSearch
                        allowClear 
                        optionFilterProp =  "children"
                        placeholder      =  "Select Team Members"
                        suffixIcon       =   {<MaterialSymbolsRounded font="expand_more" size="18"/>} 
                        notFoundContent  = {
                            <div style={{height:"50px"}} className="cm-flex-center cm-font-opacity-black-65 cm-font-size12">
                                No team members found
                            </div>
                        }
                    >
                        {
                            filteredSellers.map((_seller: any) => (
                                <Option key={_seller.uuid}>
                                    <Space className="cm-flex-align-center">
                                        <Avatar className={`cm-flex-center`} size={25} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px" }} src={_seller.profileUrl ? <img src={_seller.profileUrl} alt={CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}/> : ""}>
                                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_seller.firstName, _seller.lastName), 1)}
                                        </Avatar>
                                        {CommonUtil.__getFullName(_seller.firstName, _seller.lastName)}
                                    </Space>
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
            <Space className="cm-flex-space-between cm-modal-footer cm-padding0">
                {/* {
                    <Avatar.Group style={{display: "flex"}} maxCount={5} className='cm-cursor-pointer' >
                        {
                            roomData?.owner ?
                                <Tooltip title="Owner" placement='bottom'>
                                    <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px", border: `2px solid ${colorPrimary}` }} className='cm-flex-align-center' src={roomData?.owner.profileUrl ? <img src={roomData?.owner.profileUrl} alt={CommonUtil.__getFullName(roomData?.owner.firstName, roomData?.owner.lastName)}/> : ""}>
                                        {CommonUtil.__getAvatarName(roomData?.owner.firstName, 1)}
                                    </Avatar>
                                </Tooltip>
                            :   
                            null
                        }
                        {
                            roomData?.users.filter((_filterUser: any) => !_filterUser.isOwner).map((_user: any) => (
                                <Avatar style = {{backgroundColor: "#ededed", color: "#000", fontSize: "12px"}} src={_user.profileUrl ? <img src={_user.profileUrl} alt={CommonUtil.__getFullName(_user.firstName, _user.lastName)}/> : ""}>
                                    {CommonUtil.__getAvatarName(_user.firstName, 1)}
                                </Avatar>
                            ))
                        }
                        <Avatar size={30} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "13px", display: "flex", alignItems: "center"}} onClick={() => setCurrentView({type: "seller", data : filteredSellers})}>
                            <MaterialSymbolsRounded font='more_horiz'/>
                        </Avatar> 
                    </Avatar.Group>
                } */}
                <div></div>
                <Space>
                    <Form.Item noStyle>
                        <Button className="cm-cancel-btn" onClick={() => onClose()}>
                            <Space size={10}>
                                <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                            </Space>
                        </Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                            <Space size={10}>
                                <div className="cm-font-size14">{submitState.text}</div>
                                {
                                    submitState.loading && <Loading color="#fff"/>
                                }
                            </Space>
                        </Button>
                    </Form.Item>
                </Space>
            </Space>
        </div>
    )
}

export default AddSeller