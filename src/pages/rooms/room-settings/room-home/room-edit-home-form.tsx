import { useContext, useRef } from "react";
import { Button, Space } from "antd";

import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";
import { RoomsAgent } from "../../api/rooms-agent";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import RoomPitchForm from "./room-pitch-form";
import { GlobalContext } from "../../../../globals";
import { REQUEST_BLOB_URLS } from "../../../library/api/library-query";
import { useLazyQuery } from "@apollo/client";
import { CHUNK_SIZE } from "../../../../constants/module-constants";

export const PASTE_LINK             =   "pasteLink";
export const SELECT_FROM_LIBRARY    =   "selectFromLibrary";
export const UPLOAD_FROM_DEVICE     =   "uploadFromDevice"

const RoomEditHomeForm = (props: {onClose: () => void, room: any}) => {
  
    const { onClose, room }   =   props;

    const { $fileListProps }   =   useContext<any>(GlobalContext);

    const { setFileListForMultipleUpload } = $fileListProps

    const [_getBlobUrls]        =   useLazyQuery(REQUEST_BLOB_URLS, {fetchPolicy: "network-only"});
    
    const pitchRef: any     =   useRef();

    const onFinish = async () => {

        let uploadType  =   null

        let pitchInput: any = {
            roomUuid:   room.uuid,
            input: {}
        }

        if(pitchRef.current && pitchRef.current.hasData){
            if(pitchRef.current.currentUploadType === PASTE_LINK){
                pitchInput.input["pitchVideo"] = {
                    "link"  : pitchRef.current.pastedLink
                }
            }else if(pitchRef.current.currentUploadType === SELECT_FROM_LIBRARY){
                pitchInput.input["pitchVideo"] = {
                    "uuid"  : pitchRef.current.selectedResource.uuid
                }
            }else if(pitchRef.current.currentUploadType === UPLOAD_FROM_DEVICE){
                uploadType  =   "uploadFromDevice"
            }
        }

        if(uploadType) {

            // onClose()
            const { uid, name, lastModified, lastModifiedDate, size, type } = pitchRef.current.updatedFile;
        
            const updatedFile = {
                uid,
                name,
                lastModified,
                lastModifiedDate,
                size,
                type,
                status: 'uploading',
            };

            setFileListForMultipleUpload((prevFileListForMultipleUpload: any) => [
                ...(prevFileListForMultipleUpload || []),
                updatedFile,
            ]);

            const requestBlobURLs: any = async (parts: number, file: string) => {

                const urls = await _getBlobUrls({
                    variables: {
                        numberOfParts: parts,
                        contentType: file
                    }
                })
        
                return urls.data.requestBlobUrls
            }
        
            const getPresignedUrls = async (file: any) => {
                const numberOfParts = Math.ceil(file.size / CHUNK_SIZE);
                const response =  await requestBlobURLs(numberOfParts, file.type)
                return {urls: response.urls, contentId: response.contentUuid, uploadId: response.uploadId}
            }

            if(pitchRef.current.updatedFile){
                
                const { urls, contentId, uploadId } = await getPresignedUrls(pitchRef.current.updatedFile);

                try {

                    pitchInput.input["pitchVideo"]    =   {
                        "blobInput" : {
                            contentUuid: contentId,
                            contentType: pitchRef.current.updatedFile.type,
                            fileName: pitchRef.current.updatedFile.name
                        }
                    }
        
                    setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                        prevFileListForMultipleUpload.map((item: any) =>
                            item.uid === pitchRef.current.updatedFile.uid ? { ...item, contentId } : item
                        )
                    );
            
                    CommonUtil.__uploadToS3(
                        pitchRef.current.updatedFile,           
                        urls,                  
                        contentId,             
                        uploadId,              
                        () => {                
                            RoomsAgent.updateRoom({
                                variables: pitchInput,
                                onCompletion: () => {
                                    setFileListForMultipleUpload((prevFileListForMultipleUpload: any) =>
                                        prevFileListForMultipleUpload.map((item: any) =>
                                            item.contentId === contentId
                                                ? { ...item, status: 'completed' }
                                                : item
                                        )
                                    );
                                },
                                errorCallBack: (error: any) => {
                                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                                }
                            })
                        },
                    );
                } catch {}
            }
        } else {
            RoomsAgent.updateRoom({
                variables: pitchInput,
                onCompletion: () => {
                    onClose()
                    CommonUtil.__showSuccess("Welcome updated successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }

    }

    return (
        <div className='cm-height100'>
            <div className='j-demo-form-header cm-font-fam600 cm-font-size16'>
                <Space className='cm-width100 cm-flex-space-between'>
                    Edit Home
                    <MaterialSymbolsRounded font='close' size='20' className='cm-cursor-pointer' onClick={() => onClose()}/>
                </Space>
            </div>
            <div className='j-demo-form-body'>
                <div className="cm-padding15">
                    <RoomPitchForm pitchRef={pitchRef} pitchVideo={room.pitchVideo}/>
                </div>
            </div>
            <div className='j-demo-form-footer'>
                <Space>
                    <Button className="cm-cancel-btn" ghost onClick={() => onClose()}><div className="cm-font-size14 cm-secondary-text">Cancel</div></Button>
                    <Button type="primary" className="cm-flex-center" onClick={onFinish}>
                        <Space size={10}>
                            <div className="cm-font-size14">Update</div>
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default RoomEditHomeForm