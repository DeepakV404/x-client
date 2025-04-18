import { useContext, useState } from "react"
import { useQuery } from "@apollo/client"
import { Space, Form, Input, Button, Layout, Typography } from "antd"
import { useNavigate, useParams } from "react-router-dom"

import { FEATURE_TEMPLATES } from "../../../config/role-permission-config"
import { PermissionCheckers } from "../../../config/role-permission"
import { ACCOUNT_TYPE_DPR, ACCOUNT_TYPE_GTM, Length_Input, MODULE_TEMPLATE } from "../../../constants/module-constants"
import { RoomTemplateAgent } from "../api/room-template-agent"
import { ROOM_TEMPLATE, RT_SECTIONS } from "../api/room-templates-query"
import { ERROR_CONFIG } from "../../../config/error-config"
import { CommonUtil } from "../../../utils/common-util"
import { GlobalContext } from "../../../globals"

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong"
import Loading from "../../../utils/loading"
import TemplateCopyLinkModal from "./template-copy-link/template-copy-link-modal"
import VendorShareDrawer from "./template-vendor-share/vendor-share-drawer"
import TemplateSettingsModal from "./template-settings/template-settings-modal"
import TemplateView from "."
import TemplateOptions from "../create-template/template-options"

const { Text }              =   Typography;
const { useForm }           =   Form;

const TemplateViewLayout = () => {

    const params                            =   useParams();
    const navigate                          =   useNavigate();
    const [form]                            =   useForm();
    
    const { $user, $orgDetail, $isVendorOrg, $isVendorMode, $accountType }             =   useContext(GlobalContext);

    const [editView, setEditView]                   =   useState(false);
    const [showCopyLink, setShowCopyLink]           =   useState(false);
    const [showVendorShare, setShowVendorShare]     =   useState(false);
    const [showSettingModal, setShowSettingModal]   =   useState(false);
    const [templateId]                              =   useState(params.roomTemplateId)

    const { data, loading, error }                  =   useQuery(ROOM_TEMPLATE, {
        variables   :   {
            uuid:   templateId
        },
        fetchPolicy: "network-only"
    });

    const { data: sectionsData, loading: sectionsLoading, error: sectionsError }  =   useQuery(RT_SECTIONS, {
        variables: {
            templateUuid    :   templateId
        },
        fetchPolicy: "network-only"
    })
    
    const TemplateEditPermission   =  PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const onFinish = (values: any) => {
        
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid    :   templateId,
                input           :   {
                    title       :   values.roomTemplateName
                }
            },
            onCompletion: () => {
                setEditView(false)
                CommonUtil.__showSuccess("Title updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
        
    }
    
    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }

    const navigateToLead  = () => {
        const queryParams = new URLSearchParams();

        queryParams.append('template', data.roomTemplate.uuid);

        const filterUrl = `${$orgDetail.tenantName}#/rooms?${queryParams.toString()}`;
        window.location.href = filterUrl;
    }

    if (loading || sectionsLoading) return <Loading/>
    if (error || sectionsError) return <SomethingWentWrong/>

    return(
        <>
            <div className="j-room-template-header cm-flex-align-center cm-width100 cm-flex-space-between">
                <Space>
                    <MaterialSymbolsRounded font="arrow_back" className="cm-cursor-pointer cm-margin-right5" onClick={() => navigate("/templates")} color="#454545" size="22"/>
                    {
                        TemplateEditPermission  ?
                            (editView ?
                                <Form form={form} className="cm-form cm-margin-left5 cm-width100 cm-flex-align-center" onFinish={onFinish}>
                                    <>
                                        <Form.Item name={"roomTemplateName"} noStyle initialValue={data.roomTemplate.title}>
                                            <Input autoFocus style={{width: "300px"}} maxLength={Length_Input} className="cm-font-fam500 cm-font-size16 cm-input-border-style"  placeholder="Untitled" onKeyDown={handleEnter}/>
                                        </Form.Item>
                                        <div className='cm-flex-center cm-cursor-pointer cm-input-submit-button' onClick={() => form.submit()} onKeyDown={handleEnter}><MaterialSymbolsRounded font="check" filled color='#0176D3'/></div>
                                    </>
                                </Form>
                            :
                                <Space className='cm-flex-align-center'>
                                    <Text className="cm-font-size18 cm-font-fam500" style={{ maxWidth: "300px"}} ellipsis={{tooltip: data.roomTemplate.title}}>{data.roomTemplate.title}</Text>
                                    <MaterialSymbolsRounded font="edit" size="15" className="cm-cursor-pointer" onClick={() => setEditView(true)}/>
                                </Space>
                            )
                        :
                            <Text className="cm-font-size18 cm-font-fam500" style={{ maxWidth: "300px"}} ellipsis={{tooltip: data.roomTemplate.title}}>{data.roomTemplate.title}</Text>
                    }
                </Space>
                {
                    TemplateEditPermission &&
                        <div className="cm-flex-align-center cm-gap8">
                            <div className="j-rt-header-settings-icon cm-cursor-pointer cm-flex-center" onClick={() => setShowSettingModal(true)}>
                                <MaterialSymbolsRounded font="settings" size="22" className="cm-secondary-text"/>
                            </div>
                            {
                                ($isVendorOrg || $isVendorMode) &&
                                    <Button type="primary" ghost onClick={navigateToLead}>Leads</Button>
                            }
                            {
                                $accountType === ACCOUNT_TYPE_DPR || $accountType === ACCOUNT_TYPE_GTM ?
                                    <Button type="primary" ghost onClick={() => setShowVendorShare(true)}>Share</Button>
                                :
                                    null
                            }
                            <Button type="primary" onClick={() => window.open(data.roomTemplate.previewLink, "_blank")}>Preview</Button>
                        </div>
                }
            </div>
            <Layout style={{ height: "calc(100% - 50px)", overflow: "auto" }}>
                {
                    sectionsData?._rtSections?.length > 0 ?
                        <TemplateView roomTemplate={data?.roomTemplate} sectionsData={sectionsData}/>
                    :
                        <TemplateOptions module={MODULE_TEMPLATE}/>
                }
            </Layout>
            <TemplateCopyLinkModal
                isOpen      =   {showCopyLink}
                onClose     =   {() => setShowCopyLink(false)}
                sharableLink=   {data.roomTemplate.leadGenLink}
                isGated     =   {data.roomTemplate.isGated}
            />
            <VendorShareDrawer
                isOpen      =   {showVendorShare}
                onClose     =   {() => setShowVendorShare(false)}
                sharableLink=   {data.roomTemplate.leadGenLink}
                isGated     =   {data.roomTemplate.isGated}
                templateId  =   {params.roomTemplateId}
            />
            <TemplateSettingsModal
                isOpen          =   {showSettingModal}
                onClose         =   {() => setShowSettingModal(false)}
                roomTemplate    =   {data?.roomTemplate}
            />
        </>
    )
}

export default TemplateViewLayout