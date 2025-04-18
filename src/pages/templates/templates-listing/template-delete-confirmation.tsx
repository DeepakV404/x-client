import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputRef, Space } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react';

import { RT_DEPENDENCIES } from '../api/room-templates-query';
import { RoomTemplateAgent } from '../api/room-template-agent';
import { ERROR_CONFIG } from '../../../config/error-config';
import { CommonUtil } from '../../../utils/common-util';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import { GlobalContext } from '../../../globals';

const TemplateDeleteConfirmation = (props: { onCancel: () => void, template: any, navigateToListing? : boolean}) => {

    const { onCancel, template, navigateToListing}    =   props;

    const { $dictionary }   =   useContext(GlobalContext);

    const navigate          =      useNavigate();

    const [ inputValue, setInputValue ]     =    useState("");
    
    const [loadingState, setLoadingState]   =   useState({
        loading: false,
        text: "Delete"
    });

    const inputRef              =   useRef<InputRef>(null);

    const { data }  =  useQuery(RT_DEPENDENCIES, {
        variables: {
            templateUuid: template.uuid,
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus();
        }
    },[]);

    const onDelete = () => {
        setLoadingState({
            loading: true,
            text: "Deleting"
        })
        RoomTemplateAgent.deleteTemplate({
            variables: {
                templateUuid: template.uuid
            },
            onCompletion: () => {
                setLoadingState({
                    loading: false,
                    text: "Delete"
                })
                onCancel()
                CommonUtil.__showSuccess("Template deleted successfully")
                {navigateToListing && navigate('/templates')}
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

    return (
        <div className='cm-width100'>
            <Space className='cm-modal-header cm-flex-align-center'>
                <MaterialSymbolsRounded font="Error" color='#DF2222'/>
                <div className='cm-font-fam600 cm-font-size16'>Delete {$dictionary.templates.singularTitle}</div>
            </Space>
            <Space direction='vertical' className='cm-modal-content' size={15}>
                <div className=''>Are you sure you want to delete this {$dictionary.templates.singularTitle}? This cannot be undone.</div>
                <div className='cm-font-fam500'> This {$dictionary.templates.singularTitle} <span>({`${template.title ? template.title: ""}`})</span> was used to create <span className='cm-font-fam600'>{data?._rtDependencies?.roomDependencies?.count > 0 ? data?._rtDependencies?.roomDependencies?.count : 0} {$dictionary.rooms.title}</span></div>
                <div className='cm-widthh100 cm-flex cm-flex-direction-column' style={{rowGap: "10px"}}>
                    <div className='cm-secondary-text'>Please type "<span className='cm-font-fam500'>Delete</span>" to delete this {$dictionary.templates.singularTitle} permanently</div>
                    <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                </div>
            </Space>
            <div className='cm-modal-footer'>
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button ghost style={{color: "black", borderColor: "#E8E8EC"}} onClick={(event) => {event.stopPropagation(); onCancel(); setInputValue("")}}>Cancel</Button>                      
                    <Button disabled={inputValue !== "Delete"} style={inputValue === "Delete" ? { backgroundColor: "#FF4D4F", color: "#fff", border: "1px solid #FF4D4F"} : {}} onClick={(event) => {event.stopPropagation(); onDelete(); setInputValue("")}} loading={loadingState.loading}>
                        {loadingState.text}
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default TemplateDeleteConfirmation