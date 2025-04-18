import { useState } from "react";
import { Card, Col, Divider, Row, Space } from "antd";

import { ADD_RESOURCE_CONFIG } from "../config/add-resource-config";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded"
import AddResourceLayout from "../resource-form/add-resource-layout";

const ResourceType = (props: {onClose: any}) => {

    const { onClose }   =   props;

    const [selectedResource, setSelectedResource] = useState(null); 

    const handleCardClick = (resourceType: any) => {
        setSelectedResource(resourceType); 
    };

    return(
        <div className="cm-height100">
            {
                selectedResource 
                ? 
                    <AddResourceLayout 
                        displayName     =   {ADD_RESOURCE_CONFIG[selectedResource].displayName}
                        resKey          =   {ADD_RESOURCE_CONFIG[selectedResource].key} 
                        domain          =   {ADD_RESOURCE_CONFIG[selectedResource].domain}
                        type            =   {ADD_RESOURCE_CONFIG[selectedResource].view} 
                        imageIcon       =   {ADD_RESOURCE_CONFIG[selectedResource].imageIcon ?
                                                <div className="cm-flex-justify-center">
                                                    <MaterialSymbolsRounded font={ADD_RESOURCE_CONFIG[selectedResource].imageIcon ?? ""} size='32'/>
                                                </div>
                                            :
                                                <div className="cm-flex-justify-center">
                                                    <img src={ADD_RESOURCE_CONFIG[selectedResource].imageFile} style={{width: "32px", height: "32px"}}/>
                                                </div> 
                                            }
                        onClose         =   {() => {setSelectedResource(null); onClose()}}
                        goBack          =   {() => setSelectedResource(null)}
                    />
                :   
                    <>  
                        <Space className="cm-flex-space-between cm-padding20">
                            <span className="cm-font-size16 cm-font-fam500">Add Resources</span>
                            <MaterialSymbolsRounded font="close" className="cm-cursor-pointer" onClick={onClose}/>
                        </Space>
                        <Divider style={{margin: "0px"}}/>
                        <Row className="j-library-slider-body">
                            {
                                Object.values(ADD_RESOURCE_CONFIG).map((resourceType) => (
                                    <Col key={resourceType.key} span={6} className="cm-flex-justify-center cm-cursor-pointer cm-margin-bottom20">
                                        <Card className="j-library-resource-card cm-flex-center" onClick={() => handleCardClick(resourceType.key)}>
                                            <Space direction="vertical">
                                                {
                                                    resourceType.imageIcon ?
                                                        <div className="cm-flex-justify-center">
                                                            <MaterialSymbolsRounded font={resourceType.imageIcon} size='40'/>
                                                        </div>
                                                    :
                                                        <div className="cm-flex-justify-center">
                                                            <img src={resourceType.imageFile} style={{width: "40px", height: "40px"}}/>
                                                        </div>
                                                }
                                                <span className="cm-font-size13 cm-font-fam500 cm-flex-justify-center">{resourceType.displayName}</span>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
                    </>
            }
        </div>
    )
}

export default ResourceType