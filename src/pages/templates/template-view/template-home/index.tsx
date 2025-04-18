import { useApolloClient } from "@apollo/client";
import { useContext, useRef, useState } from "react";
import { Space, Upload, message, Button, Switch } from "antd";
import { debounce } from 'lodash';

import { COMPANY_FALLBACK_ICON, ACCEPTED_PROFILE_IMAGE_FILE_TYPES, ACCEPTED_THUMBNAIL_FILES, ACME_FALLBACK_ICON, NO_PITCH_VIDEO } from "../../../../constants/module-constants";
import { PermissionCheckers } from "../../../../config/role-permission";
import { FEATURE_TEMPLATES } from "../../../../config/role-permission-config";
import { TEMPLATE_HOME_CONTENT_ADDED } from "../../../../tracker-constants";
import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { ROOM_TEMPLATE } from "../../api/room-templates-query";
import { CommonUtil } from "../../../../utils/common-util";
import { GlobalContext } from "../../../../globals";
import { AppTracker } from "../../../../app-tracker";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import RichTextEditor from "../../../../components/HTMLEditor/rt-editor";
import TemplateEditHomeSlider from "./template-edit-home-slider";
import SellerResourceViewLayout from "../../../resource-viewer";
import SectionTitle from "../../../rooms/room-settings/section-title";

