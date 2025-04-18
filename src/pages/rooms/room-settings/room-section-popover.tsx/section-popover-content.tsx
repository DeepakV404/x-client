import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dropdown, MenuProps, Space, Tooltip, Typography } from "antd"

import { TEMPLATE_OPTION_CONFIG } from "../../../templates/config/template-option-config";
import { getTemplateOptionIcon } from "../../../templates/create-template/template-options";
import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { PermissionCheckers } from "../../../../config/role-permission";
import { ROOM_SECTION_ADDED } from "../../../../tracker-constants";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { RoomsAgent } from "../../../rooms/api/rooms-agent";
import { CommonUtil } from "../../../../utils/common-util";
import { R_SECTION_CATALOG } from "../../api/rooms-query";
import { AppTracker } from "../../../../app-tracker";
import { GlobalContext } from "../../../../globals";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import Loading from "../../../../utils/loading";
import SomethingWentWrong from "../../../../components/error-pages/something-went-wrong";

const { Text }    =    Typography;

const SectionPopoverContent = (props: {hasBuyers: boolean}) => {

    const { hasBuyers }   =   props;

    const { $user, $isVendorMode, $isVendorOrg }    =   useContext(GlobalContext);

    const navigate      =   useNavigate()
    const params        =   useParams();

    const { data, loading, error }  =   useQuery(R_SECTION_CATALOG, {
        variables: {
            roomUuid    :   params.roomId
        },
        fetchPolicy: "network-only"
    })

    const sectionCatalog = data?._rSectionCatalog;
    
    const handleAddNewSection = () => {
        RoomsAgent.addSection({
            variables: {
                roomUuid    :   params.roomId,
                input       :   {
                    title       :   "Untitled",
                    isHidden    :   hasBuyers,
                    emoji       :   "🔖"
                }
            },
            onCompletion: (data: any) => {
                navigate(`${data._rAddSection.uuid}`)
                AppTracker.trackEvent(ROOM_SECTION_ADDED, {});
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
                RoomsAgent.deleteSection({
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
        RoomsAgent.addDefaultSection({
            variables: {
                sectionUuid:  _section.uuid,
            },
            onCompletion: (data: any) => {
                navigate(data._rAddDefaultSection.uuid);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    };

    const RoomEditPermission         =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    
    const HiddenCustomSection        =   sectionCatalog?.some((section: any) => (section.type === "CUSTOM_SECTION" && section.isHidden))

    if (loading) return <Loading/>
    if (error) return <SomethingWentWrong/>
    
    return (
        <div style={{width: "310px"}} className="cm-height100">
            {
                RoomEditPermission ?
                    <Button className="cm-flex-center cm-width100" type="primary" icon={<MaterialSymbolsRounded font="add" size="20"/>} onClick={handleAddNewSection}>
                        <div>New Section</div>
                    </Button>
                :
                    <Tooltip title="You don't have permission">
                        <Button className="cm-flex-center cm-width100" disabled={!RoomEditPermission} type="primary" icon={<MaterialSymbolsRounded font="add" size="20"/>} onClick={() => {}}>
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
                                                <Text style={{ maxWidth: !section?.isAdded ? "180px" : "100%" }} ellipsis={{ tooltip: _option.description }} className="cm-font-size13 cm-font-opacity-black-65">
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
