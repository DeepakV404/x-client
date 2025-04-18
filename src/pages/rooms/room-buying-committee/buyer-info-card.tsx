import { useContext } from 'react';
import { Avatar, Badge, Card, Space, Tooltip, Typography } from 'antd';

import { CRM_INTEGRATION_CONFIG } from '../../settings/config/integration-type-config';
import { CommonUtil } from '../../../utils/common-util';
import { GlobalContext } from '../../../globals';

const { Text }  =   Typography;

const BuyerInfoCard = (props: {buyer : any, onClick: (buyer: any) => void, currentBuyer: any}) => {

    const { buyer, onClick, currentBuyer } =   props

    const { $orgDetail }    =   useContext(GlobalContext);

    const getStatus = (status: string) => {
        if(status === "ACTIVE"){
            return  "success"
        }else if(status === "IN_ACTIVE"){
            return "warning"
        }else if(status === "INVITED"){
            return "processing"
        }
    }

    const isCRMConnectedAndSynced = buyer?.crmSynced;

    return (
        <Card bordered={false} hoverable={false} className={`j-room-buyer-card ${currentBuyer?.uuid === buyer.uuid ? "selected" : ""}`} onClick={() => onClick(buyer)}>
            <Space direction="vertical" size={15} className='cm-width100'>
                <div className='cm-width100 cm-flex-align-center' style={{columnGap: "10px"}}>
                    <Badge dot status={getStatus(buyer.status)}>
                        <Avatar shape='square' size={40} style = {{color: "#000", background: "#e4e4e4", fontSize: "14px", display: "flex", borderRadius: "4px" }} src={buyer.profileUrl ? <img src={buyer.profileUrl} alt={CommonUtil.__getFullName(buyer.firstName, buyer.lastName)} /> : ""}>
                            {CommonUtil.__getAvatarName(CommonUtil.__getFullName(buyer.firstName, buyer.lastName),2)}
                        </Avatar>
                    </Badge>
                    <Space direction="vertical" size={0} className='cm-width100'>
                        <Space className='cm-flex-space-between'>
                            <Text className="cm-font-fam500 cm-font-size15" style={{maxWidth: "180px"}} ellipsis={{tooltip: CommonUtil.__getFullName(buyer.firstName, buyer.lastName)}}>{CommonUtil.__getFullName(buyer.firstName, buyer.lastName)}</Text>
                            {isCRMConnectedAndSynced ? 
                                <Tooltip title={"Added in CRM"}>
                                    <div className="cm-flex-align-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.["logo-sm-size"]} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.["logo-sm-size"]} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                                </Tooltip> 
                            : 
                                null
                            }
                        </Space>
                        <Text className="cm-font-size12" ellipsis={{tooltip: buyer.emailId}} style={{maxWidth: "200px"}}>{buyer.emailId}</Text>
                    </Space>
                </div>
            </Space>
        </Card>
    )
}

export default BuyerInfoCard