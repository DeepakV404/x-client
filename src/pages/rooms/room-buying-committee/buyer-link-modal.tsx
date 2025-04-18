import { useEffect, useRef } from 'react';
import { Input, InputRef, Modal } from 'antd';

const { TextArea } = Input;

interface BuyerLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    buyer: string; 
}

const BuyerLinkModal = (props: BuyerLinkModalProps) => {
    
    const { isOpen, onClose, buyer } = props;
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        setTimeout(() => {
            if (isOpen) {
                inputRef?.current?.focus({
                    cursor: 'all',
                });
            }
        }, 100);
    }, [isOpen]);

    return (
        <Modal
            width={600}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose={true}
            className="cm-bs-custom-modal"
            centered
        >
            <div className="cm-modal-header cm-flex-align-center cm-font-size16 cm-font-fam600">Buyer Portal Link</div>
            <div className="j-link-modal-content">
                <TextArea
                    readOnly
                    ref={inputRef}
                    defaultValue={buyer}
                    className="j-copy-buyer-link cm-padding15"
                    style={{
                        height: "auto",
                        resize: "none"
                    }}
                />
            </div>
        </Modal>
    );
}

export default BuyerLinkModal;
