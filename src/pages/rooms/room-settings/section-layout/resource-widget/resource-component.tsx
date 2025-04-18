import { useContext, useState } from 'react';
import { Space, Typography } from 'antd';

import { FEATURE_ROOMS } from '../../../../../config/role-permission-config';
import { PermissionCheckers } from '../../../../../config/role-permission';
import { GlobalContext } from '../../../../../globals';

import AddResourceToComponentSlider from './add-resource-to-component/add-resource-to-component-slider';
import SectionResourceViewer from './section-resource-viewer';

const { Text }  =   Typography

const ResourceComponent = (props: { component: any, widget: any }) => {

    const { component, widget }         =   props;

    const __resourcePropertyMap         =   {...component.content.resource};

    const { $user }                     =   useContext(GlobalContext);

    const [isUploadResource, setIsUploadResource]   =   useState(false);

    const RoomEditPermission            =   PermissionCheckers.__checkPermission($user.role, FEATURE_ROOMS, 'update');

    return (
        <>
            {
                __resourcePropertyMap.value 
                ?
                    <div style={{borderRadius: "6px"}} className="cm-aspect-ratio16-9 cm-flex-align-center cm-cursor-pointer">
                        <SectionResourceViewer resource={__resourcePropertyMap.value}/>
                    </div>
                :
                    <div className="cm-margin-top10 cm-flex-center" style={{height: "250px"}}>
                        <div className={`j-section-add-text j-section-resource-add-card cm-flex-center ${RoomEditPermission ? "cm-cursor-pointer": ""} cm-padding5`} onClick={() => RoomEditPermission ? setIsUploadResource(true) : null}>
                            <Space direction="vertical" className="cm-text-align-center" size={2}>
                                <Text className="j-hyperlink-text">Add Resource</Text>
                                <Text className="cm-light-text cm-font-size12">You can add img, docs, mp4 & etc.</Text>
                            </Space>
                        </div>
                    </div>
            }
            <AddResourceToComponentSlider
                isDrawerOpen    =   {isUploadResource} 
                widget          =   {widget} 
                setIsDrawerOpen =   {setIsUploadResource} 
                template        =   {true} 
                addResource     =   {true}
                component       =   {component}
            />
        </>
    )
}

export default ResourceComponent