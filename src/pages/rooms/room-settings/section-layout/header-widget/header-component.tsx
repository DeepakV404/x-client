import { useEffect, useRef, useState } from 'react';
import { Button, message, Space, Upload } from 'antd';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES, ACCEPTED_THUMBNAIL_FILES, CAROUSEL_FALLBACK_IMAGE1, COMPANY_FALLBACK_ICON } from '../../../../../constants/module-constants';
import { CommonUtil } from '../../../../../utils/common-util';
import { RoomsAgent } from '../../../api/rooms-agent';

import MaterialSymbolsRounded from '../../../../../components/MaterialSymbolsRounded';

const HeaderComponent = (props: { component: any, widget: any }) => {

    const { component, widget }   =   props;

    const inputRef                          =   useRef<any>(null);

    const __headerPropertyMap               =   {...component.content};
    const __titlePropertyMap                =   {...component?.content?.title}

    const [headerAlignment, setHeaderAlignement]    =   useState<"left" | "middle" | "right">(__titlePropertyMap.alignment);

    useEffect(() => {
        setHeaderAlignement(__titlePropertyMap.alignment)
    }, [__titlePropertyMap.alignment])

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const currentText = inputRef.current?.textContent || '';
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef?.current?.blur();
        } else if (currentText.length >= 50 && e.key.length === 1) {
            e.preventDefault();
        }
    };

    const updateHeaderTitle = () => {
        if(!inputRef?.current?.innerText.trim()){
            message.warning("Title cannot be empty")
            inputRef?.current?.focus()
            return
        } 

        let updatedTitleAlignment = {...__titlePropertyMap};
        updatedTitleAlignment["value"] = inputRef?.current?.innerText;

        RoomsAgent.updateComponentByPropertyNoRefetch({
            variables: {
                componentUuid   :   component.uuid,
                widgetUuid      :   widget.uuid,
                propertyKey     :   "title",
                propertyContent :   updatedTitleAlignment
            },
            onCompletion: () => {},
            errorCallBack: () => {},
        });
    }

    const handlePrimaryLogoUpload = (file: any, onSuccess: any) => {
        const handleUpload = message.loading("Uploading ...", 0)
        RoomsAgent.updateHeaderComponent({
            variables: {
                widgetUuid: widget.uuid, 
                componentUuid: component.uuid, 
                primaryImage: file, 
            },
            onCompletion: () => {
                handleUpload()
                CommonUtil.__showSuccess("Uploaded successfully!")
                onSuccess()
            },
            errorCallBack: () => {

            }
        })
    }

    const handleSecondaryLogoUpload = (file: any, onSuccess: any) => {
        const handleUpload = message.loading("Uploading...", 0)
        RoomsAgent.updateHeaderComponent({
            variables: {
                widgetUuid: widget.uuid, 
                componentUuid: component.uuid, 
                secImage: file, 
            },
            onCompletion: () => {
                handleUpload()
                CommonUtil.__showSuccess("Uploaded successfully!")
                onSuccess()
            },
            errorCallBack: () => {

            }
        })
    }

    const handleCoverImageUpload = async(file: any, onSuccess: any) => {
        const handleUpload = message.loading("Uploading...", 0)
        RoomsAgent.updateHeaderComponent({
            variables: {
                widgetUuid: widget.uuid, 
                componentUuid: component.uuid, 
                coverImage: file, 
            },
            onCompletion: () => {
                handleUpload()
                CommonUtil.__showSuccess("Uploaded successfully!")
                onSuccess()
            },
            errorCallBack: () => {

            }
        })
    }

    const uploadButton = (
        <Space className="cm-flex-center cm-width100 cm-height100" direction="vertical" size={0}>
            <MaterialSymbolsRounded font="add" size="24" className="cm-light-text"/>
            <div className="cm-light-text">Upload</div>
        </Space>
    );

    return (
        <div className="cm-width100">
            <div className='cm-position-relative'>
                {
                    __headerPropertyMap?.coverImage?.enabled &&
                        <img src={__headerPropertyMap?.coverImage?.url ? __headerPropertyMap.coverImage.url : CAROUSEL_FALLBACK_IMAGE1} className="cm-border-radius6" alt="Cover Image" height={"175px"} width={"100%"} style={{objectFit: "cover"}}/>
                }
                <div className={`${__headerPropertyMap?.coverImage?.enabled ? "show-on-hover-icon cm-position-absolute" : "cm-position-absolute"}  cm-flex`} style={__headerPropertyMap?.coverImage?.enabled ? { top: "15px", right: "15px" } : {right: "100px", top: "-67px"}}>
                    {
                        __headerPropertyMap?.coverImage?.enabled &&
                            <>
                                <Upload 
                                    key             =   {"cover"}
                                    showUploadList  =   {false}
                                    accept          =   {ACCEPTED_THUMBNAIL_FILES}
                                    customRequest={({ file, onSuccess }) => {
                                        handleCoverImageUpload(file, onSuccess)
                                    }}
                                >
                                    <Button size="small" className="cm-margin-right10"><MaterialSymbolsRounded font='autorenew' size="16"/> {__headerPropertyMap?.coverImage?.url ? "Replace" : "Upload"}</Button>
                                </Upload>
                            </>
                    }
                </div>
            </div>
            <div className={`cm-flex cm-padding-inline10 ${__headerPropertyMap?.coverImage?.enabled ? "" : "cm-margin-top20"}`} style={{position: "relative", bottom: "35px", justifyContent: headerAlignment === "middle" ? "center" : headerAlignment === "right" ? "flex-end" : "flex-start"}}>
                {/* FIRST LOGO */}
                {
                    __headerPropertyMap?.primaryImage.enabled ? 
                        <div style={{height: "85px", width: "85px", borderRadius: "50%", position: "relative", background: "white", border: "2px solid #D9D9D9", overflow: "hidden", padding: "15px"}} className="cm-hover-upload-action hover-item">
                            <Upload
                                key             =   {"primaryFile"}
                                className       =   "j-logo-upload cm-width100 cm-height100 cm-flex-center cm-cursor-pointer"
                                name            =   "avatar"
                                showUploadList  =   {false}
                                accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                customRequest={({ file, onSuccess }) => {
                                    handlePrimaryLogoUpload(file, onSuccess)
                                }}
                            >
                                {
                                    __headerPropertyMap?.primaryImage.url
                                    ?
                                        <img src={__headerPropertyMap?.primaryImage?.url} alt={"Company Logo"} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/>
                                    :
                                        uploadButton
                                }
                                <div className="show-on-hover-icon cm-position-absolute cm-cursor-pointer" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                    <MaterialSymbolsRounded font="upload" color="white" size="30"/>
                                </div>
                            </Upload>
                        </div>
                    :
                        null
                }
                {/* FIRST LOGO */}
                {/* SECOND LOGO */}
                {
                    __headerPropertyMap?.secondaryImage.enabled ?
                        <div style={{height: "85px", width: "85px", borderRadius: "50%", background: "white", position: "relative", left: "-10px", border: "2px solid #D9D9D9",  overflow: "hidden", padding: "15px"}} className="cm-hover-upload-action hover-item">
                            <Upload
                                key             =   {"secondaryFile"}
                                className       =   "j-logo-upload cm-width100 cm-height100 cm-flex-center cm-cursor-pointer"
                                name            =   "avatar"
                                showUploadList  =   {false}
                                accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                                customRequest={({ file, onSuccess }) => {
                                    handleSecondaryLogoUpload(file, onSuccess)
                                }}
                            >
                                {
                                    __headerPropertyMap?.secondaryImage.url
                                    ?
                                        <img src={__headerPropertyMap?.secondaryImage.url} alt={"Company Logo"} className="j-setup-logo-home" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/>
                                    :
                                        uploadButton
                                }
                                <div className="show-on-hover-icon cm-position-absolute cm-cursor-pointer" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                                    <MaterialSymbolsRounded font="upload" color="white" size="30"/>
                                </div>
                            </Upload>
                        </div>
                    :
                        null
                }
                {/* SECOND LOGO */}
            </div>
            {
                __headerPropertyMap?.title.enabled ? 
                    <div
                        contentEditable                          
                        ref         =   {inputRef}
                        className   =   "cm-font-fam700 cm-font-size28 cm-hover-input-border-active cm-border-white cm-padding3 cm-border-radius6 cm-outline-none"
                        onBlur      =   {updateHeaderTitle}
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
                            border          :   "1px solid white",
                            maxWidth        :   "100%",
                            overflow        :   "hidden",
                            whiteSpace      :   "nowrap",
                            display         :   "block",
                            textAlign       :   headerAlignment === "middle" ? "center" : headerAlignment === "right" ? "right" : "left"
                        }}                       
                        dangerouslySetInnerHTML={{ __html: __titlePropertyMap?.value || "Enter any title" }}     
                    />
                :
                    null
            }
        </div>
    )
}

export default HeaderComponent