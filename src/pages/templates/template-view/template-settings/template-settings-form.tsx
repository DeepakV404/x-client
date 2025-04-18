import { capitalize }  from 'lodash';
import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react"
import { Button, Dropdown, MenuProps, Space, Switch, Typography } from "antd";

import { GlobalContext } from "../../../../globals"
import { CommonUtil } from "../../../../utils/common-util";
import { REGIONS } from "../../../settings/api/settings-query";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { checkPermission } from "../../../../config/role-permission";
import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import TemplateDeleteModal from "../../templates-listing/template-delete-modal";
import { ACCOUNT_TYPE_DSR } from '../../../../constants/module-constants';

const { Text }  =   Typography;

const TemplateSettingsForm = (props: {roomTemplate: any}) => {

    const { roomTemplate }         =   props;

    const { $dictionary, $user, $accountType }   =   useContext(GlobalContext);

    const [selectedRegions, setSelectedRegions]                 =   useState<string[]>([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation]   =   useState(false);

    const { data: regionsData }    =    useQuery(REGIONS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (roomTemplate?.regions) {
            const selectedUuids = roomTemplate.regions.map((region: any) => region.uuid);
            setSelectedRegions(selectedUuids);
        }
    }, [roomTemplate?.regions]);

    const handleDiscoverySwitch = () => {
        RoomTemplateAgent.enableOrDisableDiscovery({
            variables: {
                templateUuid    :   roomTemplate.uuid,
                enable          :   !roomTemplate.isDiscoveryEnabled
            },
            onCompletion: () => {
                CommonUtil.__showSuccess(`Discovery ${roomTemplate.isDiscoveryEnabled ? "disabled" : "enabled"} successfully`);
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)

            }
        })
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

    const items: MenuProps['items'] = [
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
    ]

    const regions: MenuProps['items'] = regionsData?.regions.map((region: any) => ({
        key     :   region.uuid,
        label   :   (
            <Space className="cm-flex-space-between">
                {region.name}
                {selectedRegions.includes(region.uuid) && <MaterialSymbolsRounded font="check" size="18"/>}
            </Space>
        ),
        onClick: () => {
            const isSelected = selectedRegions.includes(region.uuid);
            let updatedRegions;
    
            if (isSelected) {
                updatedRegions = selectedRegions.filter((id) => id !== region.uuid);
            } else {
                updatedRegions = [...selectedRegions, region.uuid];
            }
    
            setSelectedRegions(updatedRegions);
    
            RoomTemplateAgent.updateRoomTemplate({
                variables: {
                    templateUuid: roomTemplate.uuid,
                    input: {
                        regionsUuid: updatedRegions
                    }
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Region updated successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error);
                }
            });
        },
    }));

    return (
        <>
            <div className="cm-modal-header cm-flex-align-center cm-margin-bottom5">
                <div className="cm-font-fam500 cm-font-size15">{$dictionary.templates.singularTitle} Settings</div>
            </div>
            <div className='cm-modal-content'>
                {
                    $accountType !== ACCOUNT_TYPE_DSR && 
                        <Space className="cm-flex-space-between cm-padding-bottom20">
                            <Space direction="vertical" size={4}>
                                <div className="cm-font-fam600">Enable Discovery </div>
                                <div className="cm-font-size13">Discovery questions will be displayed to contact</div>
                            </Space>
                            <Switch onChange={handleDiscoverySwitch} defaultChecked={roomTemplate.isDiscoveryEnabled}/>
                        </Space>
                }
                <Space className="cm-flex-space-between cm-padding-bottom20">
                    <Space direction="vertical" size={4}>
                        <div className="cm-font-fam600">Language</div>
                        <div className="cm-font-size13">The buyer will view the portal in selected language</div>
                    </Space>
                    {
                        checkPermission($user.role, FEATURE_TEMPLATES, 'update') &&
                            <div className='j-rt-setting-language cm-flex-align-center cm-cursor-pointer' onClick={(event: any) => event.stopPropagation()}>
                                <Dropdown menu={{ items, selectedKeys: [roomTemplate?.language] }} trigger={["click"]} destroyPopupOnHide>
                                    <Space>
                                        <MaterialSymbolsRounded font="language" size='16'/>
                                        <div>{capitalize(roomTemplate?.language)}</div>
                                    </Space>
                                </Dropdown>
                            </div>
                    }
                </Space>
                <Space className="cm-flex-space-between">
                    <Space direction="vertical" size={4}>
                        <div className="cm-font-fam600">Region</div>
                        <div className="cm-font-size13">You can map one or multiple regions to pods.</div>
                    </Space>
                    {
                        <Dropdown menu={{ items: regions, selectedKeys: selectedRegions }} trigger={["click"]} placement="bottom" className="j-template-header-icon-wrapper cm-cursor-pointer" overlayClassName="j-template-region-dropdown" destroyPopupOnHide>
                            <Space onClick={(event) => event.stopPropagation()} size={4}>
                                {selectedRegions.length > 0 ? 
                                    <Text style={{ minWidth: "auto", maxWidth: "100px", marginLeft: "5px" }}>{selectedRegions.length} {selectedRegions.length === 1 ? `Region` : `Regions`}</Text>
                                : 
                                    <Text style={{ width: "100px", marginLeft: "5px" }} className="cm-light-text">Select Region</Text>
                                }
                                <MaterialSymbolsRounded font="arrow_drop_down" size="22" />
                            </Space>
                        </Dropdown>
                    } 
                </Space>
            </div>
            <div className='j-rt-setting-footer'>
                <Space className="cm-flex-space-between">
                    <Space direction="vertical" size={4}>
                        <div className="cm-font-fam600">Delete {$dictionary.templates.singularTitle}</div>
                        <div className="cm-font-size13" style={{width: "380px"}}>Please be aware that any changes you've made will be lost and cannot be recovered.</div>
                    </Space>
                    <Button danger onClick={() => setShowDeleteConfirmation(true)}>Delete</Button>
                </Space>
            </div>
            <TemplateDeleteModal
                isOpen      =   {showDeleteConfirmation}
                onCancel    =   {() => setShowDeleteConfirmation(false)}
                template    =   {roomTemplate}
                navigateToListing    =    {true}
            />
        </>
    )
}

export default TemplateSettingsForm
