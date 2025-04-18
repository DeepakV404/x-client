import { FC, useState } from "react";
import { Button, Card, Form, Input, Radio, Space, Typography, Upload } from "antd";

import { RoomTemplateAgent } from "../../../templates/api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { ACCEPTED_FILE_TYPES, BUYER } from "../../../../constants/module-constants";
import { CommonUtil } from "../../../../utils/common-util";

import VideoPlayerModal from "../../../../components/video-player/video-player-modal";
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Text }      =   Typography;
const { Dragger }   =   Upload;
const { useForm }   =   Form;

interface ViewVideoProps
{
    actionId                :   string;
    createdStakeholderType  :   string;
    defaultActionData       :   any;
}

const ViewVideo: FC<ViewVideoProps> = (props) => {

    const { actionId, defaultActionData, createdStakeholderType } =   props;

    const [form]    =   useForm();


    const [currentType, setCurrentType] =   useState("url");
    const [showPlayer, setShowPlayer]   =   useState(false);

    const handleCardClick = () => {
        setShowPlayer(true)
    }

    const handleVideoUploadChange = (event: any) => {
        setCurrentType(event.target.value)
    }

    const onFinish = (values: any) => {
        RoomTemplateAgent.updateActionPoint({
            variables: {
                actionPointUuid :   actionId,
                input           :   {
                    actionPointData :   {
                        link :   values.url
                    }
                },
            },
            onCompletion: () => {
                CommonUtil.__showSuccess("Video URL updated successfully")
            },
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }   
        })
    }

    const getUploadVideoAction = () => {
        return (
            <Radio.Group buttonStyle="outline" onChange={handleVideoUploadChange} className="cm-cursor-pointer" defaultValue={currentType}>
                <Radio.Button value="url" ><div className="cm-flex-center">Add video URL</div></Radio.Button>
                <Radio.Button value="upload" ><div className="cm-flex-center">Upload Video</div></Radio.Button>
            </Radio.Group>
        )
    }

    return (
        <>
            <Space direction="vertical" className="cm-width100" size={15}>
                {
                    createdStakeholderType === BUYER && getUploadVideoAction()
                }
                {
                    currentType === "url"
                    ?
                        <Form form={form} onFinish={onFinish} >
                            <Form.Item name={"url"} noStyle rules={[{required: true, message: "", whitespace: true}]} initialValue={defaultActionData?.link}>
                                <Input allowClear placeholder={"Add a video Link"} prefix={<MaterialSymbolsRounded font="link" size="20"/>} />
                            </Form.Item>
                        </Form>
                    :
                        <Dragger beforeUpload={()=> {return false}} showUploadList={false} accept={ACCEPTED_FILE_TYPES}>
                            <Space direction="vertical" size={10}>
                                <div><MaterialSymbolsRounded font="inbox"/></div>
                                    <div>Click or drag file to this area to upload</div>
                            </Space>
                        </Dragger>
                }
                {
                    defaultActionData?.link && 
                        <Card className="j-action-download-card" hoverable={defaultActionData?.link ? true : false} onClick={defaultActionData?.link ? () => handleCardClick() : () => {}}>
                            <Space className="cm-flex-space-between">
                                <Text className="j-action-text cm-font-size14 cm-font-fam400" ellipsis={{tooltip: defaultActionData?.link }} style={{maxWidth: "330px"}}>{defaultActionData?.link  ? defaultActionData.link  : "Add a video URL"}</Text>
                                <MaterialSymbolsRounded font="smart_display" size="22" className="cm-cursor-pointer"/>
                            </Space>
                        </Card>
                }
                <Button size='small' type='primary' onClick={() => form.submit()}>Save</Button>
            </Space>
            <VideoPlayerModal isOpen={showPlayer} onClose={() => setShowPlayer(false)} videoUrl={defaultActionData?.link}/>
        </>
    )
}

export default ViewVideo