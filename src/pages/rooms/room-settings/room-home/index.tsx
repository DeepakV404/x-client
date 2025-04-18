import { useContext, useRef, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { LinkedinFilled } from '@ant-design/icons';
import { useOutletContext, useParams } from "react-router-dom";
import { Space, Upload, message, Button, Typography, Switch } from "antd";
import { debounce } from "lodash";

import { COMPANY_FALLBACK_ICON, ACCEPTED_PROFILE_IMAGE_FILE_TYPES, PREVIEW_USER_ICON, ACCEPTED_THUMBNAIL_FILES, NO_PITCH_VIDEO } from "../../../../constants/module-constants";
import { PermissionCheckers } from "../../../../config/role-permission";
import { FEATURE_ROOMS } from "../../../../config/role-permission-config";
import { AccountsAgent } from "../../../accounts/api/accounts-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { R_SECTIONS, ROOM } from "../../api/rooms-query";
import { GlobalContext } from "../../../../globals";
import { RoomsAgent } from "../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import RichTextEditor from "../../../../components/HTMLEditor/rt-editor";
import EditHomePitchSlider from "./room-edit-home-slider";
import RoomHomePitch from "./room-home-pitch";
import SectionTitle from "../section-title";

const { Text }      =   Typography;

const EditHome = () => {

    const { room }                  =   useOutletContext<any>()

    const params                    =   useParams();
    const { $orgDetail, $user }     =   useContext(GlobalContext);
    const $client                   =   useApolloClient();

    const RoomEditPermission        =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    const imageRef = useRef<HTMLImageElement>(null)

    const [fileList, setFileList]               =   useState([]);
    const [editWC, setEditWC]                   =   useState(false);
    const [loading, setLoading]                 =   useState(false);
    const [saved, setSaved]                     =   useState(false);
    const [headerAlignment, setHeaderAlignment] =   useState(room.properties.headerAlignment === "middle");

    const inputRef = useRef<any>(null);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const currentText = inputRef.current?.textContent || '';
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef?.current?.blur();
        } else if (currentText.length >= 50 && e.key.length === 1) {
            e.preventDefault();
        }
    };

    const updateSellerTitle = () => {
        if(!inputRef?.current?.innerText.trim()){
            message.warning("Title cannot be empty")
            inputRef?.current?.focus()
            return
        } 
        RoomsAgent.updateRoom({
            variables: {
                roomUuid:   room.uuid,
                input: {
                    sellerTitle: inputRef?.current?.innerText
                }
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const { data }  =   useQuery(R_SECTIONS, {
        variables: {
            roomUuid: params.roomId,
            filter  : {
                type : "WELCOME"
            }
        },
        fetchPolicy: "network-only"
    })

    const uploadButton = (
        <Space className="cm-flex-center cm-width100 cm-height100" direction="vertical" size={0}>
            <MaterialSymbolsRounded font="add" size="24" className="cm-light-text"/>
            <div className="cm-light-text">Upload</div>
        </Space>
    );

    const handleSellerLogoUpload = (file: any) => {
        const handleUpload = message.loading("Updating logo...", 0)
        AccountsAgent.updateSellerAccount({
            variables: {
                roomUuid: params.roomId,
                logo: file.file,
                input: {}
            },
            onCompletion: () => {
                handleUpload()
                setFileList([])
                CommonUtil.__showSuccess("Logo updated successfully")
            },
            errorCallBack: (error: any) => {
                handleUpload()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleCoverImageUpload = (file: any) => {
        const handleUpload = message.loading("Updating Cover Image...", 0)
        RoomsAgent.updateCoverImage({            
            variables: {
                roomUuid: room.uuid, 
                coverImage: file.file,
            },
            onCompletion: () => {
                setFileList([])
                handleUpload()
            },
            errorCallBack: (error: any) => {
                handleUpload()
                CommonUtil.__showError(
                    ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                );
            },
        });
    }

    const onRemoveCoverImage = () => {
        const handleRemove = message.loading("Removing Cover Image...", 0)
        RoomsAgent.removeCoverImage({            
            variables: {
                roomUuid: room.uuid, 
            },
            onCompletion: () => {
                if (imageRef.current) {
                    imageRef.current.classList.add('slide-out-top');
                }
                $client.refetchQueries({include: [ROOM]})
                handleRemove()
            },
            errorCallBack: (error: any) => {
                handleRemove()
                CommonUtil.__showError(
                    ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error
                );
            },
        });
    };

    const handlePOC = (value: boolean) => {
        const { properties } = room;
    
        const updatedProperties = {
            ...properties,
            isPOCEnabled: value,
        };
    
        const roomProperties = {
            properties: updatedProperties
        };
        RoomsAgent.updateRoom({
            variables: {
                roomUuid        :   params.roomId,
                sectionUuid     :   data._rSections[0].uuid,
                input           :   roomProperties
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    const handleContentChangeChange = (debounce((value: string) => {
        setLoading(true)
        RoomsAgent.updateRoom({
            variables: {
                roomUuid:   room.uuid,
                input : {
                    welcomeContent: value
                }
            },
            onCompletion: () => {
                setLoading(false)
                setSaved(true)
                setTimeout(() => {
                    setSaved(false)
                }, 2000)
            },
            errorCallBack: () => {
                setLoading(false)
                setSaved(false)
            }
        })
    }, 1500));

    const handleTextAlignment = (value: boolean) => {


        setHeaderAlignment(value)
                
        let roomProperties = {
            ...room.properties
        };

        roomProperties["headerAlignment"] = value ? "middle" : "left"

        RoomsAgent.updateRoomTitleAlignment({
            variables: {
                roomUuid        :   params.roomId,
                sectionUuid     :   data._rSections[0].uuid,
                input           :   {
                    properties: roomProperties
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }


    return (
        <>
            <div className='cm-height100 cm-overflow-auto cm-padding-inline15'>
                <div className="cm-margin-top15">
                    <SectionTitle sectionId={data?._rSections[0].uuid} section={data?._rSections[0]} entityData={room} kind={"room"}/>
                </div>
                <Space direction='vertical' className='cm-width100 j-room-setup-body-home cm-padding15' size={20}>
                    <Space className="j-buyer-banner-wrap cm-flex-center cm-margin-bottom20 cm-width100 cm-space-inherit" direction="vertical" >
                        {
                            <div className="cm-position-relative" style={{minHeight: "50px"}}>
                                <div style={{overflow: "hidden"}}>
                                    {room?.properties.coverImageUrl && <img ref={imageRef} src={room?.properties.coverImageUrl} className="cm-border-radius6" alt="Cover Photo" height={"200px"} width={"100%"} style={{objectFit: "cover"}}/>}
                                </div>
                                <div className={headerAlignment ? "cm-flex-justify-center" : "cm-flex"} style={room.properties.coverImageUrl ? {position: "relative", bottom: "45px", paddingLeft: headerAlignment ? "0px" : "50px"} : {paddingLeft: headerAlignment ? "0px" : "10px"}}>
                                    <div style={{height: "85px", width: "85px", borderRadius: "50%", background: "white", border: "2px solid #D9D9D9", overflow: "hidden", padding: "15px"}} className="cm-cursor-disabled">
                                        <img src={room?.buyerAccount.logoUrl} alt="update_logo" className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/>
                                    </div>
                                    <div style={{height: "85px", width: "85px", borderRadius: "50%", background: "white", position: "relative", left: "-10px", border: "2px solid #D9D9D9",  overflow: "hidden", padding: "15px"}} className="cm-hover-upload-action hover-item">
                                        <Upload
                                            className       =   "j-logo-upload cm-width100 cm-height100 cm-flex-center cm-cursor-pointer"
                                            name            =   "avatar"
                                            showUploadList  =   {false}
                                            onChange        =   {handleSellerLogoUpload}
                                            accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                            fileList        =   {fileList}
                                        >
                                            {
                                                room?.sellerAccount.logoUrl
                                                ?
                                                    <img src={room?.sellerAccount.logoUrl} alt={$orgDetail.companyName} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/>
                                                :
                                                    uploadButton
                                            }
                                            <div className="show-on-hover-icon cm-position-absolute cm-cursor-pointer" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                                <MaterialSymbolsRounded font="upload" color="white" size="30"/>
                                            </div>
                                        </Upload>
                                    </div>
                                </div>
                                {room?.properties.coverImageUrl 
                                    ? 
                                        <div className="show-on-hover-icon cm-position-absolute cm-flex" style={{ top: "15px", right: "15px" }}>
                                            <Button size="small" className="cm-margin-right10">Align Center<Switch size="small" onChange={handleTextAlignment} checked={headerAlignment}/></Button>
                                            <Upload 
                                                showUploadList  =   {false}
                                                onChange        =   {handleCoverImageUpload}
                                                accept          =   {ACCEPTED_THUMBNAIL_FILES}
                                                fileList        =   {fileList}
                                            >
                                                <Button size="small" className="cm-margin-right10"><MaterialSymbolsRounded font='autorenew' size="16"/> Replace</Button>
                                            </Upload>
                                            <Button size="small" onClick={onRemoveCoverImage}><MaterialSymbolsRounded font='add_photo_alternate' size="16"/>Remove</Button>
                                        </div> 
                                    :
                                        <div className="cm-position-absolute cm-flex" style={{ top: "15px", right: "15px" }}>
                                            <Button size="small" className="cm-margin-right10">Align Center<Switch size="small" onChange={handleTextAlignment} checked={headerAlignment}/></Button>
                                            <Upload 
                                                showUploadList  =   {false}
                                                onChange        =   {handleCoverImageUpload}
                                                accept          =   {ACCEPTED_THUMBNAIL_FILES}
                                                fileList        =   {fileList}
                                            >
                                                <Button size="small"><MaterialSymbolsRounded font='upload' size="16"/> Upload</Button>
                                            </Upload>
                                        </div>
                                }
                                <Space className={headerAlignment ? "cm-flex-center" : "cm-flex-align-center"} style={{marginTop: room.properties.coverImageUrl ? "-20px" : "15px", paddingLeft: headerAlignment ? "0px" : "20px"}} size={0}>
                                    <div className="cm-font-fam700 cm-font-size28 cm-cursor-disabled">
                                        {room?.buyerAccount?.companyName} &harr;
                                    </div>
                                    <div
                                        contentEditable                          
                                        ref         =   {inputRef}
                                        className   =   "cm-font-fam700 cm-font-size28 cm-hover-input-border-active cm-border-white cm-padding3 cm-border-radius6 cm-outline-none"
                                        onBlur      =   {updateSellerTitle}
                                        onKeyDown   =   {handleKeyPress}
                                        onFocus     =   {() => {
                                            const range         =   document.createRange();
                                            const selection     =   window.getSelection();
                                            range.selectNodeContents(inputRef?.current); 
                                            range.collapse(false); 
                                            selection?.removeAllRanges(); 
                                            selection?.addRange(range); 
                                        }}                                
                                        style       =   {{
                                            border: "1px solid white",
                                            maxWidth: "750px",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            display: "block"
                                        }}                            
                                        dangerouslySetInnerHTML={{ __html: room?.sellerAccount?.title || "" }}
                                    />
                                    &nbsp; &nbsp;
                                </Space>
                            </div>
                        }
                        <div style={{whiteSpace: "nowrap"}}>
                            <div className="j-section-widget-text-rte cm-margin-top20 cm-position-relative">
                                <RichTextEditor loading={loading} saved={saved} showSave={true} onChange={handleContentChangeChange} value={room?.welcomeContent && room?.welcomeContent || `<p></p>`}/>
                            </div>
                        </div>
                    </Space>
                </Space>
                <div className="cm-flex-center cm-margin-bottom15 cm-position-relative" style={{minHeight: room.pitchVideo ? "" : "calc(100% - 140px)", backgroundColor: "#fff", marginTop: "15px",borderRadius: "6px"}}>
                    {room.pitchVideo 
                    ? 
                        <RoomHomePitch pitchVideo={room.pitchVideo} setEditWC={setEditWC}/> 
                    : 
                        RoomEditPermission &&
                            <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-height100 cm-overflow-auto">
                                <img src={NO_PITCH_VIDEO} alt="No next steps found" className="cm-margin-bottom15" width={160}/>
                                <div className="cm-font-size18 cm-font-fam500">Add Product Pitch</div>
                                <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                    Share your product's story with videos, docs, or presentations.
                                </div>
                                {
                                    RoomEditPermission &&
                                        <Button className="cm-flex-center cm-margin-top15" type="primary" onClick={() => setEditWC(true)} style={{marginLeft: "9px"}}>
                                            Upload
                                        </Button>
                                }
                            </Space>
                    }
                </div>
                {
                    room?.owner && 
                        <div className="cm-position-relative cm-background-white cm-padding20 cm-flex-center cm-flex-direction-column cm-gap20 cm-border-radius6 cm-margin-bottom15" style={{height: "350px"}}>
                            <Space className="cm-position-absolute" style={{top: "25px", right: "15px"}}>
                                <Text>Show to Buyer</Text>
                                <Switch size="small" onChange={handlePOC} defaultChecked={room.properties.isPOCEnabled}/>
                            </Space>
                            <div className="cm-font-size24 cm-font-fam500 cm-text-align-center">
                                Point of Contact
                            </div>
                            <div className="j-buyer-team-card">
                                <div className="j-buyer-team-profile">
                                    <img className="j-buyer-team-img" width={"100%"} height={"100%"} src={room.owner.profileUrl ? room.owner.profileUrl : PREVIEW_USER_ICON} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src = PREVIEW_USER_ICON; currentTarget.title = "Update your profile image"}}/>
                                </div>
                                <Space direction="vertical" className="cm-padding15 cm-flex cm-flex-space-between" style={{width: "calc(100% - 160px)"}}>
                                    <Space direction="vertical" className="cm-width100" size={10}>
                                        <Text ellipsis={{tooltip: CommonUtil.__getFullName(room.owner.firstName, room.owner.lastName)}} className="cm-font-fam600 cm-font-size18 j-team-profile-name">{CommonUtil.__getFullName(room.owner.firstName, room.owner.lastName)}</Text>
                                        <Text ellipsis={{tooltip: room.owner.emailId}} className="cm-secondary-text j-team-profile-name">{room.owner.emailId}</Text>
                                    </Space>
                                    <Space className="cm-flex cm-flex-space-between">
                                        <Button  type="primary" ghost size="large"  onClick={() => window.open(`${room.owner.calendarUrl}`, "_blank")} className="cm-font-size14" disabled={!room.owner.calendarUrl}>
                                            Book Meeting
                                        </Button>
                                        <LinkedinFilled className={room.owner.linkedInUrl ? 'cm-cursor-pointer' : "cm-cursor-disabled"} style={{color: room.owner.linkedInUrl ? "#006097" : "#E8E8EC", fontSize: "27px", borderRadius: "6px"}} onClick={(event) => {event.stopPropagation(); room.owner.linkedInUrl && window.open(room.owner.linkedInUrl, "_blank")}} /> 
                                    </Space>
                                </Space>
                            </div>
                        </div>
                }
            </div>
            <EditHomePitchSlider isOpen={editWC} onClose={() => setEditWC(false)} room={room}/>
        </>
    )
}

export default EditHome