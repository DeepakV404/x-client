import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Layout, List, Radio } from "antd";

import { RT_FROM_DEMO_ORG } from "../api/room-templates-query";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import TemplateListCard from "./template-list-card";
import Loading from "../../../utils/loading";
import ContentLayout from "./content-layout";
import DemoUsecaseNotFound from "../../../components/no-result-found";
import { GlobalContext } from "../../../globals";

const { Sider, Content } = Layout;

const TemplateForm = (props: { onClose(): void, templates: any[] }) => {

    const { templates, onClose } = props;

    const { $dictionary }   =   useContext(GlobalContext);

    const { data: rtData, loading, error } = useQuery(RT_FROM_DEMO_ORG, {
        fetchPolicy: "network-only"
    });

    const [content, setContent] = useState("from_scratch")
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    useEffect(() => {
        if (rtData) {
            setSelectedTemplate(rtData?.roomTemplatesFromDemoOrg[0])
        }
    }, [rtData])

    const handleChange = (e: any) => {
        setContent(e.target.value);
    }

    const handleClick = (_template: any) => {
        setSelectedTemplate(_template)
    }

    if (loading) return <Loading />
    if (error) return <SomethingWentWrong />

    return (
        <div className="cm-height100">
            <div className="cm-font-size16 cm-font-fam500 cm-modal-header cm-flex-align-center">Create {$dictionary.templates.singularTitle}</div>
            <Layout style={{ height: "calc(100% - 51px)" }}>
                <Sider width={350} style={{ borderRight: "1px solid #eeeeee", overflow: "auto" }} className="j-room-template-modal-sider">
                    <div className="cm-flex-center" style={{ height: "70px" }}>
                        <Radio.Group className="cm-flex" onChange={handleChange} defaultValue="from_scratch">
                            <Radio.Button value={"from_scratch"} className='cm-font-fam500'>
                                From scratch
                            </Radio.Button>
                            <Radio.Button value={"buyerstage_templates"} className='cm-font-fam500'>
                                Prebuilt {$dictionary.templates.title}
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{ height: "calc(100% - 70px)" }}>
                        <div className="cm-font-fam600" style={{ height: "30px", paddingInline: "15px" }}>
                            {content === "from_scratch" ? `Existing ${$dictionary.templates.title}` : `Prebuilt ${$dictionary.templates.title}`} ({content === "from_scratch" ? templates.length : rtData.roomTemplatesFromDemoOrg.length})
                        </div>
                        <List
                            style           =   {{ height: "calc(100% - 35px)", overflow: "auto" }}
                            itemLayout      =   "horizontal"
                            dataSource      =   {content === "from_scratch" ? templates : rtData.roomTemplatesFromDemoOrg}
                            rowKey          =   {(item: any) => item.uuid}
                            renderItem      =   {(_template: any) => <List.Item className={`${content === "buyerstage_templates" ? (selectedTemplate?.uuid === _template.uuid ? "j-template-list-item selected cm-cursor-pointer" : "j-template-list-item cm-cursor-pointer") : ""} ${selectedTemplate?.uuid === _template.uuid ? "j-template-list-item cm-cursor-pointer selected" : "j-template-list-item cm-cursor-pointer"}`} style={{ paddingInline: "15px" }} onClick={() => handleClick(_template)}> <TemplateListCard template={_template} isFromScratch={content === "from_scratch"} onClose={onClose} /></List.Item>}
                            locale          =   {{ emptyText: <div className="cm-flex-center" style={{ height: "500px" }}><DemoUsecaseNotFound message={"No Templates Found"} /></div> }}
                        />
                    </div>
                </Sider>
                <Content>
                    <ContentLayout content={content} selectedTemplate={selectedTemplate} {...props} />
                </Content>
            </Layout>

        </div>
    )
}

export default TemplateForm