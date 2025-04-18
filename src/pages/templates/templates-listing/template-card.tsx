import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Divider, Form, Input, MenuProps, Modal, Space, Tooltip, Typography, Dropdown } from "antd";

import { ACCOUNT_TYPE_DSR, COMPANY_FALLBACK_ICON } from "../../../constants/module-constants";
import { FEATURE_TEMPLATES } from "../../../config/role-permission-config";
import { checkPermission } from "../../../config/role-permission";
import { RoomTemplateAgent } from "../api/room-template-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import UserQuickView from '../../../buyer-view/components/user-quick-view';
import Emoji from "../../../components/Emoji";
import Loading from "../../../utils/loading";

const { Paragraph } = Typography;
const { TextArea } = Input;
const { useForm } = Form;

const TemplateCard = (props: any) => {

    const { roomTemplate, onDelete } = props;

    const [form]    =   useForm();
    const navigate  =   useNavigate();

    const { $orgDetail, $user, $dictionary, $accountType, $entityCount, $limits } = useContext(GlobalContext);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [submitState, setSubmitState] = useState({
        text: "Update",
        loading: false
    })

    const handleOnClick = (event: any, record: any) => {
        if (event.metaKey || event.ctrlKey) {
            window.open(`${import.meta.env.VITE_APP_DOMAIN}/${$orgDetail.tenantName}#/templates/${record.uuid}`, "_blank")
        } else {
            navigate(`/templates/${record.uuid}`)
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    }

    const updateTemplateLanguage = (language: string) => {
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid: roomTemplate.uuid,
                input: {
                    language: language
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Language changed successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const onFinish = (values: any) => {

        setSubmitState({
            loading: true,
            text: "Updating"
        })

        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid: roomTemplate.uuid,
                input: {
                    title: values.title,
                    description: values.description,
                }
            },
            onCompletion: () => {
                setSubmitState({
                    loading: false,
                    text: "Update"
                })
                setIsModalVisible(false)
                CommonUtil.__showSuccess("Template updated successfully")
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    loading: false,
                    text: "Update"
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        setIsModalVisible(false);
    }

    const checkTemplatesLimit = () => {
        if($limits && $limits.templateLimit && parseInt($limits.templateLimit) !== -1){
            if( $entityCount.templatesCount >= parseInt($limits.templateLimit)){
                return false
            }else{
                return true
            }
        }else return true
    }

    const items: MenuProps['items'] = [
        {
            key: 'preview',
            icon: <MaterialSymbolsRounded font="open_in_new" size='16' />,
            label: `Preview ${$dictionary.templates.singularTitle}`,
            onClick: () => {
                window.open(roomTemplate.previewLink, "_blank")
            },
        },
        {
            key: 'edit',
            icon: <MaterialSymbolsRounded font="edit" size="16" />,
            label: "Edit",
            onClick: () => {
                setIsModalVisible(true)
            },

        },
        {
            key: 'language',
            className: "j-rt-language-submenu",
            icon: <MaterialSymbolsRounded font="language" size='16' />,
            label: "Language",
            popupClassName: "j-template-card-submenu",
            expandIcon: <MaterialSymbolsRounded font="chevron_right" size="16" />,
            children: [
                {
                    key: 'en',
                    label: <div className="cm-font-size14 cm-font-fam400">en - English</div>,
                    onClick: () => {
                        updateTemplateLanguage("en")
                    },
                },
                {
                    key: 'fr',
                    label: <div className="cm-font-size14 cm-font-fam400">fr - French</div>,
                    onClick: () => {
                        updateTemplateLanguage("fr")
                    },
                },
                {
                    key: 'de',
                    label: <div className="cm-font-size14 cm-font-fam400">de - German</div>,
                    onClick: () => {
                        updateTemplateLanguage("de")
                    },
                },
                {
                    key: 'es',
                    label: <div className="cm-font-size14 cm-font-fam400">es - Spanish</div>,
                    onClick: () => {
                        updateTemplateLanguage("es")
                    },
                },
            ],
        },
        checkTemplatesLimit() ? {
            key: 'clone',
            icon: <MaterialSymbolsRounded font="file_copy" size="16" />,
            label: "Clone",
            onClick: () => {
                RoomTemplateAgent.cloneTemplateFromExisting({
                    variables: {
                        templateUuid: roomTemplate.uuid
                    },
                    onCompletion: (data: any) => {
                        navigate(`/templates/${data.cloneRoomTemplate.uuid}`);
                        CommonUtil.__showSuccess("Template cloned successfully");
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error);
                    }
                });
            },
        } : null, 
        $orgDetail.tenantName !== "kissflow"  && !($accountType === ACCOUNT_TYPE_DSR) ? 
        {
            key: "discoverySwitch",
            icon: <MaterialSymbolsRounded font="forum" size="16" />,
            label: roomTemplate.isDiscoveryEnabled ? "Disable Discovery" : "Enable Discovery",
            onClick: () => {
                RoomTemplateAgent.enableOrDisableDiscovery({
                    variables: {
                        templateUuid: roomTemplate.uuid,
                        enable: !roomTemplate.isDiscoveryEnabled
                    },
                    onCompletion: () => {
                        CommonUtil.__showSuccess(`Discovery ${roomTemplate.isDiscoveryEnabled ? "disabled" : "enabled"} successfully`);
                    },
                    errorCallBack: (error: any) => {
                        CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

                    }
                })
            },
        }: null,
        {
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            label: (
                <span>Delete</span>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                onDelete(roomTemplate)
            },
            danger: true
        },
    ];


    return (
        <>
            <div>
                <Card className='hover-item j-template-card' key={roomTemplate.uuid} onClick={(event: any) => handleOnClick(event, roomTemplate)} hoverable bordered={false}>
                    <Space className='j-template-card-wc cm-flex-center' size={20}>
                        <Avatar className="j-template-listing-icon cm-font-fam600" shape="square" size={120} style={{ color: "#000000D9", backgroundColor: "#fff", borderRadius: "7px", fontSize: "30px", opacity: "85%" }}>
                            {CommonUtil.__getAvatarName(roomTemplate.title, 2)}
                        </Avatar>
                        <Emoji font="🤝" size="50" />
                        <Avatar className="j-template-listing-icon cm-font-fam600" shape="square" size={120} style={{ backgroundColor: "#fff", borderRadius: "7px", color: "#000000D9", fontSize: "30px", opacity: "85%" }} src={roomTemplate.sellerAccount.logoUrl ? roomTemplate.sellerAccount.logoUrl : COMPANY_FALLBACK_ICON}>
                            {CommonUtil.__getAvatarName(roomTemplate.sellerAccount.title, 2)}
                        </Avatar>
                    </Space>
                    <Space align="start" direction="vertical" size={0} className="cm-space-inherit cm-width100" >
                        <div style={{ width: "90%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "15px" }}>
                            <Tooltip title={roomTemplate.title} mouseEnterDelay={1}>
                                <Paragraph
                                    className="cm-font-fam500 cm-font-size14 cm-margin0"
                                    ellipsis={{ rows: 1, expandable: false }}
                                >
                                    {roomTemplate.title}
                                </Paragraph>
                            </Tooltip>
                        </div>
                        <div className="cm-margin-top5">
                            {
                                roomTemplate.description
                                    ?
                                    <Tooltip title={roomTemplate.description} mouseEnterDelay={1}>
                                        <Paragraph
                                            style={{ opacity: "85%" }}
                                            color="#000000D9"
                                            className="cm-font-size12"
                                            ellipsis={{ rows: 1, expandable: false }}
                                        >
                                            {roomTemplate.description}
                                        </Paragraph>
                                    </Tooltip>
                                    :
                                    <Paragraph className="cm-font-size12 cm-empty-text">
                                        No description found
                                    </Paragraph>
                            }
                        </div>
                    </Space>
                    <div className="cm-flex-space-between-center cm-flex-direction-row ">
                        <div className="cm-flex">
                            <div onClick={(e) => e.stopPropagation()}>
                                <UserQuickView user={roomTemplate.createdBy}>
                                    <Avatar className='cm-flex-center' size={20} style={{ backgroundColor: "#ededed", color: "#000", fontSize: "10px", marginRight: "10px" }} src={roomTemplate.createdBy.profileUrl ? <img src={roomTemplate.createdBy.profileUrl} alt={CommonUtil.__getFullName(roomTemplate.createdBy.firstName, roomTemplate.createdBy.lastName)} /> : ""}>
                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(roomTemplate.createdBy.firstName, roomTemplate.createdBy.lastName), 1)}
                                    </Avatar>
                                </UserQuickView>
                            </div>
                            <div>
                                <Divider type="vertical" style={{ marginLeft: "0px" }} />
                            </div>
                            <div className="cm-flex-center">
                                <Paragraph className="cm-font-size12" style={{ marginBottom: "0", left: "-8px", color: "#000000D9", opacity: "85%" }}>{`${CommonUtil.__getDateDay(new Date(roomTemplate.createdAt))} ${new Date(roomTemplate.createdAt).getFullYear()}`}</Paragraph>
                            </div>
                        </div>
                        {
                            checkPermission($user.role, FEATURE_TEMPLATES, 'update') &&
                            <div className='cm-flex-align-center' onClick={(event: any) => event.stopPropagation()}>
                                <Dropdown menu={{ items, selectedKeys: [roomTemplate.language, roomTemplate.region ? roomTemplate.region.uuid : null] }} trigger={["click"]} className="j-template-card-menu" overlayClassName="j-template-card-menu-popup" destroyPopupOnHide>
                                    <div onClick={(event) => event.stopPropagation()} className="cm-cursor-pointer j-res-card-more cm-flex-center">
                                        <MaterialSymbolsRounded font="more_vert" size="20" className='cm-secondary-text' />
                                    </div>
                                </Dropdown>
                            </div>
                        }
                    </div>
                </Card>
            </div>
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={form.submit}
                footer={null}
                className="cm-bs-custom-modal"
                centered
            >
                <div className="cm-modal-header cm-flex-align-center">
                    <div className="cm-font-size16 cm-font-fam500 cm-flex-align-center">Edit {$dictionary.templates.singularTitle}</div>
                </div>
                <Form className="cm-form cm-modal-content" layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item name="title" rules={[{ required: true, message: "Add a title", whitespace: true }]} initialValue={roomTemplate.title} label={"Title"} className="cm-width100">
                        <Input size="large" allowClear placeholder={"Add a title"} />
                    </Form.Item>
                    <Form.Item name="description" initialValue={roomTemplate.description} label={"Description"} className="cm-width100">
                        <TextArea rows={2} size="large" placeholder={"Add a description"} />
                    </Form.Item>
                </Form>
                <Space className="cm-flex-justify-end cm-modal-footer">
                    <Form.Item noStyle>
                        <Button ghost className="cm-modal-footer-cancel-btn" onClick={handleCancel}>
                            <Space size={10}>
                                <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                            </Space>
                        </Button>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type="primary" className={`cm-flex-center cm-cancel-btn ${submitState.loading ? "cm-button-loading" : ""}`} onClick={() => form.submit()} disabled={submitState.loading}>
                            <Space size={10}>
                                <div className="cm-font-size14">{submitState.text}</div>
                                {
                                    submitState.loading && <Loading color="#fff" />
                                }
                            </Space>
                        </Button>
                    </Form.Item>
                </Space>
            </Modal>
        </>
    )
}

export default TemplateCard