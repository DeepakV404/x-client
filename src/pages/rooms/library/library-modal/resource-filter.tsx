import { FC, useContext } from 'react';
import { Checkbox, Form, Space } from 'antd';

import { RESOURCE_TYPE_CONFIG } from '../../../library/config/resource-type-config';
import { GlobalContext } from '../../../../globals';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { useForm }   =   Form;

interface ResourceFilterProps
{
    filter?         :   any;
    setFilter       :   (arg0: any) => void;
    hideAdd?        :   boolean;
}

const ResourceFilter: FC<ResourceFilterProps> = (props) => {

    const { filter, setFilter }     =   props;

    const [form]            =   useForm();
    const { $categories }   =   useContext(GlobalContext);
    

    const onFinish = () => {
        const constructFilter = () => {
            let filter: { [key: string]: any } = {}; 

            Object.keys(form.getFieldsValue()).map((_filterItem: any) => {
                _filterItem !== "sortBy" && (filter[_filterItem] = form.getFieldsValue()[_filterItem])
            })
            return filter
        }
        setFilter(constructFilter())
    }

    return (
        <div className='j-resource-filter cm-height100'>
            <Form 
                className   =   'j-res-filter-form' 
                layout      =   "vertical" 
                onFinish    =   {onFinish} 
                onChange    =   {onFinish}
                form        =   {form} 
                style       =   {{flexDirection: "column"}}
            >

                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Resource type</Space>} name={"types"} initialValue={filter?.types}>
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                Object.values(RESOURCE_TYPE_CONFIG).map((_assetType) => (
                                    <Checkbox className='cm-flex-align-center' key={_assetType.key} value={_assetType.key}><Space className='cm-margin-left5 cm-flex-center'><MaterialSymbolsRounded font={_assetType.displayIconName} size='18'/><span className='cm-font-fam500'>{_assetType.displayName}</span></Space></Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Category</Space>} name={"categories"} >
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                $categories.map((_category: any) => (
                                    <Checkbox className='cm-flex-align-center' key={_category.uuid} value={_category.uuid}><Space className='cm-margin-left5 cm-flex-center'><span className='cm-font-fam500'>{_category.name}</span></Space></Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
            {/* <ResourceModal
                isOpen      =   {isModalOpen.isOpen}
                onClose     =   {() => setIsModalOpen({isOpen: false, type: "", key: ""})}
                type        =   {isModalOpen.type}
                uploadKey   =   {isModalOpen.key}
            /> */}
        </div>
    )
}

export default ResourceFilter