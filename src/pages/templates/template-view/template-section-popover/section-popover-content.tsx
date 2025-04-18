import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Button, Dropdown, MenuProps, Space, Tooltip, Typography } from "antd"

import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";
import { getTemplateOptionIcon } from "../../create-template/template-options"
import { TEMPLATE_OPTION_CONFIG } from "../../config/template-option-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { TEMPLATE_SECTION_ADDED } from "../../../../tracker-constants";
import { RT_SECTION_CATALOG } from "../../api/room-templates-query";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { AppTracker } from "../../../../app-tracker";
import { GlobalContext } from "../../../../globals";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";
import Loading from "../../../../utils/loading";

const { Text }    =    Typography;

const SectionPopoverContent = (props: {setCurrentView : any}) => {

    const { setCurrentView }    =   props;

    const { $user, $isVendorMode, $isVendorOrg }    =   useContext(GlobalContext);

    const params        =   useParams();

    const { data, loading, error }  =   useQuery(RT_SECTION_CATALOG, {
        variables: {
            templateUuid    :   params.roomTemplateId
        },
        fetchPolicy: "network-only"
    })

    const sectionCatalog = data?._rtSectionCatalog;

    const handleAddNewSection = () => {
        RoomTemplateAgent.addRoomTemplateSection({
            variables: {
                templateUuid: params.roomTemplateId,
                input: {
                    title       :   "Untitled",
                    isHidden    :   true,
                    emoji       :   "🔖"
                }
            },
            onCompletion: (data: any) => {
                CommonUtil.__showSuccess("Section added successfully")
                AppTracker.trackEvent(TEMPLATE_SECTION_ADDED, {});
                setCurrentView({
                    id  :   data._rtAddSection.uuid,
                    type:   "CUSTOM_SECTION"
                });
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getMenuItems = (_section: any): MenuProps['items'] => [
        {
            key: 'show_section',
            label: (
                <Space style={{ minWidth: "130px" }} className='cm-flex' size={5}>
                    <MaterialSymbolsRounded font='visibility' size='18' />
                    Show Section
                </Space>
            ),
            onClick: (event) => {
                event.domEvent.stopPropagation();
                handleUpdateSection(_section)
            }
        },
        {
            key: 'delete',
            icon: <MaterialSymbolsRounded font="delete" size="16" />,
            danger: true,
            label: <span>Delete</span>,
            onClick: () => {
                    RoomTemplateAgent.deleteSection({
                        variables: {
                            sectionUuid:  _section.uuid,
                        },
                        onCompletion: () => {},
                        errorCallBack: (error: any) => {
                            CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                        }
                    })
                }
        }
    ];

    const handleUpdateSection = (_section: any) => {
        console.log(data._rtAddDefaultSection)
        RoomTemplateAgent.addDefaultSection({
            variables: {
                sectionUuid:  _section.uuid,
            },
            onCompletion: (data: any) => {
                if(data._rtAddDefaultSection.type !== "NEXT_STEPS"){
                    setCurrentView({
                        id  :   data._rtAddDefaultSection.uuid,
                        type:   data._rtAddDefaultSection.type
                    });
                }
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    const TemplateEditPermission     =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');
    
    const HiddenCustomSection        =   sectionCatalog?.some((section: any) => (section.type === "CUSTOM_SECTION" && section.isHidden))
    if (loading) return <Loading/>
    if (error) return <SomethingWentWrong/>
    
    return (
        <div style={{width: "310px"}} className="cm-height100">
            {
                TemplateEditPermission ?
                    <Button className="cm-flex-center cm-width100" type="primary" icon={<MaterialSymbolsRounded font="add" size="20"/>} onClick={handleAddNewSection}>
                        <div>New Section</div>
                    </Button>
                :
                    <Tooltip title="You don't have permission">
                        <Button className="cm-flex-center cm-width100" disabled={!TemplateEditPermission} type="primary" icon={<MaterialSymbolsRounded font="add" size="20"/>} onClick={() => {}}>
                            <div>New Section</div>
                        </Button>
                    </Tooltip>
            }
            <div className="j-section-popover-content cm-margin-block10">
                <div className="cm-font-size12 cm-secondary-text cm-margin-block5">Default Sections</div>
                {
                    Object.values(TEMPLATE_OPTION_CONFIG).filter((option: any) => sectionCatalog?.find((section: any) => section.type === option.key)).map((_option: any) => {
                        
                        const section = sectionCatalog?.find((section: any) => section.type === _option.key);

                        if($isVendorMode || $isVendorOrg){
                            if(_option.key !== "NEXT_STEPS"){
                                return (
                                    <div key={_option.key} className="cm-padding10 cm-flex-space-between cm-flex-align-center">
                                        <Space size={14}>
                                            <div style={{width: "25px"}}>
                                                {getTemplateOptionIcon(_option.key, section?.isAdded)}
                                            </div>
                                            <Space direction="vertical" size={2}>
                                                <div className="cm-font-fam500">{_option.title}</div>
                                                <Text style={{ maxWidth: !section?.isAdded ? "180px" : "260px" }} ellipsis={{ tooltip: _option.description }} className="cm-font-size13 cm-font-opacity-black-65">
                                                    {_option.description}
                                                </Text>
                                            </Space>
                                        </Space>
                                        {
                                            !section?.isAdded &&
                                                <Button size="small" className="cm-padding10" onClick={() => handleUpdateSection(section)}>
                                                    Add
                                                </Button>
                                        }
                                    </div>
                                );
                            }
                        }else{
                            return (
                                <div key={_option.key} className="cm-padding10 cm-flex-space-between cm-flex-align-center">
                                    <Space size={14}>
                                        <div style={{width: "25px"}}>
                                            {getTemplateOptionIcon(_option.key, section?.isAdded)}
                                        </div>
                                        <Space direction="vertical" size={2}>
                                            <div className="cm-font-fam500">{_option.title}</div>
                                            <Text style={{ maxWidth: !section?.isAdded ? "180px" : "260px" }} ellipsis={{ tooltip: _option.description }} className="cm-font-size13 cm-font-opacity-black-65">
                                                {_option.description}
                                            </Text>
                                        </Space>
                                    </Space>
                                    {
                                        !section?.isAdded &&
                                            <Button size="small" className="cm-padding10" onClick={() => handleUpdateSection(section)}>
                                                Add
                                            </Button>
                                    }
                                </div>
                            );
                        }
                    })
                }
                { HiddenCustomSection && <div className="cm-font-size12 cm-secondary-text cm-margin-block5">Hidden Sections</div>}
                {
                    sectionCatalog?.filter((section: any) => (section.type === "CUSTOM_SECTION" && section.status === "HIDDEN")).map((_section: any) => {
                        return (
                            <div key={_section.key} className="cm-padding10 cm-flex-space-between cm-flex-align-center cm-cursor-pointer">
                                <Space size={14}>
                                    <div className="cm-font-size18">{_section?.emoji}</div>
                                    <Text className="cm-font-fam500" style={{width: "180px"}} ellipsis={{tooltip: _section.title}}>{_section?.title}</Text>
                                </Space>
                                <Dropdown menu={{items: getMenuItems(_section) }} trigger={["click"]} placement="bottom">
                                    <div onClick={(event) => event.stopPropagation()} className='cm-cursor-pointer'>
                                        <MaterialSymbolsRounded font="more_vert" size="20" />
                                    </div>
                                </Dropdown>   
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default SectionPopoverContent
