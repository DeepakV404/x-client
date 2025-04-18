import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Divider, Radio, Space, Tooltip, Typography } from "antd";

import { RoomTemplateAgent } from "../../api/room-template-agent";
import { ERROR_CONFIG } from "../../../../config/error-config";
import { CommonUtil } from "../../../../utils/common-util";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography;

const VendorShareLink = (props: {sharableLink: string, isGated: boolean}) => {

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
            <div className="cm-padding15">
                <Space direction="vertical" size={4}>
                    <div className="cm-font-size13 cm-font-fam600 cm-flex-align-center">Link</div>
                    <div className="cm-font-size13 cm-font-fam400 cm-secondary-text">Share the link anywhere for your inbound and outbound</div>
                </Space>               
                <div className="j-template-link-root cm-margin-block20">
                    <Text style={{maxWidth: "100%"}} ellipsis={{tooltip: sharableLink}}>{sharableLink}</Text>
                    <Space size={4} className="cm-cursor-pointer cm-flex-justify-end" onClick={() => copyLink(sharableLink)} style={{width: "140px"}} >
                        <MaterialSymbolsRounded className='cm-cursor-pointer cm-link-text' font={copy ? 'done' : 'content_copy'} size='18' />
                        <div className="cm-link-text">{copy ? "Copied" : "Copy link"}</div>
                    </Space>
                </div>
                <Space className="cm-margin-block10 cm-font-fam500">
                    Collect an email to create a room
                    <Tooltip title={<span>The room link will remain the same even if room sharing permissions are changed.</span>} placement="top">
                        <div><MaterialSymbolsRounded font="info" size="18" className="cm-cursor-pointer"/></div>
                    </Tooltip> 
                </Space>
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
            <Divider style={{marginBlock: "0px"}}/>
            <Space direction="vertical" className="cm-padding-inline15 cm-margin-top15" size={4}>
                <div className="cm-font-size13 cm-font-fam600 cm-flex-align-center">Embed Code</div>
                <div className="cm-font-size13 cm-font-fam400 cm-secondary-text">Embed your product room as product showcase or self-serve potal on your website.</div>
                <div className="j-template-link-root cm-margin-block20 cm-padding10 cm-font-fam400" style={{width: "600px"}}>
                    {`<iframe src="${embedLink}" height="600px" width="100%"></iframe>`}
                </div>
                <Button className="j-vendor-copy-link-btn cm-width100" onClick={() => copyEmbedLink(embedLink)}>{copyEmbed ? "Copied" : "Copy Code"}</Button>
            </Space> 
        </>
    )
}

export default VendorShareLink