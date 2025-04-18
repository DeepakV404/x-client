import { useContext, useState } from 'react';
import { Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { FEATURE_DECK } from '../../../../config/role-permission-config';
import { PermissionCheckers } from '../../../../config/role-permission';
import { CommonUtil } from '../../../../utils/common-util';
import { GlobalContext } from '../../../../globals';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import CopyLinkModal from '../modal/copy-link/copy-link-modal';
import EditDeckSlider from '../edit-deck';
import DeckCopyLink from '../modal/copy-link';

const { Text }  =   Typography;

const DeckHeader = (props: { deck: any}) => {

    const { deck }                  =   props;

    const { $user }                 =   useContext(GlobalContext);

    const navigate                  =   useNavigate();

    // permissions
    const _editDeckPermission       =    PermissionCheckers.__checkPermission($user.role, FEATURE_DECK, 'update');

    const [copyLinkModal, setCopyLinkModal]     =   useState({
        visibility: false,
        openedIn:   "product"
    });
    const [isModalOpen, setIsModalOpen]         =   useState({
        visibility  :   false,
        openedIn    :   "product" 
    });
    const [editDeck, setEditDeck]               =   useState<any>({
        visibility          :   false,
        action              :   null,
    });

    const handleButtonClick = () => {
        if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
            setIsModalOpen({
                visibility: true,
                openedIn: "crm"
            })
        }else{
            setIsModalOpen({
                visibility: true,
                openedIn: "product"
            })
        }
    };
      
    const handleMenuClick: MenuProps['onClick'] = (event) => {
        if(event.key === "simple_link"){
            handleButtonClick()
        }else if(event.key === "campaign_link"){
            if(CommonUtil.__getSubdomain(window.location.origin) === "hs-app" || CommonUtil.__getSubdomain(window.location.origin) === "sfdc-app"){
                setCopyLinkModal({
                    visibility: true,
                    openedIn: "crm"
                })
            }else{
                setCopyLinkModal({
                    visibility: true,
                    openedIn: "product"
                })
            }
        }
    };

    const handleBackClick = () => {
        navigate('/links');
    }

    const items: MenuProps['items'] = [
        {
            label: 'Simple Link',
            key: 'simple_link',
        },
        {
            label: 'Campaign Link',
            key: 'campaign_link',
        },
    ];

    const copyMenuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <>
            <div className='cm-background-white cm-padding-inline15 cm-flex-align-center cm-flex-space-between' style={{height: "49px", border: "1px solid #F1F4F7"}}>
                <Space size={15}>
                    <MaterialSymbolsRounded font='arrow_back' weight='400' className='cm-cursor-pointer' onClick={handleBackClick} size='22'/>
                    <Text ellipsis={{tooltip: deck?.title}} style={{maxWidth: "350px"}} className='cm-font-fam500 cm-font-size16'>{deck?.title}</Text>
                </Space>
                <Space>
                    {
                        _editDeckPermission ? 
                            <Button className='cm-padding5' onClick={() => setEditDeck({visibility : true, action : "Edit", deckData: {deck : deck}})}>
                                <MaterialSymbolsRounded font='settings' size='20' weight='250'/>
                            </Button>
                        : 
                            null
                    }
                    <Button onClick={(event) => {event.stopPropagation(); window.open(deck.previewLink,"_blank")}}><div className="cm-font-size14">Preview</div></Button>


                    <Dropdown.Button menu={copyMenuProps} onClick={handleButtonClick} type='primary' icon={<MaterialSymbolsRounded font='expand_more' size='20'/>}>
                        <MaterialSymbolsRounded font='link' size='20'/> Copy Link
                    </Dropdown.Button>
                </Space>    
            </div>
            <EditDeckSlider
                isOpen      =   {editDeck.visibility}
                onClose     =   {() => setEditDeck({visibility: false, action : null, deckData: null})}
                editDeck    =   {editDeck}
            />

            <DeckCopyLink 
                isInProduct =   {copyLinkModal.openedIn === "product"}
                isOpen      =   {copyLinkModal.visibility}
                onClose     =   {() => setCopyLinkModal({visibility: false, openedIn: "product"})}
                baseLink    =   {deck?.copyLink}
            />
            <CopyLinkModal 
                isInProduct =   {isModalOpen.openedIn === "product"}
                isOpen      =   {isModalOpen.visibility} 
                onClose     =   {() => setIsModalOpen({visibility: false, openedIn: "product"})} 
                link        =   {deck?.copyLink} 
            />
            
        </>
    )
}

export default DeckHeader