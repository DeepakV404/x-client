import { FC, useContext } from 'react';
import { Card, Col, Form, Input, Row, Select, Space, Typography } from 'antd';

import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const { Option }    =   Select;
const { Text }      =   Typography;

interface UploadedFileProps
{
    _file       :   any;
    onRemove    :   (arg0: string) => void
}

const UploadedFile: FC<UploadedFileProps> = (props) => {

    const { _file, onRemove } =   props;

    const { $categories }   =   useContext(GlobalContext);

    return (
        <Card key={_file.uid} className='j-res-uploaded-file' onClick={(event) => event.stopPropagation()}>
            <Row align="middle" gutter={20}>
                <Col span={8} className="cm-flex">
                    <Space>
                        <MaterialSymbolsRounded font={'picture_as_pdf'}/>
                        <Space direction='vertical' align='start' size={0}>
                            <Text style={{maxWidth: "180px"}} ellipsis={{tooltip: _file.name}} className='cm-font-size14 cm-font-fam400'>{_file.name.split(".").slice(0, -1).join(".")}</Text>
                            <div className='cm-light-text cm-font-fam400 cm-font-size10'>(Size: {CommonUtil.__getFileSize(_file, 2)})</div>
                        </Space>
                    </Space>
                </Col>
                <Col span={8} className="cm-flex">
                    <Form.Item name={[_file.uid, "title"]} className="cm-width100 cm-margin0" initialValue={_file.name} rules={[{required: true, message: ""}]}>
                        <Input placeholder='eg: sample.pdf' id={`${_file.uid}title`} allowClear/>
                    </Form.Item>
                </Col>
                <Col span={7} className="cm-flex-justify-end">
                    <Form.Item name={[_file.uid, "categories"]} className="cm-width100 cm-margin0">
                        <Select 
                            showSearch
                            allowClear
                            optionFilterProp    =   "children"
                            id                  =   {`${_file.uid}category`} 
                            className           =   "cm-width100 cm-select" 
                            placeholder         =   "Select category" 
                            mode                =   'multiple'
                            maxTagCount         =   {1}
                            maxTagPlaceholder   =   {(omittedValues) => `+${omittedValues.length} more`}
                            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18"/>}
                        >
                            {$categories?.map((_category: any) => (
                                <Option value={_category.uuid} key={_category.uuid} >{_category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={1} className="cm-flex-justify-end">
                    <MaterialSymbolsRounded font={'delete'} size={'18'} className='cm-cursor-pointer' onClick={() => onRemove(_file.uid)}/>
                </Col>
            </Row> 
        </Card>
    )
}

export default UploadedFile