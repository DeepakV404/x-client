import { Button, Col, Divider, Row, Space, Typography } from "antd"
import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded"
import { ROOM_TEMPLATES } from "../../../templates/api/room-templates-query";
import { useQuery } from "@apollo/client";
import Loading from "../../../../utils/loading";
import { useState } from "react";
import { prebuildTemplates } from "./prebuil-templates";
import UseRoomTemplates from "./use-template-modal";
import { CommonUtil } from "../../../../utils/common-util";
import { BASIC, BLANK, ONE_PAGER } from "../../../../constants/module-constants";

const RoomTemplates = (props: {onClose: () => void,}) => {

    const { onClose } = props

    const { Text } = Typography

    const { data, loading } = useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only",
    });

    const [isPreview, setIsPreview] =   useState<{ isSelected: boolean; templateData: any}>({
        isSelected: false,
        templateData: null
    })
    const [isTemplateSelected, setIsTemplateSelected]   =   useState<{isOpen?: boolean, id?: string, isPreBuildTemp?: boolean, templateType?: string, templateData?: any}>({
        isOpen: false,
        id: "",
        isPreBuildTemp:false,
        templateData: null,
        templateType: ""
    })    

    const getRandomColor = () => {
        const colors = prebuildTemplates.map(template => template.colorCode + "66");
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor
    }

    // const [selectedMenu, setSelectedMenu] = useState("All Templates")

    // const handleSelectMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    //     const target = event.target as HTMLElement;
    //     const menuKey = target.getAttribute("data-menu-key");
    //     if (menuKey) {
    //         setSelectedMenu(menuKey);
    //     }
    // }

    if (loading) return <Loading />

    return (
        <>
            <Row className="cm-height100 cm-row" gutter={10}>
                {/* <Col flex="250px" className="j-create-room-modal-sidebar cm-height100">
                    <div className="j-create-room-modal-sidebar-menu" onClick={handleSelectMenu}>
                        <div className={`j-create-room-modal-sidebar-list ${selectedMenu === "All Templates" ? "active" : ""}`} data-menu-key="All Templates">
                            All Templates
                        </div>
                        <div className={`j-create-room-modal-sidebar-list ${selectedMenu === "Your Templates" ? "active" : ""}`} data-menu-key="Your Templates">
                            Your Templates
                        </div>
                        <div className={`j-create-room-modal-sidebar-list ${selectedMenu === "Prebuild Templates" ? "active" : ""}`} data-menu-key="Prebuild Templates">
                            Prebuild Templates
                        </div>
                    </div>
                </Col> */}
                <Col flex="auto" className="j-create-room-modal-main cm-height100">
                    {
                        isPreview.isSelected 
                            ? 
                                <>
                                    <div className="cm-flex-space-between-center cm-margin-bottom20">
                                        <div className="cm-flex-align-center cm-cursor-pointer cm-gap8 cm-margin-right15" onClick={() => setIsPreview({isSelected: false, templateData: null})}>
                                            <MaterialSymbolsRounded font="arrow_back" size="22"/>
                                            <Text className="cm-font-fam500 cm-font-size16 cm-font-opacity-black-85 cm-whitespace-no-wrap">Back</Text>
                                        </div>
                                        <Text ellipsis={{tooltip: isPreview.templateData.title}} style={{width: "80%"}} className="cm-font-fam500 cm-text-align-center cm-font-size20 cm-font-opacity-black-85 cm-margin-right15">{isPreview.templateData.title}</Text>
                                        <Button type="primary" iconPosition="end" icon={<MaterialSymbolsRounded font="arrow_forward" size="22"/>} onClick={() => setIsTemplateSelected((prev) => ({...prev, isOpen: true, id: isPreview.templateData.uuid}))}>Use template</Button>
                                    </div>
                                    <div style={{ paddingBlock: "15px", height: "calc(100% - 100px)" }} className="cm-padding15 j-template-image-card cm-flex-center">
                                        {isPreview?.templateData?.previewLink ? <iframe frameBorder={"none"} height={"100%"} width={"100%"} src={isPreview?.templateData?.previewLink} /> : <div className="cm-empty-text">No preview found</div>}
                                    </div>
                                </>
                            :
                                <div className="cm-height100">
                                    <div className="cm-flex-space-between" style={{paddingBottom: "15px"}}>
                                        <Text className="cm-font-fam600 cm-font-size20 cm-font-opacity-black-85">Start With</Text>
                                        <Space size={15}>
                                            {/* <Input placeholder="Search by templates" onChange={handleSearch} suffix={<MaterialSymbolsRounded font="search" size="18" />} style={{ width: "330px", height: "32px" }} /> */}
                                            <MaterialSymbolsRounded className="cm-font-opacity-black-65 cm-cursor-pointer" font="close" size="24" onClick={() => onClose()}/>
                                        </Space>
                                    </div>
                                    <div style={{height: "calc(100% - 85px)", overflowX: "auto"}}>
                                        {
                                            <div className="j-create-room-modal-main-cards cm-margin-bottom20">
                                                <div className="j-create-room-modal-main-card cm-position-relative hover-item" style={{border: "2px dashed #1F4265", background: "inherit"}}>
                                                    <div className="j-create-room-modal-main-card-hover cm-flex-center cm-text-align-center" style={{ height: "130px", width: "100%", overflow: "hidden", background: "#1F4265", borderRadius: "6px", paddingTop: "21px" }}>
                                                        <img src={BLANK} alt="" />
                                                    </div>
                                                    <div className="cm-position-absolute show-on-hover" style={{width: "90%", paddingTop: "15px"}}>
                                                        <Button style={{width: "125px"}} type="primary" onClick={() => setIsTemplateSelected({isOpen: true, templateType: "FROM_SCRATCH"})}>Create</Button>
                                                    </div>
                                                    <Space size={2} direction="vertical">
                                                        <div className="cm-flex-space-between">
                                                            <Text style={{ width: "100%" }} className="cm-font-fam600 cm-font-opacity-black-85">Blank</Text>
                                                        </div>
                                                        <Text style={{ width: "100%" }} className="cm-font-size12 cm-font-opacity-black-67">Create empty page to start</Text>
                                                    </Space>
                                                </div>
                                                <div className="j-create-room-modal-main-card cm-position-relative hover-item" style={{border: "2px dashed #1F4265", background: "inherit"}}>
                                                    <div className="j-create-room-modal-main-card-hover cm-flex-center cm-text-align-center" style={{ height: "130px", width: "100%", overflow: "hidden", background: "#1F4265", borderRadius: "6px",paddingTop: "21px" }}>
                                                        <img src={ONE_PAGER} alt="" />
                                                    </div>
                                                    <div className="cm-position-absolute show-on-hover" style={{width: "90%", paddingTop: "15px"}}>
                                                        <Button style={{width: "125px"}} type="primary" onClick={() => setIsTemplateSelected({isOpen: true, templateType: "ONE_PAGER"})}>Create</Button>
                                                    </div>
                                                    <Space size={2} direction="vertical">
                                                        <div className="cm-flex-space-between">
                                                            <Text style={{ width: "100%" }} className="cm-font-fam600 cm-font-opacity-black-85">One Pager</Text>
                                                        </div>
                                                        <Text style={{ width: "100%" }} className="cm-font-size12 cm-font-opacity-black-67">A concise, single-page layout</Text>
                                                    </Space>
                                                </div>
                                                <div className="j-create-room-modal-main-card cm-position-relative hover-item" style={{border: "2px dashed #1F4265", background: "inherit"}}>
                                                    <div className="j-create-room-modal-main-card-hover cm-flex-center cm-text-align-center" style={{ height: "130px", width: "100%", overflow: "hidden", background: "#1F4265", borderRadius: "6px", paddingTop: "21px" }}>
                                                        <img src={BASIC} alt="" />
                                                    </div>
                                                    <div className="cm-position-absolute show-on-hover" style={{width: "90%", paddingTop: "15px"}}>
                                                        <Button style={{width: "125px"}} type="primary" onClick={() => setIsTemplateSelected({isOpen: true, templateType: "SALES_TEMPLATE"})}>Create</Button>
                                                    </div>
                                                    <Space size={2} direction="vertical">
                                                        <div className="cm-flex-space-between">
                                                            <Text style={{ width: "100%" }} className="cm-font-fam600 cm-font-opacity-black-85">Basic</Text>
                                                        </div>
                                                        <Text style={{ width: "100%" }} className="cm-font-size12 cm-font-opacity-black-67">Start with default sections sections</Text>
                                                    </Space>
                                                </div>
                                            </div>
                                        }
                                        <Divider orientation="left" orientationMargin="0" className="cm-margin-top0"><Text className="cm-font-size14 cm-font-fam500">My Templates</Text></Divider>
                                        <div className="j-create-room-modal-main-cards cm-margin-bottom20">
                                            {data?.roomTemplates.map((template: any) => (
                                                <div className="j-create-room-modal-main-card cm-position-relative hover-item">
                                                    <div className="j-create-room-modal-main-card-hover cm-flex-center cm-text-align-center" style={{ height: "130px", width: "100%", background: `${getRandomColor()}`, borderRadius: "6px" }}>
                                                        <Text className="cm-flex-center cm-font-fam500" style={{height: "120px", width: "120px", fontSize: "36px", color: "rgb(0 0 0)", backgroundColor: "rgb(255 255 255 / 0%)",   borderRadius: "7px"}}>{CommonUtil.__getAvatarName(template.title, 2)}</Text>
                                                    </div>
                                                    <div className="cm-position-absolute show-on-hover" style={{width: "90%", paddingTop: "10px"}}>
                                                        <Button style={{width: "125px"}} onClick={() => {setIsPreview({isSelected: true, templateData: template})}}><MaterialSymbolsRounded font="visibility" size="18" /> Preview</Button>
                                                        <Button style={{width: "125px"}} type="primary" onClick={() => setIsTemplateSelected({isOpen: true, id: template.uuid, templateData: template})}>Use template</Button>
                                                    </div>
                                                    <Space size={2} direction="vertical">
                                                        <Text ellipsis={{ tooltip: template.title }} style={{ width: "100%" }} className="cm-font-fam600 cm-font-opacity-black-85">{template.title}</Text>
                                                        <Text ellipsis={{ tooltip: template.description }} style={{ width: "100%" }} className="cm-font-size12 cm-font-opacity-black-67">{template.description ?? "No description found"}</Text>
                                                    </Space>
                                                </div>
                                            ))}
                                        </div>
                                        <Divider orientation="left" orientationMargin="0" className="cm-margin-top0"><Text className="cm-font-size14 cm-font-fam500">Templates Library</Text></Divider>
                                        <div className="j-create-room-modal-main-cards">
                                            {prebuildTemplates.map((template: any) => (
                                                <div key={template.uuid} className="j-create-room-modal-main-card cm-position-relative hover-item">
                                                    <div className="j-create-room-modal-main-card-hover cm-flex-center cm-text-align-center" style={{ height: "130px", width: "100%", background: `${template.colorCode}`, borderRadius: "6px", overflow: "hidden" }}>
                                                        <img width={"85%"} src={template.image} alt="" style={{padding: "0", borderRadius: "4px",marginTop: "30px", maxWidth: "200px", height: "auto", boxShadow: "0px 2px 2px 1px rgb(1 1 1 / 12%)"}}/>
                                                    </div>
                                                    <div className="cm-position-absolute show-on-hover" style={{width: "90%", paddingTop: "10px"}}>
                                                        <Button style={{width: "125px"}} onClick={() => {setIsPreview({isSelected: true, templateData: template}); setIsTemplateSelected({isPreBuildTemp: true})}}><MaterialSymbolsRounded font="visibility" size="18" /> Preview</Button>
                                                        <Button style={{width: "125px"}} type="primary" onClick={() => setIsTemplateSelected({isOpen: true, id: template.uuid, isPreBuildTemp: true})}>Use template</Button>
                                                    </div>
                                                    <Space size={2} direction="vertical">
                                                        <Text ellipsis={{ tooltip: template.title}} style={{ width: "100%" }} className="cm-font-fam600 cm-font-opacity-black-85">{template.icon} &nbsp; {template.title}</Text>
                                                        <Text ellipsis={{ tooltip:  template.description}} style={{ width: "100%" }} className="cm-font-size12 cm-font-opacity-black-67">{template.description}</Text>
                                                    </Space>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                    }
                </Col>
            </Row>
            <UseRoomTemplates 
                isOpen={isTemplateSelected.isOpen || false}
                onClose={() => setIsTemplateSelected({isOpen: false, id: ""})}
                isTemplateSelected={isTemplateSelected}
            />
        </>
    )
}

export default RoomTemplates
