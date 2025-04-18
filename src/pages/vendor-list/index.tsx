import { useState } from "react";
import { Button, Col, Input, Row, Space } from "antd"

import VendorTable from "./vendor-table"
import AddVendorModal from "./vendor-table/add-vendor-modal";
import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";


const VendorListLayout = () => {

    const [isVendorModalOpen, setIsVendorModalOpen]     =     useState(false); 
    const [ searchKey, setSearchKey]                    =     useState("");

    return(
        <>
            <Row className="cm-height100 cm-row" gutter={20}>
                {/* <Col flex="230px" className="j-vendor-list-filter cm-height100" style={{ padding: "0px"}}>
                </Col> */}
                <Col style={{width: "100%", padding: "0px"}}>
                    <Space className="cm-flex-space-between cm-flex-align-center j-vendor-list-header">
                        <div className="cm-font-size16 cm-font-fam500">Vendor Lists</div>
                        <Space>
                            <div className='cm-flex-justify-end'>
                                <Input placeholder="Search" prefix={<MaterialSymbolsRounded font="search" size="18" color="#c1c1c1"/>} allowClear onChange={(e) => setSearchKey(e.target.value)} style={{width: "230px"}}/>
                            </div>
                            <Button className='cm-flex-center cm-icon-button' type="primary" onClick={() => setIsVendorModalOpen(true)} icon={<MaterialSymbolsRounded font="add" size="20" weight='400'/>}>
                                <div className="cm-font-size14">Add Vendor</div>
                            </Button>
                        </Space>
                    </Space>
                    <VendorTable search={searchKey} setShowModal={() => setIsVendorModalOpen(true)}/>
                </Col>
            </Row>
            <AddVendorModal 
                isOpen  =   {isVendorModalOpen} 
                onClose =   {() => setIsVendorModalOpen(false)}
            />
        </>
    )
}

export default VendorListLayout
