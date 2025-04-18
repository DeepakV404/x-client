import { useContext, useState } from "react";
import { useNavigate} from "react-router-dom";
import { Card, Col, Dropdown, Row, Space, Typography } from "antd";

import { GlobalContext } from "../../../globals";
import { checkPermission } from "../../../config/role-permission";
import { FEATURE_LIBRARY } from "../../../config/role-permission-config";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import EditFolderModal from "./folder-edit-modal";
import DeleteConfirmation from "../../../components/delete-confirmation-modal";
import { LibraryAgent } from "../api/library-agent";
import { CommonUtil } from "../../../utils/common-util";
import { ERROR_CONFIG } from "../../../config/error-config";

const { Paragraph } =   Typography;

const LibraryFolder = (props: {folders: any}) => {

    const { folders }   =   props;

    const navigate   =   useNavigate();

    const { $user }  =   useContext(GlobalContext);

    const [ isEditFolder, setIsEditFolder ]       =    useState<any>({
        visible         :   false,
        currentFolder   :   "",
    });
    const [deleteConfirmation, setDeleteConfirmation]       =   useState<{isOpen: boolean; data: any}>({
        isOpen: false,
        data: null
    });

    const folderOptions = (folder: any) => {
        return([
            {
                key     :   'edit',
                icon    :   <MaterialSymbolsRounded font="edit" size="16"/>,
                label   :   (
                    <span>Edit</span>
                ),
                onClick :   (event: any) => {
                    event.domEvent.stopPropagation();
                    setIsEditFolder({visible: true, currentFolder: folder})
                }
            },
            {
                key     :   'delete',
                icon    :   <MaterialSymbolsRounded font="delete" size="16"/>,
                danger  :   true,
                label   :   (
                    <span>Delete</span>
                ),
                onClick :   (event: any) => {
                    event.domEvent.stopPropagation();
                    setDeleteConfirmation({
                        isOpen      :   true,
                        data        :   folder
                    })
                }
            },
        ])
    };
    
    const onDelete = () => {
        LibraryAgent.deleteFolder({
            variables: {
                folderUuid: deleteConfirmation.data.uuid,
            },
            onCompletion: () => {
                setDeleteConfirmation({isOpen: false, data: null})
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return(
        <div className="j-library-folder cm-margin-bottom20">
            <div className="cm-secondary-text cm-font-fam500 cm-margin-bottom10">Folders</div>
            <Row gutter={[15, 15]}>
                {
                    folders && folders.length > 0 ?
                        (folders.map((_folders: any) => (
                            <Col key={_folders.uuid} xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                                <Card className="j-library-folder-card cm-cursor-pointer" onClick={() => navigate(`/library/${_folders.uuid}`)}>
                                    <Space direction="vertical" className="cm-width100">
                                        <div style={{paddingBlock: "8px"}} className="cm-height100 cm-flex">
                                            <img style={{width: "40px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/folder.svg`} alt='logo'/>
                                        </div>
                                        <Paragraph
                                            className   =   "cm-font-fam500 cm-font-size14 cm-width100 cm-margin-bottom0"
                                            ellipsis    =   {{rows:1, expandable:false, tooltip: _folders.title}}
                                        >
                                            {_folders.title}
                                        </Paragraph>
                                        <Space className="cm-secondary-text cm-font-size13" size={15}>
                                            {
                                                (_folders.resourcesCount === 0 && _folders.subfoldersCount === 0) 
                                                    ? "No Files" 
                                                    : (<>
                                                            {_folders.resourcesCount > 0 && (<span>{_folders.resourcesCount} {`File${_folders.resourcesCount > 1 ? 's' : ''}`}</span>)}
                                                            {_folders.subfoldersCount > 0 && <span>{_folders.subfoldersCount} {`Folder${_folders.subfoldersCount > 1 ? 's' : ''}`}</span>}
                                                        </>)
                                            }
                                        </Space>
                                    </Space>
                                    {
                                        checkPermission($user.role, FEATURE_LIBRARY, 'update') &&
                                            <Dropdown menu={{items: folderOptions(_folders)}} overlayStyle={{minWidth: "150px"}} trigger={["click"]} overlayClassName="j-res-car-options">
                                                <div className="j-folder-card-more cm-flex-center" onClick={(event) => event.stopPropagation()}>
                                                    <MaterialSymbolsRounded font="more_vert" size="18"/>
                                                </div>
                                            </Dropdown>
                                    }
                                </Card>
                            </Col>
                        )))
                    :
                        null
                }
            </Row>
            <EditFolderModal isOpen={isEditFolder.visible} onClose={() => setIsEditFolder(false)} currentFolder={isEditFolder.currentFolder}/>
            <DeleteConfirmation 
                isOpen={deleteConfirmation.isOpen} 
                content={{
                    module: "Folder",
                    cautionMessage: `Caution! Deleting this folder will delete ${deleteConfirmation?.data?.resourcesCount ?? 0} resources and ${deleteConfirmation?.data?.resourcesCount ?? 0} subfolders from it.`,
                }}
                onOk={onDelete}
                onCancel={() => setDeleteConfirmation({isOpen: false, data: null})}
                otherReqInfo={{
                    deleteConfirmation
                }}
            />
        </div>
    )
}

export default LibraryFolder