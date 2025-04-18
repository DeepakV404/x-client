import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Space, Form, Input, Button, Divider, Popconfirm, Typography, message, Image } from "antd";

import { DOWNLOAD, VIEW_DOCUMENT, WATCH_VIDEO } from "../../../buyer-view/pages/journey/config/action-point-type-config";
import { Length_Input } from "../../../constants/module-constants";
import { LibraryAgent } from "../../library/api/library-agent";
import { ERROR_CONFIG } from "../../../config/error-config";
import { CommonUtil } from "../../../utils/common-util";
import { RoomsAgent } from "../api/rooms-agent";
import { ActionPointViewContext } from ".";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import AnalyticsResourceViewerModal from "../../../components/analytics-resource-viewer";

const { useForm } = Form;
const { Text } = Typography;

const ActionEditResource = (_resource: any) => {

    const [form] = useForm();
    const { roomId } = useParams();
    const { actionPoint, refetch } = useContext(ActionPointViewContext);

    const actionType = actionPoint.type;

    const [editView, setEditView] = useState(false);
    const [resourceAnalytics, setResourceAnalytics] = useState({
        isOpen: false,
        resource: null
    })

    const removeResourceActionPoint = (resourceId: string) => {
        const messageLoading = message.loading("Removing resource...");
        RoomsAgent.removeResourceInActionPoint({
            variables: {
                actionPointUuid: actionPoint.uuid,
                resourceUuid: resourceId
            },
            onCompletion: () => {
                messageLoading()
                refetch()
                CommonUtil.__showSuccess("Action point updated successfully")
            },
            errorCallBack: (error: any) => {
                messageLoading()
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    const updateResource = (resourceId: string) => {

        let values = form.getFieldsValue().title;

        if (!values.trim()) {
            CommonUtil.__showError("Resource cannot be empty");
        }
        else {
            let input: any = {
                resourceUuid: resourceId,
                title: values,
            }

            LibraryAgent.updateResourceInfo({
                variables: input,
                onCompletion: () => {
                    setEditView(false)
                    CommonUtil.__showSuccess("Resource edited successfully")
                },
                errorCallBack: (error: any) => {
                    CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
                }
            })
        }
    }

    const handleEnter = (event: any) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
            form.submit()
        }
    }

    const formatDuration = (duration: number) => {
        const formattedDuration = CommonUtil.__getFormatDuration(duration);

        if (formattedDuration && formattedDuration.length > 0) {
            const { value, unit } = formattedDuration[0];
            if (value > 0) {
                return `${value} ${unit}`;
            } else {
                return unit;
            }
        }
    }

    return (
        <>
            <Card key={_resource.uuid} className='j-ap-uploaded-file cm-cursor-pointer' hoverable onClick={(event) => { event.stopPropagation(); setResourceAnalytics({ isOpen: true, resource: _resource }) }}>
                <Space className="cm-flex-space-between" style={{ minHeight: "65px" }}>
                    <Space className='cm-flex-align-center'>
                        <Image className='j-ap-resource-thumbnail' preview={false} width={80} height={60} src={_resource.content.thumbnailUrl ? _resource.content.thumbnailUrl : CommonUtil.__getResourceFallbackImage(_resource.content.type)} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = CommonUtil.__getResourceFallbackImage(_resource.content.type) }} />
                        <div className="cm-flex cm-flex-direction-column">
                            {
                                editView
                                    ?
                                    <Form form={form} className="cm-form cm-width100 cm-flex-align-center" onClick={(event) => event.stopPropagation()}>
                                        <Space>
                                            <Form.Item noStyle initialValue={_resource.title} name={"title"}>
                                                <Input maxLength={Length_Input} className="j-res-name-edit-input cm-font-fam500 cm-font-size16" placeholder="Untitled" onKeyDown={handleEnter} />
                                            </Form.Item>
                                            <Form.Item noStyle initialValue={_resource.uuid} name={"id"} hidden>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item noStyle>
                                                <Button size='small' type="primary" onClick={() => updateResource(_resource.uuid)}>
                                                    <div className='cm-font-size12'>Save</div>
                                                </Button>
                                            </Form.Item>
                                            <Form.Item noStyle>
                                                <Button className="cm-no-border-button" type="primary" size='small' ghost onClick={() => setEditView(false)}>
                                                    <div className='cm-font-size12'>Cancel</div>
                                                </Button>
                                            </Form.Item>
                                        </Space>
                                    </Form>
                                    :
                                    <Text style={{ maxWidth: "350px", height: "30px" }} ellipsis={{ tooltip: _resource.title }} className='cm-flex-align-center cm-font-size13 cm-font-fam400'>{_resource.title}</Text>
                            }
                            {
                                actionType === DOWNLOAD || actionType === VIEW_DOCUMENT || actionType === WATCH_VIDEO ?
                                    <Space>
                                        {
                                            actionType === VIEW_DOCUMENT || actionType === WATCH_VIDEO ?
                                                <Space>
                                                    <MaterialSymbolsRounded font="timer" size="15" />
                                                    <span className='cm-font-fam500 cm-font-size12'>{_resource.report.timeSpent ? `${formatDuration(_resource.report.timeSpent)}` : "0"}</span>
                                                </Space>
                                                :
                                                <Space>
                                                    <span className='cm-font-size11'>Downloads : </span>
                                                    <span className='cm-font-fam500 cm-font-size12'>{_resource.report.downloadCount}</span>
                                                </Space>
                                        }
                                        {
                                            actionType !== DOWNLOAD &&
                                            <>
                                                <Divider type="vertical" style={{ backgroundColor: "#e4e4e4" }} />
                                                <Space className="cm-flex-center">
                                                    <MaterialSymbolsRounded font="visibility" size="17" />
                                                    <span className='cm-font-fam500 cm-font-size12'>{_resource.report.uniqueViews}</span>
                                                </Space>
                                                <Divider type="vertical" style={{ backgroundColor: "#e4e4e4" }} />
                                                <Space>
                                                    <span className='cm-font-size11'>Last viewed : </span>
                                                    <span className='cm-font-fam500 cm-font-size12'>{_resource.report.lastViewedAt ? `${CommonUtil.__getDateDay(new Date(_resource.report.lastViewedAt))}, ${new Date(_resource.report.lastViewedAt).getFullYear()} - ${CommonUtil.__format_AM_PM(new Date(_resource.report.lastViewedAt))}` : "-"}</span>
                                                </Space>
                                            </>
                                        }
                                    </Space>
                                    :
                                    null
                            }
                        </div>
                    </Space>
                    <Space className='cm-flex' size={15} onClick={(event) => event.stopPropagation()}>
                        {_resource.resourceOrigin !== "LIBRARY" && <MaterialSymbolsRounded font="edit" size="16" className="cm-cursor-pointer" onClick={() => setEditView(true)} />}
                        <MaterialSymbolsRounded font={'download'} size={'18'} className='cm-cursor-pointer' onClick={(event: any) => { event?.stopPropagation(); window.open(_resource.content.downloadableUrl ? _resource.content.downloadableUrl : _resource.content.url, "_blank") }} />
                        <Popconfirm
                            placement="left"
                            title={<div className="cm-font-fam500">Remove resource</div>}
                            description={<div className="cm-font-size13">Are you sure you want to remove this resource?</div>}
                            icon={null}
                            okButtonProps={{ style: { fontSize: "12px", color: "#fff !important", boxShadow: "0 0 0" }, danger: true }}
                            cancelButtonProps={{ style: { fontSize: "12px" }, danger: true, ghost: true }}
                            okText={"Remove"}
                            onConfirm={() => removeResourceActionPoint(_resource.uuid)}
                        >
                            <MaterialSymbolsRounded font={'delete'} size={'18'} color="#DF2222" className='cm-cursor-pointer' />
                        </Popconfirm>
                    </Space>
                </Space>
            </Card>
            <AnalyticsResourceViewerModal module={{ "type": "room", "roomId": roomId ?? "" }} isOpen={resourceAnalytics.isOpen} onClose={() => setResourceAnalytics({ isOpen: false, resource: null })} resource={resourceAnalytics.resource} />
        </>
    )
}

export default ActionEditResource