import { FC } from 'react';
import { Card, Col, Form, Input, Row, Space, Typography } from 'antd';

import { CommonUtil } from '../../../../utils/common-util';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { Text }      =   Typography;

interface UploadedFileProps
{
    _file               :   any;
    onRemove            :   (arg0: string) => void
    fileNameEditable?    :   boolean
}

const UploadedFile: FC<UploadedFileProps> = (props) => {

    const { _file, onRemove, fileNameEditable } =   props;

    return (
        <Card key={_file.uid} className='' onClick={(event) => event.stopPropagation()}>
            <Row align="middle" gutter={20}>
                <Col span={12} className="cm-flex">
                    <Space direction='vertical' align='start' size={0}>
                        <Text style={{maxWidth: "500px"}} ellipsis={{tooltip: _file.name}} className='cm-font-size14 cm-font-fam400'>{_file.name}</Text>
                        <div className='cm-light-text cm-font-fam400 cm-font-size10'>(Size: {CommonUtil.__getFileSize(_file, 2)})</div>
                    </Space>
                </Col>
                {fileNameEditable 
                    && 
                    <Col span={11} className="cm-flex">
                        <Form.Item name={[_file.uid, "title"]} className="cm-width100 cm-margin0" initialValue={_file.name} rules={[{required: true, message: ""}]}>
                            <Input placeholder='eg: sample.pdf' id={`${_file.uid}title`} allowClear/>
                        </Form.Item>
                    </Col>
                }
                <Col span={12} className="cm-flex-justify-end">
                    <MaterialSymbolsRounded font={'delete'} size={'18'} className='cm-cursor-pointer' onClick={() => onRemove(_file.uid)}/>
                </Col>
            </Row> 
        </Card>
    )
}

export default UploadedFile