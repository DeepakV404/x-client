import { FC } from 'react';
import { Card, Space } from 'antd';

import { ADD_RESOURCE_CONFIG } from '../config/add-resource-config';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

interface AddResourceOptionsProps
{
    setView :   (arg0: string) => void;
}

const AddResourceOptions: FC<AddResourceOptionsProps> = (props) => {

    const { setView }   =   props;

    return (

        <Space align='center' direction='vertical' className='cm-width100 cm-margin-top20 cm-margin-bottom20' size={20}>
            <div className='cm-font-size20 cm-font-fam600'>Upload a resource</div>
            <div className="j-res-upload-options">
                {
                    Object.values(ADD_RESOURCE_CONFIG).map((_addResourceType) => (
                        <Card hoverable className='j-res-upload-option' key={_addResourceType.key} onClick={() => setView(_addResourceType.view)}>
                            <div className='j-res-upload-logo-wrap'>
                                {
                                    _addResourceType.imageIcon ?
                                        <MaterialSymbolsRounded font={_addResourceType.imageIcon} size='50'/>
                                    :
                                        <img src={_addResourceType.imageFile} style={{width: "50px", height: "50px"}}/>
                                }
                            </div>
                            <div className="cm-font-size14 cm-font-fam500 j-res-upload-type">{_addResourceType.displayName}</div>  
                        </Card>
                    ))
                }
            </div>
        </Space>
    )
}

export default AddResourceOptions