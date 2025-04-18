import { FC, useContext } from 'react';
import { Checkbox, Form, Radio, Space } from 'antd';

import { RESOURCE_TYPE_CONFIG } from '../config/resource-type-config';
import { SORT_BY_CONFIG } from '../config/sort-by-config';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { useForm }   =   Form;

interface ResourceFilterProps
{
    setFilter       :   (arg0: any) => void;
    setSortBy       :   (arg0: string) => void;
    initialSortBy   :   string;
}

const ResourceFilter: FC<ResourceFilterProps> = (props) => {

    const { setFilter, setSortBy, initialSortBy }     =   props;

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
        setSortBy(form.getFieldsValue().sortBy)
    }

     
    return (
        <div className='j-resource-filter cm-height100 '>
            <Form 
                className   =   'j-res-filter-form' 
                layout      =   "vertical" 
                onFinish    =   {onFinish} 
                onChange    =   {onFinish}
                form        =   {form} 
                style       =   {{flexDirection: "column"}}
            >
                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Sort By</Space>} name={"sortBy"} initialValue={initialSortBy}>
                    <Radio.Group >
                        <Space direction='vertical'>
                            {
                                Object.values(SORT_BY_CONFIG).map((_sortType) => (
                                    <Radio className='cm-flex-align-center' key={_sortType.key} value={_sortType.key}><Space className='cm-margin-left5 cm-flex-center'><span className='cm-font-fam500'>{_sortType.displayName}</span></Space></Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'>Resource type</Space>} name={"types"} >
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
                    <Checkbox.Group className='cm-margin-bottom20'>
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
        </div>
    )
}

export default ResourceFilter