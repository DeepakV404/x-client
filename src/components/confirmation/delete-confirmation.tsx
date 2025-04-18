import { Modal, Space } from 'antd'
import MaterialSymbolsRounded from '../MaterialSymbolsRounded';
import { useEffect } from 'react';

const DeleteConfirmation = (props: {isOpen: boolean, onOk: () => void, onCancel: () => void, header?: string, title?: string, body? : string, subTitle? : string, okText?: string}) => {

    const { isOpen, onOk, onCancel, header, title="", body, subTitle="", okText="Delete" }    =   props;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && isOpen) {
                event.preventDefault();
                onOk();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onOk]);

    return (
        <Modal
            destroyOnClose
            width               =   {450}
            open                =   {isOpen}
            onCancel            =   {(event) => {event.stopPropagation(); onCancel()}}
            onOk                =   {(event) => {event.stopPropagation(); onOk()}}
            okText              =   {okText}
            okButtonProps       =   {{ danger: true, style: {backgroundColor: "#FF4D4F"}}}
            cancelButtonProps   =   {{ danger: true, style: {color: "black", borderColor: "#E8E8EC"}, ghost: true}}
        >
            <Space direction='horizontal' className='cm-flex-align-start' size={16}>
                    <MaterialSymbolsRounded font="Error" color='#DF2222'/>
                <Space direction='vertical'>
                    {
                        header ?
                            <div className='cm-font-fam500 cm-font-size16'>{header}</div>
                        :
                            <div className='cm-font-fam600 cm-font-size16'>Delete {title}</div>
                    }
                    <div>
                        {
                            body ?
                                <div className='cm-margin-bottom10'>{body}</div>
                            :
                                <div className='cm-margin-bottom10'>Are you sure you want to delete this {subTitle ? subTitle : "item"}? This cannot be undone.</div>
                        }
                    </div>
                </Space>
            </Space>
        </Modal>
    )
}

export default DeleteConfirmation