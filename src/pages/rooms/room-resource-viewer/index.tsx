import { useRef } from "react";
import { useQuery } from "@apollo/client";
import { Avatar, Card, Col, List, Row, Space, Statistic } from "antd";

import { DOCS, IMAGE, LINK, VIDEO } from "../../library/config/resource-type-config";
import { OFFICE_FILES } from "../../../constants/module-constants";
import { CommonUtil } from "../../../utils/common-util";
import { ROOM_RESOURCE } from "../api/rooms-query";

import FileViewer from "../../../components/file-viewer";
import Loading from "../../../utils/loading";
import ReactPlayer from "react-player";

const RoomResourceViewerLayout = (props: {inProduct? : boolean, roomId: string, resourceId: string}) => {

    const { roomId, resourceId, inProduct=true }    =   props;

    const fileViewerRef             =   useRef();

    const { data, loading, error }  =   useQuery(ROOM_RESOURCE, {
        variables: {
            roomUuid: roomId,
            resourceUuid: resourceId
        },
        fetchPolicy: "network-only"
    });

    if(loading) return <div style={{height: "calc(100vh - 90px)"}}><Loading/></div>
    if(error) return <div>Something went wrong...</div>

    let $fileInfo   =   data._rResource;
    let $report     =   data._rResource.report;

    const getViewerByFileType = (fileInfo: any) => {
        if(fileInfo.type === DOCS){
            if(OFFICE_FILES.includes(fileInfo.content.type)){
                return <iframe width="100%" height="100%" src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileInfo.content.url)}`} style={{borderRadius: "8px"}} frameBorder={0}></iframe>

            }else{
                return(
                    <div className='j-doc-layout'>
                        <FileViewer inProduct={inProduct} fileUrl={fileInfo.content.url} fileViewerRef={fileViewerRef} fileId={fileInfo._id} track={false}/>
                    </div>
                )
            }
        }else if(fileInfo.type === IMAGE){
            return (
                <div className="cm-height100 cm-width100 cm-flex-center">
                    <img src={fileInfo.content.url} alt={fileInfo.title} className={inProduct ? "j-room-res-image" : ""}/>
                </div>
            )
        }else if(fileInfo.type === LINK || fileInfo.type === VIDEO){
            return (
                <div className="cm-flex-center cm-height100 cm-width100 ">
                    <ReactPlayer 
                        className   =   "cm-aspect-ratio16-9" 
                        width       =   "100%"
                        height      =   "100%"
                        controls    =   {true}
                        url         =   {$fileInfo.content.url}
                        loop        =   {false}
                        config      =   {{
                            youtube: {
                                playerVars: { autoplay: 0 }
                            },
                        }}
                    />
                </div>
            )
        }else{
            return <div>File type not supported</div>
        }
    }

    return (
        <Row gutter={20} className="cm-height100">
            <Col span={16} className="cm-height100">
                {
                    getViewerByFileType($fileInfo)
                }
            </Col>
            <Col span={8} style={{height: inProduct ? "calc(100vh - 90px)" : "calc(100vh - 40px)", overflow: "auto"}}>
                <Space direction='vertical' size={inProduct ? 4 : 0} className={inProduct ? 'cm-margin-bottom20' : 'cm-margin-bottom5'}>
                    <div className={inProduct ? 'cm-light-text cm-font-size12' : 'cm-light-text cm-font-size10'}>File Name</div>
                    <div className={inProduct ? 'cm-font-fam500' : 'cm-font-fam500 cm-font-size12'}>{$fileInfo.title}</div>
                </Space>
                <Row gutter={inProduct ? [20, 20] : [10, 5]} className={inProduct ? '' : "cm-margin0"}>
                    <Col span={24} className={inProduct ? '' : "cm-padding-left0"}>
                        <Card className={inProduct ? '' : ''}>
                            <Statistic
                                title       =   {<div className={inProduct ? "" : "cm-font-size11"}>Total Time Spent</div>}
                                value       =   {$report.timeSpent ? `${CommonUtil.__getFormatDuration($report.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`: "0"}
                                precision   =   {0}
                                valueStyle  =   {{ color: '#000', fontSize: inProduct ? "22px" : "15px" }}
                                className   =   "cm-font-fam500"
                            />
                        </Card>
                    </Col>
                    <Col span={12} className={inProduct ? '' : "cm-padding-left0"}>
                        <Card className={inProduct ? '' : ''}>
                            <Statistic
                                title       =   {<div className={inProduct ? "" : "cm-font-size11"}>Views</div>}
                                value       =   {$report.views}
                                precision   =   {0}
                                valueStyle  =   {{ color: '#000', fontSize: inProduct ? "22px" : "15px" }}
                                className   =   "cm-font-fam500"
                            />
                        </Card>
                    </Col>
                    <Col span={12} className={inProduct ? '' : "cm-padding-left0"}>
                        <Card className={inProduct ? '' : ''}>
                            <Statistic
                                title       =   {<div className={inProduct ? "" : "cm-font-size11"}>Unique Views</div>}
                                value       =   {$report.uniqueViews}
                                precision   =   {0}
                                valueStyle  =   {{ color: '#000', fontSize: inProduct ? "22px" : "15px" }}
                                className   =   "cm-font-fam500"
                            />
                        </Card>
                    </Col>
                    <Col span={24} className={inProduct ? '' : "cm-padding-left0"}>
                        <Card className={inProduct ? '' : ''}>
                            <Statistic
                                title       =   {<div className={inProduct ? "" : "cm-font-size11"}>Last viewed at</div>}
                                value       =   {$report.lastViewedAt ? `${CommonUtil.__getDateDay(new Date($report.lastViewedAt))}, ${new Date($report.lastViewedAt).getFullYear()} - ${CommonUtil.__format_AM_PM(new Date($report.lastViewedAt))}` : "-"}
                                precision   =   {2}
                                valueStyle  =   {{ color: '#000', fontSize: inProduct ? "22px" : "15px" }}
                                className   =   "cm-font-fam500"
                            />
                        </Card>
                    </Col>
                    <Col span={24} className={inProduct ? '' : "cm-padding-left0"}>
                        <div className={inProduct ? "cm-font-fam500 cm-margin-bottom10" : "cm-font-fam500 cm-margin-bottom5 cm-font-size12"}>Viewed By</div>
                        {
                            $report.viewDetails.length > 0 && $report.timeSpent > 0 ?
                                <List
                                    bordered
                                    itemLayout  =   "horizontal"
                                    className   =   {inProduct ? '' : ''}
                                    dataSource  =   {$report.viewDetails}
                                    renderItem  =   {(_item: any) => (
                                        <List.Item>
                                            <Space className="cm-width100 cm-flex-space-between">
                                                <Statistic
                                                    title       =   {<div className={inProduct ? "cm-font-size12" : "cm-font-size11"}>Time spent</div>}
                                                    value       =   {_item.timeSpent ? `${CommonUtil.__getFormatDuration(_item.timeSpent).map((_stamp: any) => `${_stamp.value} ${_stamp.unit}`).join(" ")}`: "0"}
                                                    precision   =   {2}
                                                    valueStyle  =   {{ color: '#000', fontSize: inProduct ? "20px" : "12px" }}
                                                    className   =   "cm-font-fam500"
                                                />
                                                <Space size={inProduct ? 10 : 3}>
                                                    <Space direction="vertical" size={0} align="end">
                                                        <div  className={inProduct ? "cm-font-fam500" : "cm-font-size11"}>{CommonUtil.__getFullName(_item.viewer.firstName, _item.viewer.lastName)}</div>
                                                        {
                                                            inProduct ? 
                                                                <div className="cm-font-size12">{_item.viewer.emailId}</div>
                                                            :
                                                                null
                                                        }
                                                    </Space>
                                                    <Avatar size={inProduct ? 40 : 20} shape='square' style = {{backgroundColor: "#ededed", color: "#000", fontSize: inProduct ? "15px" : "10px", display: "flex" }} src={_item.viewer.profileUrl ? <img src={_item.viewer.profileUrl} alt={CommonUtil.__getFullName(_item.viewer.firstName, _item.viewer.lastName)}/> : ""}>
                                                        {CommonUtil.__getAvatarName(CommonUtil.__getFullName(_item.viewer.firstName, _item.viewer.lastName),1)}
                                                    </Avatar>
                                                </Space>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            :
                                <div className="cm-font-fam500 cm-font-size22">-</div>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default RoomResourceViewerLayout