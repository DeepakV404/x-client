import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Popconfirm, Space, Typography } from "antd";

import { ACCEPTED_IMAGE_FILES, THUMBNAIL_FALLBACK_ICON } from "../../../constants/module-constants";
import { useBuyerResourceViewer } from "../../../custom-hooks/resource-viewer-hook";
import { CommonUtil } from "../../../utils/common-util";
import { SettingsAgent } from "../api/settings-agent";
import { MP_RESOURCES } from "../api/settings-query";

import SellerResourceViewerModal from "../../resource-viewer/seller-resource-viewer-modal";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import LibraryModal from "../../rooms/library/library-modal/library-modal";
import ResourceDrawer from "./resource-drawer";
import Loading from "../../../utils/loading";
import { GlobalContext } from "../../../globals";

const { Text }  =   Typography;

const Screenshots = (props: {isHomePage?: boolean}) => {

    const { isHomePage }    =   props;

    const { $dictionary }   =   useContext(GlobalContext);

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const [showResourceDrawer, setShowResourceDrawer]   =   useState(false);
    const [showLibrary, setShowLibrary]                 =   useState<boolean>(false);
    const [uploadType, setUploadType]                   =   useState('link');

    const { data, loading }      =   useQuery(MP_RESOURCES, {
        fetchPolicy: "network-only"
    });

    const handleOpenDrawer = (type: any) => {
        setUploadType(type);
        setShowResourceDrawer(true);
    };

    const handleResourceSubmit = (resource: any) => {
        if (uploadType === 'link') {
            SettingsAgent.mpAddResources({
                variables: {
                    resourceInput: {
                        link: resource.link
                    },
                },
                onCompletion: () => {},
                errorCallBack: () => {}
            })
        } else {
            resource.map((_resource: any) => (
                SettingsAgent.mpAddResources({
                    variables: {
                        content:_resource.originFileObj
                    },
                    onCompletion: () => {},
                    errorCallBack: () => {}
                })
            ))
        }
    };

    const handleAddResource = (resources: any) => {
        setShowLibrary(false)
        SettingsAgent.mpAddResources({
            variables: {
                resourceInput: {
                    uuids: resources.map((_resource: any) => _resource.uuid)
                },
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    const handleRemoveResource = (_resourceUuid: any) => {
        SettingsAgent.mpRemoveResource({
            variables: {
                resourceUuid   :   _resourceUuid
            },
            onCompletion: () => {},
            errorCallBack: () => {}
        })
    }

    const overviewResourceCard = (resource: any) => {
        return (
            <div onClick={() => handleResourceOnClick(resource)} className={`cm-flex cm-flex-align-center cm-cursor-pointer cm-width100 cm-border-radius6 cm-padding10 cm-margin-top15 ${isHomePage ? "cm-background-white" : ""}`} style={{border: "1px solid #f2f2f2", columnGap: "10px"}}>
                <div style={{width: "106px", height: "60px"}}>
                    <img src={resource.content.thumbnailUrl ? resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(resource.content.type)} style={{width: "100%", height: "100%", borderRadius: "6px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= THUMBNAIL_FALLBACK_ICON}}/>
                </div>
                <div style={{width: "calc(100% - 150px)"}}>
                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: resource.title}} className='cm-font-size15 cm-font-fam500'>{resource.title}</Text>
                </div>
                <Popconfirm
                    placement           =   "left"  
                    title               =   {<div className="cm-font-fam500">Remove Screenshot!</div>}
                    description         =   {<div className="cm-font-size13">Are you sure you want to remove this screenshot?</div>}
                    icon                =   {null}
                    okButtonProps       =   {{style: {fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0", lineHeight: "20px"}, danger: true}}
                    cancelButtonProps   =   {{style: {fontSize: "12px", lineHeight: "20px"}, danger: true, ghost: true}}
                    okText              =   {"Remove"}
                    onConfirm           =   {(event: any) => {event.stopPropagation(); handleRemoveResource(resource.uuid);}}
                    onCancel            =   {(event: any) => event?.stopPropagation()}
                >
                    <MaterialSymbolsRounded font={'delete'} size={'18'} color="#DF2222" className='cm-cursor-pointer' onClick={(event: any) => event?.stopPropagation()}/>
                </Popconfirm>
            </div>
        )
    }

    if(loading) return <div style={{height: isHomePage ? "100%" : "calc(100vh - 148px)"}}><Loading/></div>
    
    return(
        <>
            <div className={`cm-flex-align-center cm-flex-direction-column cm-overflow-auto ${isHomePage ? "cm-height100" : ""} ${data?._mpResources.length ? "" : "cm-flex-center"}`} style={!isHomePage ? {height: "calc(100vh - 148px)", paddingInline: "20%", paddingBlock: "20px"} : {paddingInline: "20%"}}>
                {
                    isHomePage && <div className="cm-font-fam500 cm-flex-justify-center cm-margin-bottom10 cm-font-size15 cm-margin-top20">Product Screens</div>
                }
                <Space className="j-marketplace-res-card cm-flex-center" size={20}>
                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => handleOpenDrawer('link')}>
                        <Space direction="vertical" className="cm-flex-center">
                            <MaterialSymbolsRounded font="link"/>
                            <div>Paste Url</div>
                        </Space>
                    </div>
                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => setShowLibrary(true)}>
                        <Space direction="vertical" className="cm-flex-center">
                            <MaterialSymbolsRounded font="home_storage"/>
                            <div>from {$dictionary.library.title}</div>
                        </Space>
                    </div>
                    <div className="j-marketplace-res-upload-card cm-flex-center" onClick={() => handleOpenDrawer('blob')}>
                        <Space direction="vertical" className="cm-flex-center">
                            <MaterialSymbolsRounded font="upload"/>
                            <div>from Device</div>
                        </Space>
                    </div>
                </Space>
                <div className="cm-margin-top20 cm-width100">
                    {
                        data?._mpResources.map((_res: any) => overviewResourceCard(_res))
                    }
                </div>
            </div>
            <LibraryModal
                isOpen                  =   {showLibrary}
                onClose                 =   {() => setShowLibrary(false)}
                initialFilter           =   {[]}
                getSelectedResourceId   =   {(resources: any) => handleAddResource(resources)}
                multipleResource        =   {true}
            />
            <ResourceDrawer
                isOpen      =   {showResourceDrawer}
                onClose     =   {() => setShowResourceDrawer(false)}
                uploadType  =   {uploadType}
                onSubmit    =   {handleResourceSubmit}
                maxCount    =   {5}
                fileType    =   {ACCEPTED_IMAGE_FILES}
            />
            <SellerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
                track           =   {false}
            />
        </>
    )
}

export default Screenshots