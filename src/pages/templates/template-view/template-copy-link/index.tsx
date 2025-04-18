import { useState } from "react";
import { useParams } from "react-router-dom";
import { Radio, Space, Typography } from "antd";

import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography;

const TemplateCopyLink = (props: {sharableLink: string, isGated: boolean}) => {

    const { sharableLink, isGated }  =   props;

    const { roomTemplateId }    =   useParams();

    const [copy, setCopy]                   =   useState(false);
    const [copyEmbed, setCopyEmbed]         =   useState(false);

    const copyLink = (link: string) => {
        window.navigator.clipboard.writeText(link)
        setCopy(true);
        setTimeout(function() {			
            setCopy(false)
        }, 2000);
    }

    const embedLink = `${sharableLink}?embed=true`;

    const copyEmbedLink = (link: string) => {
        const embedCode = `<iframe src="${link}" height="600px" width="100%"></iframe>`;
        navigator.clipboard.writeText(embedCode)
            .then(() => {
                setCopyEmbed(true);
                setTimeout(() => setCopyEmbed(false), 2000);
            });
    };

    const updateLinkSettings = (event: any) => {
        RoomTemplateAgent.updateRoomTemplate({
            variables: {
                templateUuid: roomTemplateId, 
                input: {
                    isGated: event.target.value === "before"
                }
            },
            onCompletion: () => {},
            errorCallBack: (error: any) => {
                CommonUtil.__showError(ERROR_CONFIG[error.graphQLErrors[0].code] ? ERROR_CONFIG[error.graphQLErrors[0].code].error : ERROR_CONFIG["general"].error)
            }
        })
    }

    return (
        <>                
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Share Link</div>
            <div className="cm-modal-content">
                <div className="j-template-link-root cm-margin-bottom20">
                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: sharableLink}}>{sharableLink}</Text>
                    <Space size={4} className="cm-cursor-pointer cm-flex-justify-end" onClick={() => copyLink(sharableLink)} style={{width: "140px"}} >
                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-link-text' font={copy ? 'done' : 'content_copy'} size='18' />
                        <div className="cm-link-text">{copy ? "Copied" : "Copy link"}</div>
                    </Space>
                </div>
                <div className="cm-margin-block10 cm-font-fam500">Embed Link</div>
                <div className="j-template-link-root cm-margin-bottom20">
                    <Text style={{maxWidth: "80%"}} ellipsis={{tooltip: `<iframe src="${embedLink}" height="600px" width="100%"></iframe>`}}>{`<iframe src="${embedLink}" height="600px" width="100%"></iframe>`}</Text>
                    <Space size={4} className="cm-cursor-pointer cm-flex-justify-end" onClick={() => copyEmbedLink(embedLink)} style={{width: "140px"}} >
                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-link-text' font={copyEmbed ? 'done' : 'content_copy'} size='18' />
                        <div className="cm-link-text">{copyEmbed ? "Copied" : "Copy link"}</div>
                    </Space>
                </div>
                <div className="cm-margin-block10 cm-font-fam500">Collect an email to create a room</div>
                <Radio.Group className="cm-width100" defaultValue={isGated ? "before" : "after"} onChange={(event: any) => updateLinkSettings(event)}>
                    <div className={`j-template-access-type-root cm-margin-bottom10 ${isGated ? "active" : ""}`}>
                        <Radio value={"before"} key={"before"}>
                            <div className="cm-width100 cm-flex-align-center">
                                <Space direction="vertical" size={1} className="cm-margin-left5">
                                    <div className="cm-font-fam500">Before</div>
                                    <div className="cm-font-size12">{`Collect Email -> Create a personalized room -> Access the room`}</div>
                                </Space>
                                <div className="cm-flex-align-center j-template-share-link-icon">
                                    { isGated && <MaterialSymbolsRounded font="done" color="#089742"/>}
                                </div>
                            </div>
                        </Radio>
                    </div>
                    <div className={`j-template-access-type-root cm-margin-bottom10 ${!isGated ? "active" : ""}`}>
                        <Radio value={"after"} key={"after"}>
                            <div className="cm-width100 cm-flex-align-center">
                                <Space direction="vertical" size={1} className="cm-margin-left5">
                                    <div className="cm-font-fam500">After</div>
                                    <div className="cm-font-size12">{`Access a temporary room -> Collect Email -> Create a personalized room`}</div>
                                </Space>
                                <div className="j-template-share-link-icon">
                                    { !isGated && <MaterialSymbolsRounded font="done" color="#089742"/>}
                                </div>
                            </div>
                        </Radio>
                    </div>
                </Radio.Group>
            </div>
        </>
    )
}

export default TemplateCopyLink