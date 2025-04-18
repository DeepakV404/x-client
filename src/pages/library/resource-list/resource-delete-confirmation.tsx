import { useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, Space } from 'antd'
import { useQuery } from '@apollo/client';

import { RESOURCE_DEPENDENCIES } from '../api/library-query';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';
import { LibraryAgent } from '../api/library-agent';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const ResourceDeleteConfirmation = (props: {onCancel: () => void, resource: any, folder?: boolean}) => {

    const { onCancel, resource, folder }   =   props;

    const [inputValue, setInputValue]       =    useState("");
    const [loadingState, setLoadingState]   =   useState({
        loading: false,
        text: "Delete"
    });
    const inputRef              =   useRef<InputRef>(null);

    const { data }  =  useQuery(RESOURCE_DEPENDENCIES, {
        variables: {
            resourceUuid: resource.uuid,
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const onDelete = () => {
        setLoadingState({
            loading: true,
            text: "Deleting"
        })

        if(folder) {
            LibraryAgent.deleteFolder({
                variables: {
                    folderUuid: resource.uuid,
                },
                onCompletion: () => {
                    setLoadingState({
                        loading: false,
                        text: "Delete"
                    })
                    onCancel()
                    CommonUtil.__showSuccess("Folder removed successfully");
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        } else {
            LibraryAgent.deleteResources({
                variables: {
                    resourceUuid    :   resource.uuid
                },
                onCompletion: () => {
                    setLoadingState({
                        loading: false,
                        text: "Delete"
                    })
                    onCancel()
                    CommonUtil.__showSuccess("Resource removed successfully");
                },
                errorCallBack: (error: any) => {
                    setLoadingState({
                        loading: false,
                        text: "Delete"
                    })
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleEnter = (event: any) => {
        if(event.keyCode === 13 && inputValue === "Delete") onDelete()
    }

    return (
            <div className='cm-width100'>
                <Space className='cm-modal-header cm-flex-align-center'>
                    <MaterialSymbolsRounded font="Error" color='#DF2222'/>
                    <div className='cm-font-fam600 cm-font-size16'>Delete {folder ? "folder" : "resource"}</div>
                </Space>
                <Space direction='vertical' className='cm-modal-content' size={15}>
                    <div className='cm-margin-bottom10'>Are you sure you want to delete this {folder ? "folder" : "resource"}? This cannot be undone.</div>
                    <div className='cm-font-fam500'>
                        {
                            folder 
                            ? (
                                <>
                                    Caution! Deleting this folder will delete {resource.resourcesCount} resources and {resource.subfoldersCount} subfolders from it.
                                </>
                            ) : (
                                <>
                                    Caution! Deleting this resource (used in {data?.resourceDependencies?.roomDependencies?.count ?? 0} rooms and {data?.resourceDependencies?.templateDependencies?.count ?? 0} templates) will remove it from them.
                                </>
                            )
                        }
                    </div>
                    <div className='cm-secondary-text'>Please type "<span className='cm-font-fam500'>Delete</span>" to delete this {folder ? "folder" : "resource"} permanently</div>
                    <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(event) => handleEnter(event)}/>
                </Space>
                <div className='cm-modal-footer'>
                    <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                        <Button ghost style={{color: "black", borderColor: "#E8E8EC"}} onClick={(event) => {event.stopPropagation(); onCancel()}}>Cancel</Button>
                        <Button disabled={inputValue !== "Delete"} style={inputValue === "Delete" ? { backgroundColor: "#FF4D4F", color: "#fff", border: "1px solid #FF4D4F"} : {}} onClick={(event) => {event.stopPropagation(); onDelete(); setInputValue("")}} loading={loadingState.loading}>
                            {loadingState.text}
                        </Button>
                    </Space>
                </div>
            </div>
    )
}

export default ResourceDeleteConfirmation