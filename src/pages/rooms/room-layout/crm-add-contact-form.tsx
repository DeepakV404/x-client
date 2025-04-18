import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Space, Tooltip, Button, theme } from "antd";

import { CRM_INTEGRATION_CONFIG } from "../../settings/config/integration-type-config";
import { R_CRM_GET_CONTACTS_BY_DEAL } from "../api/rooms-query";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { GlobalContext } from "../../../globals";
import { RoomsAgent } from "../api/rooms-agent";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";


const CRMAddContactForm = (props: {room: any, onClose: () => void}) => {

    const { room, onClose }  =   props;

    const { $orgDetail }     =     useContext(GlobalContext);

    const { token: { colorPrimary } }       =   theme.useToken();

    const { roomId }    =   useParams();

    const [selectedContacts, setSelectedContacts]   =   useState<any>([]);
    const [submitState, setSubmitState]             =   useState({
        text    : `Add (${selectedContacts.length}) & Continue`,
        loading : false
    });

    const { data, loading, error }    =   useQuery(R_CRM_GET_CONTACTS_BY_DEAL, {
        variables: {
            dealId : room?.crmInfo?.id
        },
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        setSubmitState((prevState) => ({
            ...prevState,
            text: `Add (${selectedContacts.length}) & Continue`
        }));
    }, [selectedContacts]);

    const getContactEmailsInRoom = () => {
        let emailsInRoom = room?.buyers ? room?.buyers?.map((_contact: any) => _contact.emailId) : null
        return emailsInRoom;
    }

    const handleSelectContact = (contact: any) => {
        if(selectedContacts.filter((_item: any) => _item.emailId === contact.emailId).length > 0){
            setSelectedContacts((prevSelectedContacts: any) => prevSelectedContacts.filter((_item: any) => _item.emailId !== contact.emailId))
        }else{
            setSelectedContacts((prevSelectedContacts: any) => ([...prevSelectedContacts, contact]))
        }
    }  

    const handleAddAndContinue = (contacts: any) => {
        
        let contactList: any  =  [];

        if(contacts.length > 0){
            contacts.map((_contact: any) => contactList.push({ firstName: _contact.firstName, lastName: _contact.lastName, emailId: _contact.emailId }))
        }

        setSubmitState({
            loading :   true,
            text    :   "Adding..."
        })
            
        RoomsAgent.addContactToRoom({
            variables: {
                roomUuid    :   roomId, 
                inputs      :   contactList
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Contacts added successfully")
                onClose()
            },
            errorCallBack: (error: any) => {
                setSubmitState({
                    text    :  `Add (${selectedContacts.length}) & Continue`,
                    loading :  false
                })
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    if(error) return <SomethingWentWrong/>;

    return(
        <div className="cm-width100">
            <div className="cm-modal-header cm-font-fam500 cm-flex-align-center">
                <div className="cm-flex-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={40} height={20} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                Add from CRM
            </div>
            <div className="cm-modal-content">
                <Space direction="vertical" className="cm-width100">
                    { loading ?
                        <div style={{height: "300px"}}><Loading/></div>   
                    : 
                        data?._crmGetContactsByDeal?.length > 0 
                        ?    
                            data?._crmGetContactsByDeal?.map((_contact: any) => {
                                
                                const isDisabled    =   (getContactEmailsInRoom().includes(_contact.emailId) || _contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId);
                                const isSelected    =   selectedContacts.filter((_item: any) => _item.emailId === _contact.emailId).length > 0
                                const hasNoEmail    =   _contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId

                                return (
                                    <Tooltip title={hasNoEmail ? "Contact has no Email" : ""}>
                                        <div key={_contact.emailId} onClick={() => !isDisabled && handleSelectContact(_contact)} className={`j-room-sync-mapping-contact cm-flex-space-between cm-flex-align-center cm-border-radius4 ${isDisabled ? 'j-hs-disabled-contact cm-cursor-disabled' : 'j-hs-unmapped-contact cm-cursor-pointer'} ${isSelected ? "selected" : ""}`}>
                                            <Space direction="vertical" size={0}>
                                                <div className="cm-font-fam500">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div>
                                                <div className="cm-font-size12 cm-light-text">{(_contact.emailId !== "null" && _contact.emailId !== "") ? _contact.emailId : "No email found"}</div>
                                            </Space>
                                            {
                                                isDisabled && !hasNoEmail && <MaterialSymbolsRounded font="check" size="22"/>
                                            }
                                            {
                                                isSelected && <MaterialSymbolsRounded font="check" size="22" color={colorPrimary}/>
                                            }
                                        </div>
                                    </Tooltip>
                                )
                            })
                        :
                            <div className="cm-light-text cm-flex-center" style={{height: "300px"}}>No Contacts found</div>
                    } 
                </Space>           
            </div>
            <div className="cm-modal-footer">
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button onClick={onClose}>Cancel</Button>                      
                    <Button style={{width: "150px"}} type="primary" disabled={!(selectedContacts.length > 0)} onClick={() => handleAddAndContinue(selectedContacts)} className={!(selectedContacts.length > 0) ? "cm-button-disabled" : ""}>
                        <Space size={10}>
                            {submitState.text}
                            {
                                submitState.loading && <Loading color="#fff" size='small'/>
                            }
                        </Space>
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default CRMAddContactForm