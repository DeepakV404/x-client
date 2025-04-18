import { useState } from "react";
import { Divider, Dropdown, Input, Menu, Space, Typography } from "antd";

import { CommonUtil } from "../../utils/common-util"

import useLocalization from "../../custom-hooks/use-translation-hook";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import SellerAvatar from "../avatars/seller-avatar";
import Translate from "../Translate";
import BuyerAvatar from "../avatars/buyer-avatar";

interface StakeholderDropdownProps {
    sellers?        :   any[];
    buyers?         :   any[];
    selectedSellers :   any[];
    selectedBuyers  :   any[];
    onSelect        :   any;
    iconSize?       :   string;
    shouldTraslate? :   boolean;
}
const { Text } = Typography; 

const StakeholderDropdown: React.FC<StakeholderDropdownProps> = (props) => {
    
    const {sellers, buyers, selectedSellers, selectedBuyers, onSelect, iconSize, shouldTraslate=false} = props;

    const[search, setSearch]    =   useState("");

    const { translate } = useLocalization();
    
    const activeSellers         =   sellers?.filter(_seller => _seller.status !== "IN_ACTIVE" && _seller.status !== "DELETED")
    const activeBuyers          =   buyers?.filter(_buyer => _buyer.status !== "IN_ACTIVE" )
    
    const filterSelectedSellers =   activeSellers ? activeSellers.filter(seller => !selectedSellers.some(selectedSeller => selectedSeller.uuid === seller.uuid)) : [];
    const filterSelectedBuyers  =   activeBuyers ? activeBuyers.filter(buyer => !selectedBuyers.some(selectedBuyer => selectedBuyer.uuid === buyer.uuid)) : []

    const filterSearchSeller    =   search ? filterSelectedSellers.filter(seller => CommonUtil.__getFullName(seller.firstName, seller.lastName).toLowerCase().includes(search.toLowerCase())) : filterSelectedSellers;
    const filterSearchBuyer     =   search ? filterSelectedBuyers.filter(buyer => CommonUtil.__getFullName(buyer.firstName, buyer.lastName).toLowerCase().includes(search.toLowerCase())) : filterSelectedBuyers;
    
    const Assignees = (
        <Menu className="cm-overflow-hidden">
            <Menu.Item className="cm-margin10" disabled style={{cursor: "text", background: "none"}}>
                <Input placeholder={shouldTraslate ? translate("common-labels.search") : "Search"} className="cm-width100" suffix={<MaterialSymbolsRounded font="search" size="18" color="#c1c1c1"/>} allowClear onChange={(e) => setSearch(e.target.value)}/>
            </Menu.Item>
            {
                (filterSearchSeller.length > 0 || filterSearchBuyer.length > 0) 
                ? 
                    <div className="j-room-stakeholder-dropdown">
                        <Menu>
                            {
                                sellers ?
                                    filterSearchSeller.length > 0 
                                    ? 
                                        filterSearchSeller.map((assignee) => {                                       
                                            return (
                                                <Menu.Item className="j-stakeholder-menu-item" key={assignee.uuid} onClick={() => handleUserChange(assignee)}>
                                                    <Space>
                                                        <SellerAvatar seller={assignee} size={25} fontSize={12} />
                                                        <div className="cm-flex-align-center">
                                                            <Text className="cm-font-fam500" style={{ maxWidth: "200px" }} ellipsis={{ tooltip: (CommonUtil.__getFullName(assignee.firstName, assignee.lastName)) }}>
                                                                {CommonUtil.__getFullName(assignee.firstName, assignee.lastName)}
                                                            </Text>
                                                        </div>
                                                    </Space>
                                                </Menu.Item>
                                            );
                                        })
                                    : 
                                        <div className="cm-font-size13 cm-flex-center cm-padding20">
                                            {shouldTraslate ? <Translate i18nKey="common-empty.no-sellers-found"/> : "No Sellers Found"}
                                        </div> 
                                :
                                    null
                            }
                            {
                                buyers 
                                ?
                                    <>
                                        {sellers ? <Divider orientation="left" className="cm-font-size14">{shouldTraslate ? <Translate i18nKey="common-labels.buyers"/> : "Buyers"}</Divider> : null}
                                        {
                                            filterSearchBuyer.length > 0 
                                            ? 
                                                filterSearchBuyer.map((assignee) => {
                                                    return (
                                                        <Menu.Item className="j-stakeholder-menu-item" key={assignee.uuid} onClick={() => handleUserChange(assignee)}>
                                                            <Space>
                                                                <BuyerAvatar buyer={assignee} size={25} fontSize={12} />
                                                                <div className="cm-flex-align-center">
                                                                    <Text className="cm-font-fam500" style={{maxWidth: "200px"}} ellipsis={{tooltip: (CommonUtil.__getFullName(assignee.firstName, assignee.lastName)) }}>
                                                                        {CommonUtil.__getFullName(assignee.firstName, assignee.lastName)}
                                                                    </Text>
                                                                </div>
                                                            </Space>
                                                        </Menu.Item>
                                                    );
                                                })
                                            : 
                                                <div className="cm-font-size13 cm-flex-center cm-padding20">
                                                    {shouldTraslate ? <Translate i18nKey="common-empty.no-buyers-found"/> : "No Buyers Found"}
                                                </div>
                                        }
                                    </>
                                : 
                                    null
                            }
                        </Menu>
                    </div>
                : 
                    <div className="cm-font-size13 cm-flex-center cm-padding20">
                        {shouldTraslate ? <Translate i18nKey="common-empty.no-users-found"/> : "No Users Found"}
                    </div>
            }
        </Menu>
    )

    const handleUserChange = (user: any) => {
        onSelect(user);
    }

    return(
        <Dropdown overlay={Assignees} overlayClassName="j-buyer-ap-assignee-select" placement="bottomLeft" overlayStyle={{minWidth: "200px"}} trigger={["click"]}>
            <div className="j-buyer-add-assignee cm-cursor-pointer" onClick={(event) => event.stopPropagation()}>
                <MaterialSymbolsRounded font="person_add" filled size={iconSize ? iconSize : "18"}/>
            </div>
        </Dropdown>
    )
}

export default StakeholderDropdown