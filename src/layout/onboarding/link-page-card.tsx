import { Col, Divider, Row, Space, Typography } from "antd"

import { CAROUSEL_FALLBACK_IMAGE1, ONBOARDING_PERSON_IMAGE } from "../../constants/module-constants"
import { CommonUtil } from "../../utils/common-util";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded"

const { Text }  =   Typography;

interface ComponentProps{
    stepClass       :   "step3" | "step4";
    linkTitle?      :   string;
    uploadedFiles?  :   { url: string; name: string }[];
    sampleFile      :   { url: string; name: string }[];
}

const LinkPageCard = (props: ComponentProps) => {

    const { stepClass, uploadedFiles = [], linkTitle, sampleFile } = props;

    const allFiles = uploadedFiles.concat(sampleFile)
    
    return (
        <div className={`j-onboarding-link-page-card ${stepClass}`}>
            <div className="j-onboarding-link-page-card-header cm-flex-align-center">
                <div className="cm-padding-top10 cm-padding-left10">
                    <img style={{width: "30px", height: "30px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-product-logo.svg`} alt='logo'/>
                </div>
            </div>
            <div className="j-onboarding-link-page-bottom-header cm-flex-align-center cm-flex-space-between cm-padding-inline10">
                <Space>
                    <MaterialSymbolsRounded font="arrow_back" size="20"/>
                    <div className="cm-font-size13 cm-font-fam500">{linkTitle ?? "Untitled"}</div>
                </Space>
                <Space>
                    <div className="j-onboarding-bottom-header-tab-box">
                        <div className="j-onboarding-bottom-header-tab-box-inner"></div>
                    </div>
                    <div className="j-onboarding-bottom-header-tab-box">
                        <div className="j-onboarding-bottom-header-tab-box-inner"></div>
                    </div>
                </Space>
            </div>
            <div className="j-onboarding-link-page-card-body cm-padding15">
                <Row>
                    <Col span={14}>
                        <Row>
                            <div className="j-left-link-card cm-flex-space-around cm-flex-align-center">
                                <Space direction="vertical">
                                    <div className="j-onboarding-link-card-top-box"></div>
                                    <div className="j-onboarding-link-card-bottom-box"></div>
                                </Space>
                                <Space direction="vertical">
                                    <div className="j-onboarding-link-card-top-box"></div>
                                    <div className="j-onboarding-link-card-bottom-box"></div>
                                </Space>
                                <Space direction="vertical">
                                    <div className="j-onboarding-link-card-top-box"></div>
                                    <div className="j-onboarding-link-card-bottom-box"></div>
                                </Space>
                            </div>
                        </Row>
                        <Row className="cm-margin-top10">
                            <div className="j-left-link-card">
                                <div className="cm-flex cm-width100">
                                    <div className="cm-flex-center" style={{width: "40%",height: "30px", borderRight: "1px solid #E5EAF4"}}>
                                        <div className="j-onboarding-link-card-content"></div>
                                    </div>
                                    <div className="cm-flex-center" style={{width: "40%",height: "30px", borderRight: "1px solid #E5EAF4"}}>
                                        <div className="j-onboarding-link-card-content"></div>
                                    </div>
                                    <div style={{width: "20%"}}></div>
                                </div>
                                <Divider style={{margin: "0px"}}/>
                                <div className="cm-flex cm-width100">
                                    <div className="cm-flex-center" style={{width: "40%",height: "30px", borderRight: "1px solid #E5EAF4"}}>
                                        <Space>
                                            <img width={15} height={15} src={ONBOARDING_PERSON_IMAGE} style={{borderRadius: "4px"}}/>
                                            <div className="j-onboarding-link-card-content"></div>
                                        </Space>
                                    </div>
                                    <div className="cm-flex-center" style={{width: "40%",height: "30px", borderRight: "1px solid #E5EAF4"}}>
                                        <div className="cm-width100 cm-flex-space-around">
                                            <Space>
                                                <MaterialSymbolsRounded font="timer" size="18"/>
                                                <div className="j-onboarding-link-card-analytics"></div>
                                            </Space>
                                            <Space>
                                                <MaterialSymbolsRounded font="visibility" size="18"/>
                                                <div className="j-onboarding-link-card-analytics"></div>
                                            </Space>
                                        </div>
                                    </div>
                                    <Space style={{width: "20%"}} className="cm-flex-center">
                                        <MaterialSymbolsRounded font="progress_activity" color="#E5EAF4"/>
                                        <MaterialSymbolsRounded font="keyboard_arrow_down" size="18"/>
                                    </Space>
                                </div>
                            </div>
                        </Row>
                        <Row className="cm-flex-center" style={{height: "250px"}}>
                            <Space direction="vertical" className="cm-flex-center" size={10}>
                                <div className="cm-font-fam500">Viewers will be listed here</div>
                                <div className="j-onboarding-link-viewers-list"></div>
                                <Space className="j-onboarding-link-viewers-button cm-flex-center">
                                    <MaterialSymbolsRounded font="link" size="18"/>
                                    <div className="j-onboarding-link-card-top-box"></div>
                                </Space>
                            </Space>
                        </Row>
                    </Col>
                    <Col span={10}>
                        <Row>
                            <div className="j-link-shared-assets-card">
                                <div className="cm-font-fam500 cm-margin-bottom10">Shared Assets (1)</div>
                                <Space direction="vertical" size={10}>
                                    <div className="j-onboarding-link-shared-assets-description" style={{width : "250px"}}></div>
                                    <div className="j-onboarding-link-shared-assets-description" style={{width : "150px"}}></div>
                                </Space>
                                {
                                    allFiles.length > 0 ?   
                                        allFiles?.map((file: any, index: number) => (
                                            <div key={index} className="j-onboarding-uploaded-res-card">
                                                <Space className="cm-margin-bottom15">
                                                    <MaterialSymbolsRounded font="drag_indicator" color="#8e8e8e" size="22" />
                                                    <img width={50} height={30} src={CommonUtil.__getResourceFallbackImage(file.type)} style={{ borderRadius: "8px" }} />
                                                    <Text style={{maxWidth: "130px"}} ellipsis={{tooltip: file.name}}>{file.name}</Text>
                                                </Space>
                                                <div className="cm-flex-space-between cm-flex-align-center cm-font-size13">
                                                    <div className="cm-flex" style={{columnGap: "20px"}}>
                                                        <div className="cm-flex" style={{columnGap: "8px"}}>
                                                            <MaterialSymbolsRounded font="timer" size="15" className="cm-secondary-text"/>
                                                            <div>0m 0s</div>
                                                        </div>
                                                        <div className="cm-flex" style={{columnGap: "8px"}}>
                                                            <MaterialSymbolsRounded font="visibility" size="15" className="cm-secondary-text"/>
                                                            <div>0</div>
                                                        </div>
                                                    </div>
                                                    <div className="j-onboarding-res-card-icon-wrapper">
                                                        <MaterialSymbolsRounded font="visibility" size="15"/>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    :
                                        <div className="j-onboarding-uploaded-res-card">
                                            <Space className="cm-margin-bottom15">
                                                <MaterialSymbolsRounded font="drag_indicator" color="#8e8e8e" size="22"/>
                                                <img width={50} height={30} src={CAROUSEL_FALLBACK_IMAGE1} style={{borderRadius: "8px"}}/>
                                                <div>Pitch Deck.pdf</div>
                                            </Space>
                                            <div className="cm-flex-space-between cm-flex-align-center">
                                                <Space size={10}>
                                                    <Space>
                                                        <MaterialSymbolsRounded font="timer" size="18" className="cm-secondary-text"/>
                                                        <div>0m 0s</div>
                                                    </Space>
                                                    <Space>
                                                        <MaterialSymbolsRounded font="visibility" size="18" className="cm-secondary-text"/>
                                                        <div>0</div>
                                                    </Space>
                                                </Space>
                                                <div className="j-onboarding-res-card-icon-wrapper">
                                                    <MaterialSymbolsRounded font="visibility" size="18"/>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default LinkPageCard
