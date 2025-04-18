import { FC, useState } from 'react';
import { Button, Card, Col, Modal, Row, Space, Typography } from 'antd';

import { useBuyerResourceViewer } from '../../../../custom-hooks/resource-viewer-hook';
import { BOOK_MEETING } from '../config/action-point-type-config';
import { CommonUtil } from '../../../../utils/common-util';
import { capitalize }  from 'lodash';
import { BuyerAgent } from '../../../api/buyer-agent';

import BuyerResourceViewerModal from '../../resource-viewer/buyer-resource-viewer-modal';
import MaterialSymbolsRounded from '../../../../components/MaterialSymbolsRounded';
import useLocalization from '../../../../custom-hooks/use-translation-hook';
import Translate from '../../../../components/Translate';

const { Text }      =   Typography;

interface GoToUrlProps
{
    type                    :   string;
    actionPoint             :   any;
}

const GoToUrl: FC<GoToUrlProps> = (props) => {
    
    const {type, actionPoint }       =   props;    

    const { translate }         =   useLocalization();

    const { viewResourceProp, handleResourceOnClick }   =   useBuyerResourceViewer();

    const [copy, setCopy]                   = useState({
        meetingLink: false,
        meetingJoinLink: false,
        resourceLink: false,
    });
    const [showMessage, setShowMessage]     =   useState({
        isModalOpen     :       false,
        dataToShow      :       ""
    });


    const copyLink = (link: string, type: string) => {
        window.navigator.clipboard.writeText(link);
        setCopy(prevState => ({ ...prevState, [type]: true }));
        setTimeout(() => {
            setCopy(prevState => ({ ...prevState, [type]: false }));
        }, 2000);
    }

    const handleLinkClick = (resourceInfo: any) => {
        BuyerAgent.trackEvent({
            variables: {
                input: {
                    resourceUuid: resourceInfo._id,
                    isViewed: true
                }
            },
            onCompletion: () => {
                window.open(!resourceInfo.content.url.startsWith('http') ? `https://${resourceInfo.content.url}` : resourceInfo.content.url, '_blank');
            },
            errorCallBack: () => {
                window.open(!resourceInfo.content.url.startsWith('http') ? `https://${resourceInfo.content.url}` : resourceInfo.content.url, '_blank');
            }
        })
    }

    const UploadFile = (_file: any) => {        
        return (
            <Card key={_file.uuid} className='j-ap-uploaded-file' onClick={(event) => {event.stopPropagation(); handleResourceOnClick(_file)}} hoverable>
                <Space className='cm-flex-space-between'>
                    <Space className='cm-flex'>
                        <MaterialSymbolsRounded font={'movie'}/>
                        <Text style={{maxWidth: type !== "BOOK_MEETING" ? "240px" : "270px"}} ellipsis={{tooltip: _file.title}} className='cm-font-size14 cm-font-fam400'>{_file.title}</Text> 
                    </Space>
                    {type !== "BOOK_MEETING" && <MaterialSymbolsRounded font="download" size='20' onClick={(e) => {e.stopPropagation(); window.open(_file.content.downloadableUrl)}}/>}
                </Space>
            </Card>
        )
    }

    return (
        <>
            <Space direction='vertical' className='cm-width100' size={15}>
                {
                    actionPoint.type === BOOK_MEETING ?
                        <>
                            <Row>
                                <Col span={12}>
                                    <span style={{opacity: "65%"}} className="cm-font-size13"><Translate i18nKey={"common-labels.calendar-details"}/></span>
                                </Col>
                                <Col span={12} className='cm-width100'>
                                    <Space className='cm-width100'>
                                        <Space className='cm-width100 cm-position-relative' direction='vertical'>
                                            <div className='hover-item'>
                                                <Button className="cm-font-size12 hover-item" size="small" type="primary" icon={<MaterialSymbolsRounded font="calendar_month" size="16"/>} onClick={()=> window.open(actionPoint.meetingLink, "_blank")} disabled={!actionPoint.meetingLink}><Translate i18nKey={"step.book-meeting"}/></Button>
                                                <div className='cm-position-absolute show-on-hover-icon' style={{top: "0px", right: "-20px"}}>{ actionPoint?.meetingLink && <MaterialSymbolsRounded className='cm-cursor-pointer' font={copy.meetingLink ? "done" : "content_copy"} onClick={() => copyLink(actionPoint.meetingLink, 'meetingLink')} size='18'/> }</div>
                                            </div>
                                            <Button className="cm-font-size12" type="primary" ghost style={{width: "100%"}} size="small" onClick={() => setShowMessage({isModalOpen: true, dataToShow: "agenda"})} disabled={!actionPoint.meetingNotes}><Translate i18nKey={"common-labels.view-agenda"}/></Button>
                                        </Space>
                                    </Space>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <span style={{opacity: "65%"}} className="cm-font-size13"><Translate i18nKey={"common-labels.meeting-details"}/></span>
                                </Col>
                                <Col span={12} className='cm-width100'>
                                    <Space className='cm-width100'>
                                        <Space direction="vertical" className='cm-width100 cm-position-relative'>
                                        <div className='hover-item'>
                                            <Button className="cm-font-size12" size="small" type="primary" icon={<MaterialSymbolsRounded font="video_call" size="16"/>} disabled={!actionPoint.meetingJoinLink} onClick={()=> window.open(actionPoint.meetingJoinLink, "_blank")}><Translate i18nKey={"step.join-meeting"}/></Button>
                                            {/* <div className='cm-position-absolute show-on-hover-icon' style={{top: "0px", right: "-20px"}}>{actionPoint?.meetingJoinLink && <MaterialSymbolsRounded className='cm-cursor-pointer' font={copy.meetingJoinLink ? "done" : "content_copy"} onClick={() => copyLink(actionPoint.meetingJoinLink, 'meetingLink')} size='18'/>}</div> */}
                                        </div>
                                            <Button className="cm-font-size12" type="primary" ghost style={{width: "100%"}} size="small" disabled={!actionPoint.meetingMom} onClick={() => setShowMessage({isModalOpen: true, dataToShow: "mom"})}><Translate i18nKey={"step.view-mom"}/></Button>
                                        </Space>
                                    </Space>
                                </Col>
                            </Row>
                            {
                                actionPoint.meetingRecording ?
                                    <Space direction="vertical" className='cm-width100'>
                                        <span style={{opacity: "65%"}} className="cm-font-size13"><Translate i18nKey={"common-labels.recording"}/></span>   
                                        <UploadFile key={actionPoint.meetingRecording.uuid} {...actionPoint.meetingRecording} />
                                    </Space>
                                :
                                    null
                            }
                        </>
                    :
                        <>
                            {
                                actionPoint.resources[0] ?
                                    <Space direction='vertical' className='cm-width100'>
                                        <span style={{opacity: "65%"}} className="cm-font-size13 cm-flex-align-center"><Translate i18nKey='common-labels.link'/></span>
                                            <div className="j-action-type-link-card cm-width100 cm-flex-space-between">
                                                <div className="j-action-type-link cm-font-size16 cm-font-fam500">
                                                    {
                                                        actionPoint.resources[0]?.title === "Untitled" ? 
                                                            <a target='_blank' onClick={() => handleLinkClick(actionPoint.resources[0])} ><Text style={{color: "#0065e5"}} >{actionPoint.resources[0]?.content?.url}</Text></a>
                                                        :
                                                            <a target='_blank' onClick={() => handleLinkClick(actionPoint.resources[0])} ><Text style={{color: "#0065e5"}} >{actionPoint.resources[0]?.title}</Text></a>
                                                    }
                                                </div>
                                                <div className="j-action-link-copy cm-cursor-pointer cm-flex-align-center">
                                                    <MaterialSymbolsRounded className='cm-cursor-pointer cm-padding10' font={copy.resourceLink ? 'done' : 'content_copy'} size='20' onClick={() => copyLink(actionPoint.resources[0].content.url, 'resourceLink')} />
                                                </div>
                                            </div>
                                    </Space>
                                :
                                    null
                            }
                        </>       
                }
            </Space>
            <BuyerResourceViewerModal
                isOpen          =   {viewResourceProp.isOpen}
                onClose         =   {viewResourceProp.onClose}
                fileInfo        =   {viewResourceProp.resourceInfo}
            />
            <Modal
                centered
                width       =   {650}
                open        =   {showMessage.isModalOpen}
                onCancel    =   {() => setShowMessage({isModalOpen: false, dataToShow: ""})}
                footer      =   {null}
                className       =   'cm-bs-custom-modal'
            >
                <>
                    <div className="cm-modal-header cm-flex-align-center">
                        <span className="cm-font-fam500 cm-font-size15 cm-flex-align-center cm-height100">{capitalize(translate(showMessage.dataToShow == "agenda" ? "common-labels.agenda" : "common-labels.minutes-meeting"))}</span>
                    </div>
                    <div className='j-ap-meeting-note cm-form cm-modal-content'>
                        {
                            showMessage.dataToShow == "agenda" ? (
                                actionPoint.meetingNotes ?
                                    <div className='cm-font-size14 cm-width100 cm-word-wrap-break' dangerouslySetInnerHTML={{__html: CommonUtil.__replaceURLInText(actionPoint.meetingNotes)}}></div>
                                :
                                    <span className='cm-empty-text cm-font-size12'>
                                        <Translate i18nKey="common-empty.no-notes-found"/>
                                    </span>
                            ) : 
                            (
                                <div className='j-ap-meeting-note'>
                                    {
                                            actionPoint.meetingMom ?
                                            <div className='cm-font-size14 cm-width100 cm-word-wrap-break' dangerouslySetInnerHTML={{__html: CommonUtil.__replaceURLInText(actionPoint.meetingMom)}}></div>
                                        :
                                            <span className='cm-empty-text cm-font-size11'>
                                                <Translate i18nKey="common-empty.no-minutes-meeting-found"/>
                                            </span>
                                    }
                                </div>
                            )
                        }
                    </div>
                </>
            </Modal>
        </>
    )
}

export default GoToUrl