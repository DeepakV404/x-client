import { useEffect, useRef } from 'react';
import { InputRef, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const RoomLinkModal = (props: {isOpen: boolean, onClose: () => void, room: any}) => {

    const { isOpen, onClose, room }   =   props;

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        setTimeout(() => {
            if (isOpen) {
                inputRef?.current?.focus({
                    cursor: 'all',  
                });
            }
        }, 100)
    }, [isOpen]);

    return (
        <Modal
            width           =   {600}
            open            =   {isOpen} 
            onCancel        =   {onClose}
            footer          =   {null}
            destroyOnClose  =   {true}
            className       =   "cm-bs-custom-modal"
            centered
        > 
            <div className="cm-modal-header cm-flex-align-center cm-font-size16 cm-font-fam600">Buyer Portal Link</div>
            <div className="j-link-modal-content">
                <TextArea
                    readOnly
                    ref={inputRef}
                    defaultValue={room.buyerPortalLink}
                    className="j-copy-buyer-link cm-padding15"
                    style={{
                        height: "auto",
                        resize: "none"
                    }}
                />             
            </div>
        </Modal>
    )
}

export default RoomLinkModal