import { useState } from 'react';
import { Avatar, Divider, List, Space, Tag, Tooltip, Typography, theme } from 'antd';

import { CommonUtil } from '../../../utils/common-util';

import EmptyText from '../../../components/not-found/empty-text';
import ManageSellerListItem from './manage-seller-list-item';
import HandoffConfirmation from '../room-header/handoff/handoff-confirmation';

const ManageRoomSellers = (props: {sellers: any, owner: any, previewLink: string, room: any}) => {

    const { token: { colorPrimary } }               =   theme.useToken()
    
    const { sellers, owner, room }                  =   props;

    const [showConfirmation, setShowConfirmation]   =   useState<any>({
        visibility  :   false,
        option      :   "",
        owner       :   null
    });

    const { Text } = Typography

    return (
        <>
            <div className="cm-width100">
                <div className="cm-font-size16 cm-flex-align-center cm-modal-header cm-font-fam500">Manage Team Members</div>
                <div className='cm-padding-inline15'>
                    {
                        owner ? 
                            <>
                                <Space className='cm-flex-space-between cm-width100 cm-margin-top10'>
                                    <Space>
                                        <Tooltip title={CommonUtil.__getFullName(owner.firstName, owner.lastName)} placement="bottom">
                                            <Avatar shape='square' size={43} style = {{backgroundColor: "#ededed", color: "#000", fontSize: "14px", display: "flex", alignItems: "center", border: `2px solid ${colorPrimary}`}} src={owner.profileUrl ? <img src={owner.profileUrl} alt={CommonUtil.__getFullName(owner.firstName, owner.lastName)}/> : ""}>
                                                {CommonUtil.__getAvatarName(CommonUtil.__getFullName(owner.firstName, owner.lastName), 1)}
                                            </Avatar>
                                        </Tooltip>
                                        <Space direction='vertical' size={0}>
                                            <Space size={10}>
                                                <Text style={{maxWidth: "250px"}} ellipsis={{tooltip: CommonUtil.__getFullName(owner.firstName, owner.lastName)}} className='cm-font-fam500'>{CommonUtil.__getFullName(owner.firstName, owner.lastName)}</Text>
                                            </Space>
                                            <div className='cm-font-size12'>{owner.emailId}</div>
                                        </Space>
                                    </Space>

                                    <Tag> Owner </Tag>
                                </Space>
                                <Divider style={{marginBlock: "10px"}}/>
                            </>
                        :
                            null
                    }
                </div>
                <List
                    className='j-share-room-link-wrap cm-padding-inline15'
                    itemLayout  =   "horizontal"
                    dataSource  =   {sellers.filter((_seller: any) => !_seller.isOwner)}
                    locale      =   {{
                        emptyText:  <div className='cm-flex-center' style={{height: "300px"}}><EmptyText text='No  other users found'/></div>
                    }}
                    renderItem  =   {(_seller: any) => (
                        <List.Item key={_seller.uuid}>
                            <ManageSellerListItem seller={_seller} onMarkAsOwner={() => setShowConfirmation({visibility: true, option: "owner_update", owner: _seller})}/>
                        </List.Item>
                    )}
                />
            </div>
            <HandoffConfirmation
                isOpen      =   {showConfirmation.visibility}
                onClose     =   {() => setShowConfirmation({visibility: false, option: ""})}
                option      =   {showConfirmation.option}
                room        =   {room}
                owner       =   {showConfirmation.owner}
            />
        </>
    )
}

export default ManageRoomSellers