import { Modal } from 'antd';

import SlackChannelConnection from './slack-channel-connection';

const SlackModal = (props: { isOpen: boolean, onClose: () => void, channelId: string }) => {

    const {isOpen, onClose} = props;
   
    return (
        <Modal  
			centered
            destroyOnClose
			open        = 	{isOpen}  
			footer 	    = 	{null}
			onCancel    =   {onClose}
        >
            <SlackChannelConnection {...props} />
        </Modal>
    )
}

export default SlackModal