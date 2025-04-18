import { useContext, useEffect } from 'react';
import { FloatButton, Popover } from 'antd';
import { useLazyQuery } from '@apollo/client';

import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';
import { P_GET_TOUCH_POINT_QUESTION } from '../../api/buyers-query';
import { BuyerGlobalContext } from '../../../buyer-globals';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import DiscoverStackedQuestion from './discover-stacked-question';

const DiscoveryQPopup = () => {

    const { showInitalPopup, setShowInitialPopup }  =   useContext<any>(BuyerDiscoveryContext);

    const [_getTouchPointQuestion, { data, loading, error }]    =   useLazyQuery(P_GET_TOUCH_POINT_QUESTION, {
        fetchPolicy: "network-only"
    })

    const { $sessionId }   =   useContext<any>(BuyerGlobalContext);

    useEffect(() => {
        if(showInitalPopup.visibility && showInitalPopup.touchpointData.uuid){
            _getTouchPointQuestion({
                variables: {
                    touchPointUuid  :   showInitalPopup.touchpointData.uuid,
                    sessionUuid     :   $sessionId
                }
            })
        }
    }, [showInitalPopup])

    if(error) return <SomethingWentWrong/>

    const handleClose = () => {
        setShowInitialPopup({
            visibility      :   false,
            touchpointData  :   null  
        })
    }

    return (
        <Popover
            rootClassName   =   "j-discovery-q-initial-popup"
            placement       =   "topRight" 
            open            =   {showInitalPopup.visibility}
            onOpenChange    =   {(state: boolean) => state ? setShowInitialPopup({visibility:false,touchpointData  :   null}) : null}
            content         =   {loading ? <></> : (data?._pGetTouchPointQuestion && data?._pGetTouchPointQuestion.length > 0 ? <DiscoverStackedQuestion questions={data?._pGetTouchPointQuestion} onClose={handleClose} /> : <></>)}
            trigger         =   {"click"}
            arrow           =   {false}
        >
            <FloatButton className='j-discovery-hidden-button' icon={null}/>
        </Popover>
    )
}

export default DiscoveryQPopup