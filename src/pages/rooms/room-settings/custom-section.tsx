import { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { Dropdown, Form, MenuProps, Space, Typography } from 'antd';
import { kebabCase } from 'lodash';

import { PermissionCheckers } from '../../../config/role-permission';
import { FEATURE_ROOMS } from '../../../config/role-permission-config';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';
import { RoomsAgent } from '../api/rooms-agent';

import DeleteConfirmation from '../../../components/confirmation/delete-confirmation';
import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import Emoji from '../../../components/Emoji';

const { Text }      =   Typography;
const { useForm }   =   Form;

const CustomSection = (props: { provided?: any, step: any, sectionId: any, roomsSectionList?: any}) => {
    
    const { provided, step, sectionId, roomsSectionList }  =   props;

    const { $user, setHidebackinAP }              =   useContext(GlobalContext);

    const RoomEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const navigate               =   useNavigate()
    const location               =   useLocation()
    const params                 =   useParams()
    const [form]                 =   useForm();

    const [isActive, setIsActive]                               =   useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false)

    const handleSectionVisible = () => {
        RoomsAgent.updateSection({
            variables: {
                sectionUuid: step?.uuid,
                input: {
                    isHidden    :   !step?.isHidden
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Section updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const items: MenuProps['items'] = [
        {
            key: 'hide_section',
            label: (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font={step?.isHidden ? 'visibility' : 'visibility_off'} size='18' />
                    {step?.isHidden ? "Show Section" : "Hide Section"}
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                handleSectionVisible();
            }
        },
        {
            key     :   'delete',
            icon    :   <MaterialSymbolsRounded font="delete" size="16" />,
            danger  :   true,
            label   :   <span>Delete</span>,
            onClick :   (event: any) => {
                event.domEvent.stopPropagation();
                setShowDeleteConfirmation(true)
            }
        }
    ];

    const handleDeleteSection = () => {
        RoomsAgent.deleteSection({
            variables: {
                sectionUuid:  step?.uuid,
            },
            onCompletion: () => {
                let otherSections = roomsSectionList.filter((section: any) => section?.uuid !== step.uuid)
                if(otherSections.length === 0) return navigate(`/rooms/${params.accountId}/${params.roomId}/sections`)
                navigate(`/rooms/${params.accountId}/${params.roomId}/sections/${otherSections[0].uuid}`)
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleClick = () => {
        switch(step?.type){
            case "NEXT_STEPS"   :   
                return (
                    setHidebackinAP(false),
                    navigate("../collaboration")
                )
            // case "FAQ"          :   return !(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app") ? <RoomFaq/> : {}
            // case "RESOURCES"    :   return navigate("../resources")
            default             :   return navigate(`${step?.uuid}`)
        }
    }

    const stepTypeClass     =   step?.type?.toLowerCase() === 'talk_to_us' ? kebabCase(step?.type?.toLowerCase()) : step?.type?.toLowerCase();

    return (
        <Form 
            key         =   {step?.uuid} 
            form        =   {form} 
            onClick     =   {handleClick} 
            className   =   {'cm-cursor-pointer'}
        >
            <Space 
                className={`j-room-section hover-item cm-flex-space-between ${step?.uuid === sectionId && "active"} ${location.pathname.split("/")[5] === stepTypeClass ? "active" : ""}  ${location.pathname.split("/")[5] === step?.uuid ? "active" : ""}`}
                {...(provided && {
                    ref: provided.innerRef,
                    ...provided.draggableProps,
                })}
                onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}
            >
                <Space size={15} className='j-r-nav-step cm-flex'>
                    {
                        (
                            isActive ?
                                <div className='cm-cursor-dragger' {...(provided && provided.dragHandleProps)} onClick={(e) => e.stopPropagation()}>
                                    <MaterialSymbolsRounded font='drag_indicator' size='20' color='#7a7a7a'/>
                                </div>
                            :
                                <Emoji font={step?.emoji} size="18"/>
                        )
                    }
                    <Text style={{maxWidth: "140px", opacity : step?.isHidden && "50%"}} ellipsis={{tooltip: step?.title}}>{step?.title}</Text>
                </Space>
                <div className='cm-position-relative cm-flex-align-center' style={{right: "15px"}}>
                    {
                        RoomEditPermission &&
                            <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" className='show-on-hover-icon'>
                                <div onClick={(event) => event.stopPropagation()} className='cm-position-absolute'>
                                    <MaterialSymbolsRounded font="more_vert" size="20" />
                                </div>
                            </Dropdown>
                    }
                    {
                        step?.isHidden && !isActive &&
                        <div className='cm-flex-center cm-position-absolute'>
                            <MaterialSymbolsRounded font={"visibility_off"} size='18'/>
                        </div>
                    }
                </div>
            </Space>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation}
                onOk        =   {() => {handleDeleteSection(); setShowDeleteConfirmation(false)}}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                header      =   'Delete Section'
                body        =   'Are you sure you want to delete this section?'
                okText      =   'Delete'
            />
        </Form>
    )
}

export default CustomSection