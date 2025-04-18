import { useState } from 'react';
import { Button } from 'antd';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import NewPricingModal from './new-pricing-modal';

const LockedButton = (props: {btnText?: string}) => {

    const { btnText="Create" }   =   props;

    const [showPurchase, setShowPurchase]   =   useState(false);

    return (
        <>
            <Button icon={<MaterialSymbolsRounded font="add" size="19" weight='400'/>} className='cm-flex-align-center cm-icon-button' type="primary" 
                onClick={() => setShowPurchase(true)}
            >
                {btnText}
            </Button>
            <NewPricingModal
                isOpen  =   {showPurchase}
                onClose =   {() => setShowPurchase(false)}
            />
        </>
    )
}

export default LockedButton