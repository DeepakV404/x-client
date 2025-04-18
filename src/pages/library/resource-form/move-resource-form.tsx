import { useRef, useState } from "react";
import { Button, Divider, Space,} from "antd"

import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { LibraryAgent } from "../api/library-agent";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import FolderTree from "../library-layout/folder-tree";
import Loading from "../../../utils/loading";

const MoveResourceForm = (props: { onClose: any, resourceId: any, handleResetAllSelectedRes: any }) => {

    const { onClose, resourceId, handleResetAllSelectedRes } = props

    const folderRef     =   useRef<any>(null);

    const [folderId, setFolderId]               =   useState();
    const [submitState, setSubmitState]         =   useState({
        loading     :   false,
        text        :   "Move to Folder"
    });

    const moveToFolder = () => {
        setSubmitState({
            loading :   true,
            text    :   "Moving..."
        })

        LibraryAgent.moveResources({
            variables: {
                folderUuid          :   folderId === "home" ? undefined : folderId,
                resourceUuids       :   resourceId,
            },
            onCompletion: () => {
                setSubmitState({
                    loading :   false,
                    text    :   "Update"
                })
                CommonUtil.__showSuccess("Resource moved successfully");
                handleResetAllSelectedRes()
                onClose();
            },
            errorCallBack: (error: any) => {
                handleResetAllSelectedRes()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const getSelectedFolder = (folderId: any) => {
        setFolderId(folderId)
        if(folderId === "home"){
            folderRef.current.resetSelectedKey()
        }
    }

    return (
        <>
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Move Resource to Folder</div>
            <div className="cm-modal-content" style={{padding: "10px", minHeight: "200px"}}>
                <Space className={`cm-flex-align-center j-move-to-folder-home-option ${folderId === "home" ? "selected" : ""}`} onClick={() => getSelectedFolder("home")}>
                    <MaterialSymbolsRounded font="home" size="20"/>
                    <div className="cm-font-fam500 cm-font-fam18">Home</div>
                </Space>
                <Divider style={{margin: "5px 0px 5px 0px"}}/>
                <FolderTree folderRef={folderRef} getSelectedFolder={getSelectedFolder}/>
            </div>
            <Space className="cm-flex-justify-end cm-modal-footer">
                <Button className="cm-cancel-btn cm-modal-footer-cancel-btn" onClick={() => onClose()}>
                    <div className="cm-font-size14 cm-secondary-text">Cancel</div>
                </Button>
                <Button type="primary" className={`cm-flex-center ${submitState.loading ? "cm-button-loading" : ""} ${!folderId ? "cm-button-disabled" : ""}`} onClick={() => moveToFolder()} disabled={!folderId || submitState.loading}>
                    <Space size={10}>
                        <div className="cm-font-size14">{submitState.text}</div>
                        {
                            submitState.loading && <Loading color="#fff"/>
                        }
                    </Space>
                </Button>
            </Space>
        </>
    )
}

export default MoveResourceForm