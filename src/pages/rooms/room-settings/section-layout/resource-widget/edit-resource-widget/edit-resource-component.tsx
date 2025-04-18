import { useRef } from 'react';
import { Collapse, Form, Space, Switch } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';

import MaterialSymbolsRounded from '../../../../../../components/MaterialSymbolsRounded';
import SectionResourceUpload from '../section-resource-upload';

const { useForm }   =   Form;

const EditResourceComponent = (props: { component: any, widget: any }) => {

    const { component, widget } =   props;

    const [form]                =   useForm();
    const resourceRef: any      =   useRef();

    const __resourcePropertyMap         =   {...component.content.resource};

    return (
        <Form form={form} className="cm-form cm-width100" layout='vertical'>
            <Space direction='vertical' className='cm-width100' size={10}>
                <Collapse
                    defaultActiveKey    =   {["resource"]}
                    expandIcon          =   {({ isActive }) => isActive ? <MaterialSymbolsRounded font="keyboard_arrow_down" size="22" color="#000000e0"/> : <MaterialSymbolsRounded font="keyboard_arrow_right" size="22" color="#000000e0"/> }
                >
                    <CollapsePanel 
                        className       =   'j-contact-card-edit-property-wrapper' 
                        key             =   {"resource"} 
                        header          =   {
                            <div className="cm-width100 cm-flex-space-between cm-flex-align-center">
                                Resource
                                <div className="cm-flex-align-center" style={{columnGap: "10px"}}>
                                    <Switch 
                                        size            =   'small' 
                                        defaultValue    =   {__resourcePropertyMap.enabled} 
                                        disabled        =   {__resourcePropertyMap.required} 
                                        onChange        =   {(_: boolean, event: any) => event.stopPropagation()}
                                    />
                                </div>
                            </div>
                        } 
                    >
                        <SectionResourceUpload 
                            demoRef         =   {resourceRef} 
                            resource        =   {__resourcePropertyMap} 
                            widget          =   {widget} 
                            carousel        =   {false} 
                            component       =   {component}
                            setIsDrawerOpen =   {() => {}}
                        />
                    </CollapsePanel>
                </Collapse>
            </Space>
        </Form>
    )
}

export default EditResourceComponent