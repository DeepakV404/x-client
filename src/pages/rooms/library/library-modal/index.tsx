import { useContext, useState } from "react";
import { Col, Row, Space,  Menu, Button } from "antd";
import { GlobalContext } from "../../../../globals";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";
import LibraryFolderTree from "./library-folder-tree";
import LibraryWrapper from "./library-wrapper";
import ResourceSlider from "../../../library/library-layout/resource-slider";

const LibrarySelect  = () => {

    const { $dictionary }      =    useContext(GlobalContext)

    const [currentPage, setCurrentPage]         =   useState("all-resources");
    const [ isResourceOpen, setIsResourceOpen ] =   useState(false);

    return (
        <>
            <Row className="cm-height100 cm-row" gutter={10} >
                <Col flex="225px" className="cm-height100 cm-overflow-auto" style={{backgroundColor: "#fff", paddingLeft: "0px !important"}}>
                    <div className="cm-font-size16 cm-font-fam500 cm-margin-bottom10">{$dictionary.library.title}</div>
                    <Menu className={`j-library-nav-menu cm-width100`} selectedKeys={[currentPage]}>
                        <Menu.Item className={`j-library-nav-item ${currentPage === "all-resources" ? "active" : ""}`} key={"all-resources"}  onClick={() => setCurrentPage("all-resources")}>
                            <Space className="cm-flex-align-center">
                                <MaterialSymbolsRounded font="perm_media" size="20"/>
                                <div className="cm-font-fam500 cm-font-fam18">All Resources</div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item className={`j-library-nav-item ${currentPage === "home" ? "active" : ""}`} key={"home"} onClick={() => setCurrentPage("home")}>
                            <Space className="cm-flex-align-center">
                                <MaterialSymbolsRounded font="home" size="20"/>
                                <div className="cm-font-fam500 cm-font-fam18">Home</div>
                            </Space>
                        </Menu.Item>
                        <div className="cm-font-fam500 cm-margin-block20 cm-secondary-text">Folders</div>
                        <LibraryFolderTree handleOnFolderClick = {(folderId: string) => setCurrentPage(folderId)}/>
                    </Menu>
                </Col>
                <Col flex="auto" style={{maxWidth: "calc(100% - 225px)", paddingRight: "0px !important", paddingLeft: "0px !important", border: "1px solid #f5f7f9", borderRadius: "4px"}} className="cm-height100 j-res-list-col">
                    <div className="cm-margin15 cm-width100 cm-flex-justify-end">
                        <Button type="primary" onClick={() => setIsResourceOpen(true)} style={{marginRight: "65px"}}><Space><MaterialSymbolsRounded className="cm-button-icon" font="upload" size="20"/>Upload</Space></Button>
                    </div>
                    <LibraryWrapper 
                        folderId                =   {currentPage} 
                        setCurrentPage          =   {setCurrentPage}
                        setIsResourceOpen       =   {setIsResourceOpen}
                    />
                </Col>
            </Row>
            <ResourceSlider isOpen={isResourceOpen} onClose={() => setIsResourceOpen(false)}/>
        </>
    )
}

export default LibrarySelect