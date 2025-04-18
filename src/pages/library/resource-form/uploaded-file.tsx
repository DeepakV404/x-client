import { FC, useContext, useState } from 'react';
import { Card, Form, Input, Select, Space, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';

import { ACCEPTED_PROFILE_IMAGE_FILE_TYPES } from '../../../constants/module-constants';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Option }    =   Select; 
interface UploadedFileProps
{
    _file                   :   any;
    onRemove                :   (arg0: string) => void,
}

const UploadedFile: FC<UploadedFileProps> = (props) => {
    
    const { _file, onRemove } =   props;
    const { $categories }   =   useContext(GlobalContext);

    const [imageUrl, setImageUrl]   =   useState<string>("");
    const [setThumbnail]            =   useState<any>();

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleThumbnailChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        
        getBase64(info.fileList[info.fileList.length - 1].originFileObj as RcFile, (url) => {
            setImageUrl(url);
        });
        setThumbnail(info.file);    
    };

    return (
        <Card key={_file.uid} className='j-res-uploaded-file' onClick={(event) => event.stopPropagation()}>
            <div className='cm-flex'>
                <div className='cm-upload-file-slider cm-flex'>
                <Form.Item name={[_file.uid, "thumbnail"]} className="cm-width100 cm-margin0" initialValue={_file.name} rules={[{required: true, message: "title required"}]}>
                    <Upload
                        name            =   "avatar"
                        listType        =   "picture-card"
                        showUploadList  =   {false}
                        onChange        =   {handleThumbnailChange}
                        accept          =   {ACCEPTED_PROFILE_IMAGE_FILE_TYPES}
                        multiple        =   {false}
                        className       =   'cm-margin-right5 j-resource-thumnail-upload-wrapper'
                    >
                        <div className='j-thumbnail-upload-icon'>
                            <MaterialSymbolsRounded font='upload' size='29'/>
                        </div>
                        {imageUrl ? <img src={imageUrl} alt="logo"height={70} width={70} className="cm-border cm-border-radius8 cm-object-fit-scale-down" /> : <MaterialSymbolsRounded font="add_photo_alternate" /> }
                    </Upload> 
                </Form.Item>

                </div>
                <Space className='cm-flex-align-center cm-width100 cm-flex-space-between' size={50}>
                    <Space className='cm-flex' direction='vertical' size={10}>
                        <div className='cm-flex-align-center'>
                            <Form.Item name={[_file.uid, "title"]} className="cm-margin0 cm-width100" initialValue={_file.name.split(".").slice(0, -1).join(".")} rules={[{required: true, message: "Resource name is required"}]}>
                                <Input style={{width: "300px", paddingInline: "0px"}} placeholder='eg: sample.pdf' id={`${_file.uid}title`} allowClear bordered={false} autoFocus/>
                            </Form.Item>
                        </div>
                        <Form.Item name={[_file.uid, "categories"]} className="cm-width100 cm-margin0">
                            <Select 
                                showSearch
                                allowClear
                                optionFilterProp    =   "children"
                                style               =   {{width: "300px"}}
                                id                  =   {`${_file.uid}category`} 
                                className           =   "cm-width100 cm-select" 
                                placeholder         =   "Select category" 
                                mode                =   'multiple'
                                maxTagCount         =   {2}
                                maxTagPlaceholder   =   {(omittedValues) => `+${omittedValues.length} more`}
                                suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                            >
                                {$categories?.map((_category: any) => (
                                    <Option value={_category.uuid} key={_category.uuid} >{_category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Space>
                    <Space direction='vertical' align='end' size={20}>
                        <MaterialSymbolsRounded font={'delete'} size={'16'} className='cm-cursor-pointer' onClick={() => onRemove(_file.uid)} color='#df2122'/>
                        <div className='cm-light-text cm-font-fam400 cm-font-size13 cm-whitespace-nowrap cm-flex-center'>{CommonUtil.__getFileSize(_file, 2)}</div>
                    </Space>
                </Space>
            </div>
        </Card>
    )
}

export default UploadedFile