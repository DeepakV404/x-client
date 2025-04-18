import { Modal, Space, theme } from 'antd'

const WarningConfirmation = (props: {isOpen: boolean, onOk: () => void, onCancel: () => void, header: string, title?: string, body? : string, subTitle? : string, okText?: string}) => {

    const { token: { colorPrimary } }       =   theme.useToken();

    const { isOpen, onOk, onCancel, header, body, subTitle="", okText="Proceed" }    =   props;

    return (
        <Modal
            destroyOnClose
            width               =   {400}
            open                =   {isOpen}
            onCancel            =   {onCancel}
            onOk                =   {onOk}
            okText              =   {okText}
            okButtonProps       =   {{size: "small", style: {fontSize: "12px"}}}
            cancelButtonProps   =   {{size: "small", style: {fontSize: "12px", border: "none", boxShadow: "0 0 0", color: colorPrimary}}}
        >
            <Space direction='vertical' size={5} className='cm-margin-bottom10'>
                <div className='cm-font-fam600 cm-font-size16 cm-margin-bottom10'>{header}</div>
                {
                    body ?
                        <div className='cm-font-size13'>{body}</div>
                    :
                        <div className=''>Are you sure you want to {subTitle ? subTitle : "perform this action ?"}</div>
                }
            </Space>
        </Modal>
    )
}

export default WarningConfirmation