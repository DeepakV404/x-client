
import { useContext } from 'react';
import {  Badge, Popover } from 'antd';
import { BuyerDiscoveryContext } from '../../context/buyer-discovery-globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import DiscoverySiderQuestion from './discovery-sider-question';


const DiscoveryPopup = (props: {question: any}) => {

    const { showPopup, setShowPopup }   =   useContext<any>(BuyerDiscoveryContext);

    const { question }   =   props;

    const handleChange = (state: boolean) => {
        setShowPopup({visibility: state, triggerId: question.uuid})
    }


    return (
        <Popover
            key                 =   {showPopup.triggerId}
            overlayClassName    =   'j-discovery-q-popup'
            content             =   {<DiscoverySiderQuestion triggeredQuestion={question} onClose={() => setShowPopup({visibility: false, triggerId: question.uuid})}/>}
            trigger             =   "click"
            onOpenChange        =   {handleChange}
            placement           =   'leftTop'
            open                =   {showPopup.visibility && showPopup.triggerId === question.uuid}
            arrow               =   {false}
        >
            <Badge dot={question.question.isMandatory} status="error" offset={[-30, 2]}>
                <div className={`j-discovery-q-trigger ${question.status.toLowerCase()} cm-cursor-pointer`} onClick={() => setShowPopup({visibility: true, triggerId: question.uuid})}>
                    <MaterialSymbolsRounded font='help' size='22' filled/>
                </div>
            </Badge>
        </Popover>
    )
}

export default DiscoveryPopup

