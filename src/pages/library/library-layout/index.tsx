import { useContext, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Col, Input, Menu, Row, Space, Tooltip, Typography } from "antd"

import { GlobalContext } from "../../../globals";
import { LibraryAgent } from "../api/library-agent";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";
import { checkPermission } from "../../../config/role-permission";
import { Length_Input } from "../../../constants/module-constants";
import { FEATURE_LIBRARY } from "../../../config/role-permission-config";

import DeleteConfirmation from "../../../components/confirmation/delete-confirmation";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import NewFolderModal from "./new-folder-modal";
import ResourceSlider from "./resource-slider";
import FolderTree from "./folder-tree";

const { Text }  =   Typography;

export function useLibraryContext() {
    return useOutletContext<any>();
}

interface DeleteConfirmationState {
    visibility: boolean;
    folderUuid?: string;
}

const LibraryLayout = () => {
    
    const { folderId }      =   useParams();
    const navigate          =   useNavigate();
    
    const { $user, $dictionary }    =   useContext(GlobalContext);
    
    const [ isResourceOpen, setIsResourceOpen ]   =    useState(false);
    
    const [ search, setSearch ]                     =   useState<string>("");
    const [folderNameIs, setFolderNameIs]           =   useState<string>();
    const [ isModalOpen, setIsModalOpen ]           =   useState<any>({
        visibility      :   false,
        parentFolder    :   ""
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<DeleteConfirmationState>({
        visibility: false,
        folderUuid: "",
    });

    const hasCreatePermission                       =   checkPermission($user.role, FEATURE_LIBRARY, 'create');

    const handleDeleteFolder = (folderUuid: any) => {
        LibraryAgent.deleteFolder({
            variables: {
                folderUuid: folderUuid,
            },
            onCompletion: () => {
                setShowDeleteConfirmation({visibility: false})
                CommonUtil.__showSuccess("Folder deleted successfully")
                navigate("/library/home")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getFolderName = (folderName?: string) => {                
        setFolderNameIs(folderName)
    }

    return(
        <>
            <Row className="cm-height100">
                <Col flex="228px" className="cm-height100 j-lib-sider-wrapper cm-overflow-auto">
                    <div className="cm-font-size16 cm-font-fam500 cm-margin-bottom10">{$dictionary.library.title}</div>
                    <Menu className={`j-library-nav-menu cm-width100`} onClick={(event: any) => navigate(`/library/${event.key}`)}>
                        <Menu.Item className={`j-library-nav-item ${folderId === "all-resources" ? "active" : ""}`} key={"all-resources"}>
                            <Space className="cm-flex-align-center">
                                <MaterialSymbolsRounded font="perm_media" size="20"/>
                                <div className="cm-font-fam500 cm-font-fam18">All Resources</div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item className={`j-library-nav-item ${folderId === "home" ? "active" : ""}`} key={"home"}>
                            <Space className="cm-flex-align-center">
                                <MaterialSymbolsRounded font="home" size="20"/>
                                <div className="cm-font-fam500 cm-font-fam18">Home</div>
                            </Space>
                        </Menu.Item>
                        {/* <Menu.Item className={`j-library-nav-item ${pathName === "links" ? "active" : ""}`} key={"links"}>
                            <Space className="cm-flex-align-center">
                                <MaterialSymbolsRounded font="link" size="20"/>
                                <div className="cm-font-fam500 cm-font-fam18">Links</div>
                            </Space>
                        </Menu.Item> */}
                        <div className="cm-font-fam500 cm-flex-space-between-center cm-secondary-text">
                            <div className="cm-padding-block20">Folders</div>
                            {
                                hasCreatePermission && 
                                    <Tooltip placement="top" title={"Create New Folder"} trigger={'hover'}>
                                        <Button type="link" style={{padding:"0px"}} onClick={() => setIsModalOpen({visibility: true, parentFolder: undefined})}>
                                            <MaterialSymbolsRounded font="add_circle"  className="cm-secondary-text" size="20"/>
                                        </Button>
                                    </Tooltip>
                            }
                        </div>

                        <FolderTree />
                
                        {/* { 
                            data && data.folders.length > 0 ?
                                (
                                    data.folders.map((_folder: any) => (
                                        <Menu.Item className={`j-library-nav-item ${folderId === _folder.uuid ? "active" : ""}`} key={_folder.uuid}>
                                            <div className="cm-flex-space-between cm-cursor-pointer cm-flex-align-center">
                                                <Space>
                                                    <MaterialSymbolsRounded font="folder" filled size="20" className="cm-secondary-text"/>
                                                    <Text style={{maxWidth: "150px", verticalAlign: "middle"}} ellipsis={{tooltip: {title: _folder.title, placement: "right"}}}>{_folder.title}</Text>
                                                </Space>
                                            </div>
                                        </Menu.Item>
                                    ))
                                )
                            :
                                null
                        } */}
                        {/* <Button type="primary" ghost className="cm-border-none cm-margin-top10 cm-flex-align-center" onClick={() => setIsModalOpen({visibility: true, parentFolder: undefined})}>
                            <Space>
                                <MaterialSymbolsRounded font="add"/>
                                <div className="cm-font-fam500">New Folder</div>
                            </Space>
                        </Button> */}
                    </Menu>
                </Col>
                <Col flex="auto" style={{maxWidth: "calc(100% - 228px)"}} className="cm-padding0 cm-height100 j-res-list-col">
                    <div className="j-lib-header cm-flex-space-between cm-flex-align-center cm-padding-inline15">
                        <Text ellipsis={{tooltip: {title: folderNameIs, placement: "bottom"}}} className="cm-font-fam500 cm-font-size16">{folderId === "home" ? "Home" : ( folderId === "all-resources" ? "All Resources" : folderNameIs)}</Text>
                        <Space className="cm-flex-justify-center">
                            <Input allowClear autoFocus maxLength={Length_Input} placeholder={`${folderId === "home" ? "Search in Home" : folderId === "all-resources" ? "Search in All Resources" : `${"Search in " + folderNameIs}` || "Search"}`} className="j-library-search" suffix={<MaterialSymbolsRounded font="search" size="18"/>} onChange={(e) => setSearch(e.target.value)}/>
                            {
                                hasCreatePermission && 
                                    (
                                        <>
                                            <Button type="primary" className="j-add-resource cm-flex-center cm-margin-bottom0" icon={<MaterialSymbolsRounded font="home_storage" size="20" weight="400"/>} onClick={() => setIsResourceOpen(true)}>
                                                <div className="cm-font-size14">Add Resource</div>
                                            </Button>
                                            <Button type="primary" className="j-add-resource cm-flex-center cm-margin-bottom0 cm-icon-button" icon={<MaterialSymbolsRounded font="add" size="20" weight="400"/>} onClick={() => setIsModalOpen({visibility: true, parentFolder: folderId})}>
                                                <div className="cm-font-size14">New Folder</div>
                                            </Button>
                                        </>
                                    )
                            }
                        </Space>
                    </div>
                    <div className="j-library-body cm-padding15">
                        <Outlet context={{"search" : search, "getFolderName" : getFolderName, "setIsResourceOpen" : setIsResourceOpen, "setIsModalOpen" : setIsModalOpen}}/>
                    </div>
                </Col>
            </Row>
            <ResourceSlider isOpen={isResourceOpen} onClose={() => setIsResourceOpen(false)}/>
            <NewFolderModal isOpen={isModalOpen.visibility} onClose={() => setIsModalOpen(false)} parentFolderId={isModalOpen.parentFolder}/>
            <DeleteConfirmation
                isOpen      =   {showDeleteConfirmation.visibility}
                onOk        =   {() => {handleDeleteFolder(showDeleteConfirmation.folderUuid)}}
                onCancel    =   {() => setShowDeleteConfirmation({visibility: false})}
                header      =   'Delete folder'
                body        =   'Are you sure you want to delete this folder?'
                okText      =   'Delete'
            />
        </>
    )
}

export default LibraryLayout