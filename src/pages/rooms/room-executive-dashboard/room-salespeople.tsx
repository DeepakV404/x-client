import { Col, Row, Space, Typography } from "antd";

import BS_Badge from "../../../buyer-view/components/badge";
import SalesPersonCard from "./sales-person-card";

const { Text }  =   Typography;

const RoomSalespeople = (props: {sellerWiseApStats : any}) => {

    const { sellerWiseApStats } =   props;

    const colors = ["#2979FF", "#FF9800", "#FF1744", "#00C853"];

    if(sellerWiseApStats?.length > 0){
        return (
            <>
                <div className="cm-font-size16 cm-font-fam600 cm-margin-top20">Salespeople</div>
                <div className="j-horizontal-scroll-wrapper cm-scrollbar-none">
                    <Space size={15} style={{marginInline: "calc((100vw - 1280px) / 2 + 20px)"}}>
                        {
                            sellerWiseApStats.map((_salesPerson: any) => {
                                const pieData = [
                                    { status: "Planned", value: _salesPerson?.apStats?.plannedAps || 0 },
                                    { status: "On-Going", value: _salesPerson?.apStats?.onGoingAps || 0 },
                                    { status: "Pending", value: _salesPerson?.apStats?.pendingAps || 0 },
                                    { status: "Finished", value: _salesPerson?.apStats?.completedAps || 0 },
                                ];
                                
                                return (
                                    <div className="j-salespeople-card" key={_salesPerson.sellerStub.uuid} >
                                        <SalesPersonCard salesReport={_salesPerson.apStats} profile={_salesPerson.sellerStub.profileUrl}/>
                                        <Text style={{maxWidth: "220px"}} ellipsis={{tooltip: `${_salesPerson.sellerStub.firstName} ${_salesPerson.sellerStub.lastName ?? ""}`}} className="cm-font-opacity-black-85 cm-font-fam500">{`${_salesPerson.sellerStub.firstName} ${_salesPerson.sellerStub.lastName ?? ""}`}</Text>
                                        <div className="j-stage-ap-status-card cm-padding10 cm-margin0 cm-background-white">
                                            <Row gutter={[5, 10]}>
                                                {pieData.map((item, index) => (
                                                    <Col span={12} className="cm-flex-align-center">
                                                        <Space size={0}>
                                                            <BS_Badge color={colors[index]} shape="square" size="10px" radius="3px"/>
                                                            <div className="cm-font-size12"><span className="cm-font-fam500">{item.value}</span> {item.status}</div>
                                                        </Space>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Space>
                </div>
            </>
        )
    }else {
        return <></>
    }
}

export default RoomSalespeople
