import { useContext, useState } from "react";
import { Button, Dropdown, MenuProps, Select, Space, Switch, Tooltip } from "antd";

import { RoomSettingItem, RoomSettingsBooleanKeys, roomSettingsConfig } from "../room-settings-config/room-settings-config";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { RoomsAgent } from "../../api/rooms-agent";
import { GlobalContext } from "../../../../globals";
import { useNavigate } from "react-router-dom";
import { RoomSettingsProps } from ".";

import DeleteConfirmation from "../../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import UpgradeIcon from "../../../../components/upgrade-icon";

const { Option }    =   Select;

const RoomSettings = (props: RoomSettingsProps) => {

    const { roomId, roomSettings } =   props;

    const navigate          =   useNavigate();

    const { $dictionary, $featData } = useContext(GlobalContext);

    const [currentLanguage, setCurrentLanguage] = useState<string>(roomSettings.language);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({
        visibility: false,
    })

    const handleRoomProtection = (value: string) => {
        if(value) {
            RoomsAgent.updateRoom({
                variables: {
                    roomUuid    :   roomId,
                    input       :   {
                        isProtected : value === "anyone" ? false : true,
                    } 
                },
                onCompletion: () => {},
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language);
        RoomsAgent.updateRoom({
            variables: {
                roomUuid: roomId,
                input: {
                    language: language
                }
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleDiscoveryChange = (value: boolean) => {
        RoomsAgent.enableOrDisableDiscovery({
            variables: {
                roomUuid:   roomId,
                enable  :   value
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleUpdateProperty = (key: string, value: boolean) => {
        RoomsAgent.updateRoomProperty({
            variables: {
                roomUuid:   roomId,
                key     :   key,
                value   :   value
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const languageOptions:MenuProps['items'] = [
        { label: "en - English", key: "en", 
            "onClick"   :   (event: any) => {
                handleLanguageChange(event.key)
            }
        },
        { label: "fr - French", key: "fr", 
            "onClick"   :   (event: any) => {
                handleLanguageChange(event.key)
            }
        },
        { label: "de - German", key: 'de', 
            "onClick"   :   (event: any) => {
                handleLanguageChange(event.key)
            }
        },
        { label: "es - Spanish", key: "es", 
            "onClick"   :   (event: any) => {
                handleLanguageChange(event.key)
            }
        },
    ];

    const handleDeleteRoom = () => {
        RoomsAgent.deleteRoom({
            variables: {
                roomUuid: roomId
            },
            onCompletion: () => {
                setShowDeleteConfirmation({ visibility: false })
                CommonUtil.__showSuccess("Room deleted successfully")
                navigate("/rooms")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Room Settings</div>
            <Space direction='vertical' className='cm-flex-space-between cm-padding-block10 cm-padding-inline15'>
                <Space size={4}>
                    <div className="cm-line-height22 cm-font-fam500 cm-font-opacity-black-87">Who can access the room</div>
                    <Tooltip placement="right" title={"The room link will remain the same even if room sharing permissions are changed."}>
                        <div><MaterialSymbolsRounded font='info' size='16' className='cm-cursor-pointer'/></div>
                    </Tooltip>
                    {$featData?.password_protection?.isRestricted ? <UpgradeIcon/> : null}
                </Space>
                <Select
                    suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                    style               =   {{width: "100%"}}
                    optionLabelProp     =   "label"
                    defaultValue        =   {roomSettings.protection ? "protected" : "anyone"}
                    onChange            =   {handleRoomProtection}
                >
                    <Option
                        key     =   {"anyone"}
                        label   =   {
                            <Space className='cm-flex-align-center'>
                                <MaterialSymbolsRounded font="language" size='18'color='#000000a6'/>
                                Anyone with the link
                            </Space>
                        }
                    >
                        <div className="cm-flex-align-center" style={{height: "45px"}}>
                            <Space className='cm-flex-align-start'>
                                <MaterialSymbolsRounded font="language" size='20' color='#000000a6'/>
                                <Space direction='vertical' size={0}>
                                    Anyone with the link
                                    <div className='cm-font-size12 cm-font-opacity-black-65'>Anyone can enter the room without restriction</div>
                                </Space>
                            </Space>
                        </div>
                    </Option>
                    <Option
                        key     =   {"protected"}
                        disabled =  {$featData?.password_protection?.isRestricted}
                        label   =   {
                            <Space className={`cm-flex-align-center`}>
                                <MaterialSymbolsRounded font="lock" size='18' color='#000000a6'/>
                                Protected
                            </Space>
                        }
                    >
                        <div className="cm-flex-align-center" style={{height: "45px"}}>
                            <Space className='cm-flex-align-start'>
                                <MaterialSymbolsRounded font="lock" size='20' color='#000000a6'/>
                                <Space direction='vertical' size={0}>
                                    <div className={$featData?.password_protection?.isRestricted ? "cm-font-opacity-black-65" : "cm-dark-text"}>Protected</div>
                                    <div className='cm-font-size12 cm-font-opacity-black-65'>Only invited users can enter after verifying their email.</div>
                                </Space>
                            </Space>
                        </div>
                    </Option>
                </Select>
            </Space>
            {
                roomSettingsConfig.map((_setting: RoomSettingItem) => (
                    <div key={_setting.valueKey} className="cm-flex-space-between cm-padding-block10 cm-padding-inline15 cm-flex-align-center">
                        <Space direction="vertical" size={0}>
                            <div className="cm-line-height22 cm-font-fam500 cm-font-opacity-black-87">{_setting.label}</div>
                            <div className="cm-line-height22 cm-font-opacity-black-67 cm-font-size12">{_setting.description}</div>
                        </Space>
                        <Switch 
                            key             =   {_setting.valueKey} 
                            size            =   "small" 
                            defaultChecked  =   {roomSettings[_setting.valueKey  as RoomSettingsBooleanKeys]}
                            onChange        =   {(value) => {
                                _setting.valueKey === "discovery" ? handleDiscoveryChange(value) : handleUpdateProperty(_setting.serverKey!, value)
                            }}
                        />
                    </div>
                ))
            }
            <div key={"language"} className="cm-flex-space-between cm-padding-block10 cm-padding-inline15 cm-flex-align-center">
                <Space direction="vertical" size={0}>
                    <div className="cm-line-height22 cm-font-fam500 cm-font-opacity-black-87">Language</div>
                    <div className="cm-line-height22 cm-font-opacity-black-67 cm-font-size12">The buyer will view the portal in selected language</div>
                </Space>
                <Dropdown menu={{ items: languageOptions, selectedKeys: [currentLanguage]}} trigger={["click"]} placement="bottom" className="j-template-header-icon-wrapper cm-cursor-pointer">
                    <Space onClick={(event) => event.stopPropagation()} size={4}>
                        <MaterialSymbolsRounded font="language" size="22" />
                        {currentLanguage}
                    </Space>
                </Dropdown>
            </div>
            <div className="cm-flex-space-between cm-padding15 cm-flex-align-center" style={{borderTop: "1px solid #E8E8EC"}}>
                <Space direction="vertical" size={0}>
                    <div className="cm-line-height22 cm-font-fam500 cm-font-opacity-black-87">Delete Room</div>
                    <div style={{width: "350px"}} className="cm-font-opacity-black-67 cm-font-size12">Please be aware that any changes will be lost and cannot be recovered.</div>
                </Space>
                <Button danger ghost onClick={() => setShowDeleteConfirmation({visibility: true})}>Delete</Button>
            </div>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => { handleDeleteRoom() }}
                onCancel    =   {() => setShowDeleteConfirmation({ visibility: false })}
                header      =   {`Delete ${$dictionary.rooms.singularTitle}`}
                body        =   {`Are you sure you want to delete the ${$dictionary.rooms.singularTitle}?`}
                okText      =   'Delete'
            />
        </>
    )
}

export default RoomSettings