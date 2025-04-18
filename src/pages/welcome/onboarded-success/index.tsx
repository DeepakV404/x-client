import { Modal } from 'antd';

import OnboardedCard from './onboarded-card';

const OnboardedPage = (props: {isOpen: boolean, onClose: () => void}) => {

    const { isOpen }    =   props;
    
    return (
        <Modal
            className   =   'j-onboarded-success-modal'
            open        =   {isOpen}
            closable    =   {false}
            width       =   {900}
            footer      =   {false}
            centered
        >
            {isOpen && <OnboardedCard {...props}/>}
        </Modal>
    );
}

export default OnboardedPage