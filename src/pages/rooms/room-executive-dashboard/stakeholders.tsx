import { ROOM_BUYER_ROLE_MAPPINGS} from '../api/rooms-query';
import { useQuery } from '@apollo/client';
import { Col, Popover, Row, Space } from 'antd';
import _ from 'lodash';
import BS_Badge from '../../../buyer-view/components/badge';

const Stakeholders = (props: { roomId: string }) => {

    const { roomId }    =   props;

    const { data } = useQuery(ROOM_BUYER_ROLE_MAPPINGS, {
        variables: {
            roomUuid: roomId
        },
        fetchPolicy: 'network-only'
    });

    const getBuyersName = (buyers: any) => {
        let name = <></>;

        name = <span>{buyers[0].firstName} {buyers[0]?.lastName ?? ""}</span>

        const content = (
            <div>
                {buyers.map((_buyer: any, index: number) => (
                    index !== 0 ? <div className='cm-margin-block5'><span>{_buyer?.firstName} {_buyer?.lastName ?? ""}</span></div> : null
                ))}
            </div>
        )

        if(buyers.length > 1){
            name = <span><span>{name}</span> <Popover content={content}><span className='cm-font-size12 cm-font-opacity-black-67'>+ {buyers.length - 1} more</span></Popover></span>
        }

        return name
    }

    return (
        <div className='j-stakeholder-wrapper'>
            <div className='cm-font-fam500 cm-margin-bottom15'>Stakeholders</div>
            <Space direction='vertical' className='cm-width100' size={4}>
                {
                    data?._rBuyerRoleMappings.map((_roleMapping: any, index: number) => (
                        <div className={`j-stakeholder-role-wrapper ${index % 2 === 0 ? "" : "bg-grey"}`} key={_roleMapping?.role?.uuid}>
                            <Row className='cm-width100'>
                                <Col span={10}><BS_Badge color={_roleMapping?.role?.properties?.color} text={_roleMapping?.role?.name} size="10px" space={"15px"}/></Col>
                                <Col span={14}>
                                    {
                                        _roleMapping.buyers.length > 0 ? 
                                            getBuyersName(_roleMapping.buyers)
                                        : 
                                            <div style={{fontStyle: "italic"}} className='cm-font-opacity-black-37'>Not Added</div>
                                    }
                                </Col>
                            </Row>
                        </div>
                    ))
                }
            </Space>
        </div>
    )
}

export default Stakeholders