const EditHome = (props: { roomTemplate : any, id: string, setCurrentView: any, sectionData: any, section: any }) => {

    const { roomTemplate, setCurrentView, sectionData, id, section }    =    props;

    const { $user, $orgDetail }     =   useContext(GlobalContext);
    const $client                   =   useApolloClient();

    const TemplateEditPermission    =   PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update');

    const viewerRef: any = useRef()

    const imageRef = useRef<HTMLImageElement>(null)

    const [fileList, setFileList]               =   useState([]);
    const [editWC, setEditWC]                   =   useState(false);
    const [loading, setLoading]                 =   useState(false);
    const [saved, setSaved]                     =   useState(false);
    const [headerAlignment, setHeaderAlignment] =   useState(roomTemplate.properties.headerAlignment === "middle");

    const inputRef = useRef<any>(null);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const currentText = inputRef.current?.textContent || '';
        if (e.key === 'Enter') {
            e.preventDefault(); 
            inputRef?.current?.blur()
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
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid:   roomTemplate.uuid,
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

    const onRemoveCoverImage = () => {
        const handleRemove = message.loading("Removing Cover Image...", 0)
        RoomTemplateAgent.removeCoverImage({            
            variables: {
                templateUuid: roomTemplate.uuid, 
            },
            onCompletion: () => {
                if (imageRef.current) {
                    imageRef.current.classList.add('slide-out-top');
                }
                $client.refetchQueries({include: [ROOM_TEMPLATE]})
                handleRemove()
            }, 
            errorCallBack: (error: any) => {
                handleRemove()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        });
    };

    const uploadButton = (
        <Space className="cm-flex-center cm-width100 cm-height100" direction="vertical" size={0}>
            <MaterialSymbolsRounded font="add" size="24" className="cm-light-text"/>
            <div className="cm-light-text">Upload</div>
        </Space>
    );

    const handleSellerLogoUpload = (file: any) => {
        const handleUpload = message.loading("Updating logo...", 0)
        RoomTemplateAgent.updateRoomTemplateSellerAccount({
            variables: {
                templateUuid: roomTemplate.uuid,
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
        RoomTemplateAgent.updateCoverImage({            
            variables: {
                templateUuid: roomTemplate.uuid, 
                coverImage: file.file,
            },
            onCompletion: () => {
                setFileList([])
                AppTracker.trackEvent(TEMPLATE_HOME_CONTENT_ADDED, {});
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

    const handleContentChangeChange = (debounce((value: string) => {
        setLoading(true)
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid:   roomTemplate.uuid,
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
    }, 1500))

    const handleTextAlignment = (value: boolean) => {

        setHeaderAlignment(value)
        
        let templateProperties = {
            ...roomTemplate.properties
        };

        templateProperties["headerAlignment"] = value ? "middle" : "left"

        RoomTemplateAgent.updateRoomTemplateTitleAlignment({
            variables: {
                templateUuid    :   roomTemplate.uuid, 
                input           :   {
                    properties: templateProperties
                }
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    return (
        <>
            <div className='cm-height100 cm-padding15 cm-background-gray cm-overflow-auto'>
                <SectionTitle sectionId={id} section={section} entityData={roomTemplate} setCurrentView={setCurrentView} kind={"template"} sectionData={sectionData}/>
                <Space direction='vertical' className='cm-width100 j-room-setup-body-home cm-padding15 cm-margin-bottom15' size={20}>
                    <Space className="j-buyer-banner-wrap cm-flex-center cm-margin-bottom20 cm-width100 cm-space-inherit" direction="vertical" >
                        {
                            <div className="cm-position-relative" style={{minHeight: "50px"}}>
                                <div style={{overflow: "hidden"}}>
                                    {roomTemplate?.properties.coverImageUrl && <img ref={imageRef} src={roomTemplate?.properties.coverImageUrl} className="cm-border-radius6 slide-in-top" alt="Cover Photo" height={"200px"} width={"100%"} style={{objectFit: "cover"}}/>}
                                </div>
                                <div className={headerAlignment ? "cm-flex-justify-center" : "cm-flex"} style={roomTemplate.properties.coverImageUrl ? {position: "relative", bottom: "45px", paddingLeft: headerAlignment ? "0px" : "50px"} : {paddingLeft: headerAlignment ? "0px" : "10px"}}>
                                    <div style={{height: "85px", width: "85px", borderRadius: "50%", background: "white", border: "2px solid #D9D9D9", overflow: "hidden"}}>
                                        <img src={ACME_FALLBACK_ICON} alt="update_logo" className="j-setup-logo-home cm-cursor-disabled" style={{borderRadius: "0px !important"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON}}/>
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
                                                    roomTemplate?.sellerAccount.logoUrl
                                                    ?
                                                        <img src={roomTemplate?.sellerAccount.logoUrl} alt={$orgDetail.companyName} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/>
                                                    :
                                                        uploadButton
                                                }
                                                <div className="show-on-hover-icon cm-position-absolute cm-cursor-pointer" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                                    <MaterialSymbolsRounded font="upload" color="white" size="30"/>
                                                </div>
                                        </Upload>
                                    </div>
                                </div>
                                {roomTemplate.properties.coverImageUrl 
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
                                <Space className={headerAlignment ? "cm-flex-center" : "cm-flex-align-center"} style={{marginTop: roomTemplate.properties.coverImageUrl ? "-20px" : "15px", paddingLeft: headerAlignment ? "0px" : "20px"}} size={0}>
                                    <div className="cm-font-fam700 cm-font-size28 cm-cursor-disabled">
                                        Acme &harr;
                                    </div>
                                    <div
                                        contentEditable                          
                                        ref             =   {inputRef}
                                        className       =   "cm-font-fam700 cm-font-size28 cm-hover-input-border-active cm-border-white cm-padding3 cm-border-radius6 cm-outline-none"
                                        onBlur          =   {updateSellerTitle}
                                        onKeyDown       =   {handleKeyPress}
                                        onFocus         =   {() => {
                                            const range     =   document.createRange();
                                            const selection =   window.getSelection();
                                            range.selectNodeContents(inputRef?.current); 
                                            range.collapse(false); 
                                            selection?.removeAllRanges(); 
                                            selection?.addRange(range); 
                                        }}                                
                                        style           =   {{
                                            border: "1px solid white", 
                                            maxWidth: "750px",
                                            overflow: "hidden",         
                                            whiteSpace: "nowrap",       
                                            display: "block" 
                                        }}                            
                                        dangerouslySetInnerHTML =   {{ __html: roomTemplate?.sellerAccount?.title || "" }}
                                    />
                                </Space>
                            </div>
                        }
                        <div style={{whiteSpace: "nowrap"}}>
                            <div className="j-section-widget-text-rte cm-margin-top20 cm-position-relative">
                                <RichTextEditor loading={loading} saved={saved} showSave={true} onChange={handleContentChangeChange} value={roomTemplate?.welcomeContent && roomTemplate?.welcomeContent || `<p></p>`}/>
                            </div>
                        </div>
                    </Space>
                </Space>
                {
                    roomTemplate.pitchVideo?.content ?
                        <Space direction="vertical" className="cm-padding20 cm-border-radius6 cm-background-white cm-width100" style={{minHeight: "calc(100% - 270px)"}}>
                            {roomTemplate.pitchVideo?.content && <Space className="cm-flex-space-between cm-flex-align-center">
                                <Space>
                                    <MaterialSymbolsRounded font="slideshow" size="22"/>
                                    <div className="cm-font-size16">Pitch</div>
                                </Space>
                                <Button onClick={() => setEditWC(true)}>Edit</Button>
                            </Space>}
                            <div className="cm-width100" style={{paddingTop: "5px"}}>
                                <SellerResourceViewLayout
                                    resourceViewRef =   {viewerRef}
                                    fileInfo        =   {roomTemplate?.pitchVideo}
                                    track           =   {false}
                                />
                            </div>
                        </Space>
                    :
                        <div style={{minHeight: "calc(100% - 270px)"}} className="cm-padding20 cm-border-radius6 cm-background-white cm-width100 cm-flex-center">
                            <Space direction="vertical" className="cm-width100 cm-flex-center cm-flex-direction-column cm-padding15 cm-height100 cm-overflow-auto">
                                <img src={NO_PITCH_VIDEO} alt="No next steps found" className="cm-margin-bottom15" width={160}/>
                                <div className="cm-font-size18 cm-font-fam500">Add a product pitch</div>
                                <div style={{width: "500px", lineHeight: "22px"}}  className="cm-font-opacity-black-67 cm-text-align-center ">
                                    Upload a pitch to showcase your product from decks to demos.
                                </div>
                                {
                                    TemplateEditPermission &&
                                        <Button className="cm-flex-center cm-margin-top15" type="primary" onClick={() => setEditWC(true)} style={{marginLeft: "9px"}}>
                                            Add Pitch Content
                                        </Button>
                                }
                            </Space>
                        </div>
                }
            </div>
            <TemplateEditHomeSlider isOpen={editWC} onClose={() => setEditWC(false)} roomTemplate={roomTemplate}/>
        </>
    )
}

export default EditHome