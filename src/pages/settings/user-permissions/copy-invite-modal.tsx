import { useState } from 'react';
import { Form, Modal, Space, Typography } from 'antd';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Text }  =   Typography;

const CopyInviteModal = (props: {isOpen: boolean, onClose: any, user: any}) => {

    const { isOpen, onClose, user }   =   props;

    const [copy, setCopy]                   =   useState(false);

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    return (
        <Modal
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            footer          =   {null}
            className       =   "cm-bs-custom-modal"
            centered
        >
            {
                user ?
                    <>
                        <div className="cm-modal-header cm-flex-align-center">
                            <MaterialSymbolsRounded font="group_add" className="cm-margin-right5"/>
                            <div className="cm-font-size16 cm-font-fam500 cm-flex-align-center">Copy Invite</div>
                        </div>
                        <Form className="cm-form cm-modal-content" layout="vertical">
                            {user.inviteLink && 
                                <div className="j-template-link-root">
                                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: user.inviteLink}}>{user.inviteLink}</Text>
                                    <Space size={4} className="cm-cursor-pointer cm-flex-justify-end cm-link-text" onClick={() => copyLink(user.inviteLink)} style={{width: "160px"}} >
                                        <MaterialSymbolsRounded className='cm-cursor-pointer' font={copy ? 'done' : 'content_copy'} size='18' />
                                        <div className="cm-link-text">{copy ? "Copied" : "Copy Invite"}</div>
                                    </Space>
                                </div>
                            }
                        </Form>
                    </>
                :
                    null
            }
        </Modal>
    )
}

export default CopyInviteModal