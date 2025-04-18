import { FC, useState } from 'react';
import { Button, Card, Form, Input, Space, Typography } from 'antd';

import { BOOK_MEETING } from '../../../../buyer-view/pages/journey/config/action-point-type-config';
import { RoomTemplateAgent } from '../../../templates/api/room-template-agent';
import { ERROR_CONFIG } from '../../../../config/error-config';
import { CommonUtil } from '../../../../utils/common-util';

import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';

const { Text }      =   Typography;
const { useForm }   =   Form;

interface GoToUrlProps
{
    type                    :   string;
    actionId                :   string;
    createdStakeholderType  :   string;
    defaultActionData       :   any;
}

const GoToUrl: FC<GoToUrlProps> = (props) => {

    const { type, actionId, defaultActionData }    =   props;

    const [form]    =   useForm();

    const [urlData, setUrlData] =   useState(defaultActionData?.link);

    const handleUrlInputChange = (event: any) => {
        setUrlData(event.target.value)
    }

    const onFinish = () => {
        RoomTemplateAgent.updateActionPoint({
            variables: {
                actionPointUuid     :   actionId,
                input               :   {
                    actionPointData :   {
                        link    :   urlData
                    }
                }
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Link updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const handleCardClick = () => {
        if(urlData){
            window.open(urlData, '_blank');
        }
    }

    const getPlaceHolder = () => {
        return type === BOOK_MEETING ? "Paste a calendar Link" : "Paste a Link";
    }

    return (
        <Space direction='vertical' className='cm-width100' size={15}>
            <Form form={form} onFinish={onFinish} >
                <Form.Item name={"url"} noStyle rules={[{required: true, message: "", whitespace: true}]} initialValue={urlData}>
                    <Input allowClear placeholder={getPlaceHolder()} prefix={<MaterialSymbolsRounded font="link" size="20"/>} onChange={handleUrlInputChange}/>
                </Form.Item>
            </Form>
            <Card className="j-action-download-card" hoverable={urlData ? true : false} onClick={handleCardClick}>
                <Space className="cm-flex-space-between">
                    <Text className="j-action-text cm-font-size14 cm-font-fam400" ellipsis={{tooltip: urlData}} style={{maxWidth: "300px"}}>{urlData ? urlData : getPlaceHolder()}</Text>
                    <MaterialSymbolsRounded font="link" size="22" className="cm-cursor-pointer"/>
                </Space>
            </Card>
            {
                defaultActionData?.link !== urlData &&
                    <Button size='small' type='primary' onClick={() => form.submit()}>Save</Button>
            }
        </Space>
    )
}

export default GoToUrl