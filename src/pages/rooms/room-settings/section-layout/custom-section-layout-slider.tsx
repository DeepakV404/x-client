import { useContext, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { Space } from 'antd'

import { R_SECTION } from '../../api/rooms-query';
import { GlobalContext } from '../../../../globals';
import { PermissionCheckers } from '../../../../config/role-permission';
import { RT_SECTION } from '../../../templates/api/room-templates-query';
import { FEATURE_ROOMS, FEATURE_TEMPLATES } from '../../../../config/role-permission-config';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded'
import ReorderWidgets from './reorder-widgets/reorder-records';

const CustomSectionLayoutSider = (props: {tourRef?: any, sectionId: any, kind?: any; widgets: any, setWidgetSlider: any }) => {

    const { tourRef, sectionId, widgets, setWidgetSlider, kind } =   props;

    const $client                       =   useApolloClient();
    
    const { $user }                     =   useContext(GlobalContext);
    
    const SectionEditPermission         =   kind ? PermissionCheckers.__checkPermission($user.role, FEATURE_TEMPLATES, 'update') : PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');
    
    const [editOrder, setEditOrder]     =   useState(false);

    const handleReorderClick  =  () => {
        if(SectionEditPermission){
            setEditOrder(true);
            $client.refetchQueries({include: [R_SECTION, RT_SECTION]})
        }else{
            {}
        }
    }

    return (
        <div className="cm-background-white cm-flex-justify-center cm-padding15" style={{height: "100%", width: "60px"}}>
            <Space direction="vertical" className='cm-margin-top15' size={10}>
                <div ref={tourRef} className={`j-room-section-menu-item cm-flex-center cm-padding5 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"}`} onClick={() => SectionEditPermission ? setWidgetSlider((prev: boolean) => !prev) : {}}>
                    <MaterialSymbolsRounded font="widgets"/>
                </div>
                <div className="cm-font-size10 cm-secondary-text">Widgets</div>
                <div className={`j-room-section-menu-item cm-flex-center cm-padding5 ${SectionEditPermission ? "cm-cursor-pointer" : "cm-cursor-disabled"}`} onClick={handleReorderClick}>
                    <MaterialSymbolsRounded font="low_priority"/>
                </div>
                <div className="cm-font-size10 cm-secondary-text">Reorder</div>
            </Space>
            <ReorderWidgets isOpen={editOrder} onClose={() => setEditOrder(false)} widgets={widgets} sectionId={sectionId} />
        </div>
    )
}

export default CustomSectionLayoutSider