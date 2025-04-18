import { Button, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";

import { ERROR_CONFIG } from "../../config/error-config";
import { CommonUtil } from "../../utils/common-util";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import Loading from "../../utils/loading";
import { SFDCAgent } from "../api/sfdc-agent";

const SelectContact = (props: {contacts: any, contactsInRoom: any, roomId: string}) => {

    const { contacts, contactsInRoom, roomId }  =   props;

    let page            =   CommonUtil.__getQueryParams(window.location.search).page;

    const [selectedContacts, setSelectedContacts] = useState<any>([]);
    const [submitState, setSubmitState]     =   useState({
        text: `Add (${selectedContacts.length}) & Continue`,
        loading: false
    });

    useEffect(() => {
        setSubmitState((prevState) => ({
            ...prevState,
            text: `Add (${selectedContacts.length}) & Continue`
        }));
    }, [selectedContacts]);

    const getContactEmailsInRoom = () => {
        let emailsInRoom = contactsInRoom ? contactsInRoom.map((_contact: any) => _contact.emailId) : null
        return emailsInRoom;
    }

    const handleSelectContact = (contact: any) => {

        if(selectedContacts.filter((_item: any) => _item.emailId === contact.emailId).length > 0){
            setSelectedContacts((prevSelectedContacts: any) => prevSelectedContacts.filter((_item: any) => _item.emailId !== contact.emailId))
        }else{
            setSelectedContacts((prevSelectedContacts: any) => ([...prevSelectedContacts, contact]))
        }
    } 
    
    const selectableContacts = contacts.filter(
        (_contact: any) => !getContactEmailsInRoom().includes(_contact.emailId) && _contact.emailId !== "null" && _contact.emailId !== ""
    );
    
    const mapRoom = (contacts: any) => {

        setSubmitState({
            loading :   true,
            text    :   "Adding..."
        })
        
        if(page === 'opportunity'){
            let opportunityId      =   CommonUtil.__getQueryParams(window.location.search).id;
            let opportunityName    =   CommonUtil.__getQueryParams(window.location.search).name;
            
            let contactsList:any = [];

            if(contacts.length > 0){
                contacts.map((_contact: any) => contactsList.push({emailId: _contact.emailId, firstName: _contact.firstName, lastName: _contact.lastName}))
            }

            SFDCAgent.mapOpportunityToRoom({
                variables: {
                    opportunityId   :   opportunityId, 
                    name            :   opportunityName,
                    roomUuid        :   roomId,
                    input           :   contactsList.length > 0 ? contactsList : null
                },
                onCompletion: () => {
                    CommonUtil.__showSuccess("Room mapped successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleAddAndContinue = () => {
        mapRoom(selectedContacts);
    };

    const handleContinue = () => {
        mapRoom([]);
    };
    
    return(
        <div className="cm-width100">
            <div className="cm-modal-header cm-font-fam500 cm-flex-align-center">Add People</div>
            <div className="cm-padding-block10">
                <Space direction="vertical" className="cm-width100">
                    {        
                        contacts.map((_contact: any) => {
                            
                            const isDisabled    =   (getContactEmailsInRoom().includes(_contact.emailId) || _contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId);
                            const isSelected    =   selectedContacts.filter((_item: any) => _item.emailId === _contact.emailId).length > 0
                            const hasNoEmail    =   _contact.emailId === "null" || _contact.emailId === "" || !_contact.emailId

                            return (
                                <Tooltip title={hasNoEmail ? "Contact has no Email" : ""}>
                                    <div key={_contact.emailId} onClick={() => !isDisabled && handleSelectContact(_contact)} className={`j-hs-mapping-contact cm-flex-space-between cm-flex-align-center cm-margin-inline15 cm-border-radius4 ${isDisabled ? 'j-hs-disabled-contact cm-cursor-disabled' : 'j-hs-unmapped-contact cm-cursor-pointer'} ${isSelected ? "selected" : ""}`}>
                                        <Space direction="vertical" size={0}>
                                            <div className="cm-font-fam500">{CommonUtil.__getFullName(_contact.firstName, _contact.lastName)}</div>
                                            <div className="cm-font-size12 cm-light-text">{(_contact.emailId !== "null" && _contact.emailId !== "") ? _contact.emailId : "No email found"}</div>
                                        </Space>
                                        {
                                            isDisabled && !hasNoEmail && <MaterialSymbolsRounded font="check" size="22"/>
                                        }
                                        {
                                            isSelected && <MaterialSymbolsRounded font="check" size="22" color="#48A3B9"/>
                                        }
                                    </div>
                                </Tooltip>
                            )
                        })
                    } 
                </Space>           
            </div>
            <div className="cm-modal-footer">
                <Space className='cm-width100 cm-margin-top15 cm-flex-justify-end'>
                    <Button onClick={handleContinue}>Continue</Button>   
                    {selectedContacts.length < contacts.length && selectableContacts.length > 0 && 
                        <Button style={{width: "150px"}} type="primary" disabled={!(selectedContacts.length > 0)} onClick={handleAddAndContinue} className={!(selectedContacts.length > 0) ? "cm-button-disabled" : ""}>
                            <Space size={10}>
                                {submitState.text}
                                {
                                    submitState.loading && <Loading color="#fff" size='small'/>
                                }
                            </Space>
                        </Button>
                    }                   
                </Space>
            </div>
        </div>
    )
}

export default SelectContact