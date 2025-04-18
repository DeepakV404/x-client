import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Button, Card, Dropdown, Form, MenuProps, Popconfirm, Space, Typography } from "antd"

import { ROOM_TEMPLATES } from "../../templates/api/room-templates-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { GlobalContext } from "../../../globals";
import { MP_PAGES } from "../api/settings-query";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import ShowcaseModal from "./showcase-modal";
import Loading from "../../../utils/loading";

const { useForm }   =   Form;
const { Text }      =   Typography;

const ShowcasePage = (props: {isHomePage?: boolean}) => {

    const { isHomePage }    =   props;

    const [ form ]  =   useForm();

    const navigate  =   useNavigate();

    const { $dictionary }   =   useContext(GlobalContext);

    const [showcaseModalOpen, setShowcaseModalOpen]     =   useState(false);
    const [selectedTemplate, setSelectedTemplate]       =   useState(null);

    const { data, loading }  =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    const { data: pData, }  =   useQuery(MP_PAGES, {
        fetchPolicy: "network-only"
    });

    const submittedTemplate = pData?._mpPages.map((_page: any) => _page.template.uuid || []);

    const navigateToTemplate = (_template: any) => {
        navigate(`/templates/${_template.uuid}`)
    }

    const items: MenuProps['items'] = [];

    data?.roomTemplates.map((_template: any) => {
        const isTemplateSubmitted = submittedTemplate?.includes(_template.uuid)
        let roomTemplates = {
            key     :   _template.uuid,
            label   :   (
                <div className="cm-width100 cm-flex-align-center cm-cursor-default">
                    <Space direction="vertical" className="cm-width100" size={2}>
                        <div className="cm-font-fam500 cm-font-size14">{_template.title}</div>
                        {
                            _template.description ?
                                <Text className="cm-font-fam400 cm-font-size12" style={{maxWidth: "500px"}} ellipsis={{tooltip: _template.description}}>{_template.description}</Text>
                            :
                                <div className="cm-font-fam300 cm-font-size12 cm-empty-text">No description found</div>
                        }
                    </Space>
                    <Space>
                        <Button 
                            onClick={(event) => {
                                if(event.metaKey || event.ctrlKey){
                                    window.open(`${window.location.href.split("#")[0]}#/templates/${_template.uuid}`, "_blank")
                                }else{
                                    navigateToTemplate(_template)
                                }
                            }}
                        >
                            Edit
                        </Button>
                        <Button style={{width: "75px"}} type="primary" ghost disabled={isTemplateSubmitted} onClick={(event) => {event?.preventDefault(); setShowcaseModalOpen(true); setSelectedTemplate(_template)}}>{isTemplateSubmitted ? "Added" : "Add"}</Button>
                    </Space>
                </div>
            ),
        }
        items.push(roomTemplates)
    })

    if(loading) return <Loading/>

    return(
        <>
            <div className={`cm-width100 cm-padding20 ${isHomePage ? "cm-height100" : "j-setting-showcase-page"} ${pData?._mpPages.length ? "" : "cm-flex-center cm-flex-direction-column cm-width100"}`}>
                <div className="cm-font-size16 cm-font-fam500 cm-flex-center cm-margin-block20">Choose {$dictionary.templates.singularTitle}</div>
                <Form form={form} className={`cm-form cm-flex-center ${pData?._mpPages.length ? "" : "cm-width100"}`} layout="vertical">
                    <Form.Item className="j-setting-template-select">
                        <Dropdown menu={{items}} trigger={["click"]} rootClassName="j-bsmp-dropdown-root">
                            <Button className="cm-width100" size="large">
                                <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                    <div className="cm-light-text cm-font-size14" style={{lineHeight: '16px'}}>Choose {$dictionary.templates.singularTitle}</div>
                                    <MaterialSymbolsRounded font='expand_more' size="18"/>
                                </div>
                            </Button>
                        </Dropdown>
                    </Form.Item>
                </Form>
                {
                    pData?._mpPages?.map((_page: any) => {
                        return(
                            <div className="cm-flex-center cm-margin-top15">
                                <Card className="j-setting-showcase-template-card">
                                    <div className="cm-width100 cm-flex-space-between">
                                        <Space direction="vertical" size={2}>
                                            <div className="cm-font-opacity-black-85 cm-font-fam500">{_page.template.title}</div>
                                            <div className="cm-font-size13 cm-secondary-text">Submitted by: <span className="cm-dark-text">{CommonUtil.__getFullName(_page.createdBy.firstName, _page.createdBy.lastName)}</span> on <span className="cm-dark-text">{CommonUtil.__getDateDay(new Date(_page.createdAt))}, {new Date(_page.createdAt).getFullYear()}</span></div>
                                        </Space>
                                        <Space size={15}>
                                            <Button 
                                                className       =   "cm-cursor-pointer" 
                                                onClick         =   {(event: any) => {
                                                    if(event.metaKey || event.ctrlKey){
                                                        window.open(`${window.location.href.split("#")[0]}#/templates/${_page.template.uuid}`, "_blank")
                                                    }else{
                                                        navigateToTemplate(_page.template)
                                                    }
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button className="cm-cursor-pointer" onClick={() => {window.open(data?.roomTemplates.filter((_template: any) => _template.uuid === _page.template.uuid)[0]?.previewLink, "_blank")}}>Preview</Button>
                                            <Popconfirm
                                                placement           =   "left"
                                                title               =   {<div className="cm-font-fam500">Remove Page</div>}
                                                description         =   {<div className="cm-font-size13">Are you sure you want to remove this page?</div>}
                                                icon                =   {null}
                                                okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0", lineHeight: "20px"}, danger: true}}
                                                cancelButtonProps   =   {{style: {fontSize: "12px", lineHeight: "20px"}, danger: true, ghost: true}}
                                                okText              =   {"Remove"}
                                                onCancel            =   {(event: any) => {
                                                    event.stopPropagation()
                                                }}
                                                onConfirm           =   {(event: any) => {
                                                    event.stopPropagation()
                                                    SettingsAgent.mpRemovePage({
                                                        variables: {
                                                            pageUuid   :  _page.uuid
                                                        },
                                                        onCompletion: () => {
                                                            CommonUtil.__showSuccess("Page removed successfully")
                                                        },
                                                        errorCallBack: (error: any) => {
                                                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                                        }
                                                    })
                                                }}
                                            >
                                                <MaterialSymbolsRounded font='delete' size='20' className="cm-cursor-pointer cm-red-text" onClick={(event: any) => event.stopPropagation()}/>
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
            <ShowcaseModal
                isOpen      =   {showcaseModalOpen}
                onClose     =   {() => setShowcaseModalOpen(false)}
                template    =   {selectedTemplate}
            />
        </>
    )
}

export default ShowcasePage