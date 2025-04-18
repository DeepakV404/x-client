import { FC, useContext } from 'react';
import { Checkbox, Form, Space } from 'antd';

import { RESOURCE_TYPE_CONFIG } from '../../../pages/library/config/resource-type-config';
import { BuyerGlobalContext } from '../../../buyer-globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import Translate from '../../../components/Translate';

const { useForm }   =   Form;

interface ResourceFilterProps
{
    setFilter       :   (arg0: any) => void;
    onClose         :   () => void;
}

const BuyerResourceFilter: FC<ResourceFilterProps> = (props) => {

    const { setFilter, onClose }     =   props;

    const [form]                            =   useForm();
    
    const { $categories }                   =   useContext(BuyerGlobalContext);

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

            <div className='cm-flex-justify-end'>
                <div className='j-close-wrap cm-cursor-pointer' onClick={() => onClose()}>
                    <MaterialSymbolsRounded font='close' size='22'/>
                </div>
            </div>

            <Form 
                className   =   'j-res-filter-form' 
                layout      =   "vertical" 
                onFinish    =   {onFinish} 
                onChange    =   {onFinish}
                form        =   {form} 
                style       =   {{flexDirection: "column"}}
            >

                <Form.Item name={"categories"} >
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                $categories && $categories.length > 0 ? 
                                    $categories.map((_category: any) => (
                                        <Checkbox className='cm-flex-align-center' key={_category.uuid} value={_category.uuid}><Space className='cm-margin-left5 cm-flex-center'><span className='cm-font-fam500'>{_category.name}</span></Space></Checkbox>
                                    ))
                                :
                                    <div className='cm-light-text cm-font-size12'><Translate i18nKey={"resource.resource-type"}/></div>
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>
                
                <Form.Item label={<Space size={4} className='cm-margin-bottom5 cm-font-fam500 cm-font-size16'><Translate i18nKey={"resource.resource-type"}/></Space>} name={"types"} >
                    <Checkbox.Group >
                        <Space direction='vertical'>
                            {
                                Object.values(RESOURCE_TYPE_CONFIG).map((_assetType) => (
                                    <Checkbox className='cm-flex-align-center' key={_assetType.key} value={_assetType.key}>
                                        <Space className='cm-margin-left5 cm-flex-center'>
                                            <MaterialSymbolsRounded font={_assetType.displayIconName} size='18'/>
                                            <span className='cm-font-fam500'>
                                                <Translate i18nKey={`resources.${_assetType.i18Key}`}/>
                                            </span>
                                        </Space>
                                    </Checkbox>
                                ))
                            }
                        </Space>
                    </Checkbox.Group>
                </Form.Item>

            </Form>
        </div>
    )
}

export default BuyerResourceFilter