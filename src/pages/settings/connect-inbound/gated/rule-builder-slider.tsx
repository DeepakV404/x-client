import { Drawer } from 'antd';

import RuleBuilder from './rule-builder';

const RuleBuilderSlider = (props: { isOpen: boolean, onClose: () => void}) => {

    const { isOpen, onClose }   =   props;

    return (
        <Drawer 
            width       =   {700}
            open        =   {isOpen}
            onClose     =   {onClose}
            headerStyle =   {{display:'none'}}
        >
            {isOpen ? <RuleBuilder/> : null}
        </Drawer>
    )
}

export default RuleBuilderSlider