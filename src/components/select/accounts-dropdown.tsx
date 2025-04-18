import { Avatar, Select, Space } from "antd";
import MaterialSymbolsRounded from "../MaterialSymbolsRounded";
import EmptyText from "../not-found/empty-text";
import CompanyAvatar from "../avatars/company-avatar";
import { CommonUtil } from "../../utils/common-util";
import { useQuery } from "@apollo/client";
import { ACCOUNTS, GET_TOTAL_ACCOUNTS } from "../../pages/accounts/api/accounts-query";
import { useState, useEffect } from "react"; 
import Loading from "../../utils/loading";

const { Option } = Select;

const AccountsDropdown = () => {

    const [currentPage, setCurrentPage] =   useState(1);
    const [allData, setAllData]         =   useState<any>([]); 
    
    const [hasData, setHasData]         =   useState(true);

    const { data: aData, loading: aLoading } = useQuery(ACCOUNTS, {
        fetchPolicy: "network-only",
        variables: {
            pageConstraint: {
                page: currentPage,
                limit: 10
            }
        },
        notifyOnNetworkStatusChange: true
    });

    const  { data: searchAccountsCount }    =   useQuery(GET_TOTAL_ACCOUNTS, {
        fetchPolicy: "network-only",
    });


    useEffect(() => {
        if(aData) {
            if(aData.accounts.length < 1){
                setHasData(false)
            }
            setAllData((prevData: any) => [...prevData, ...aData.accounts]);
        }
    }, [aData]);

    const handlePopupScroll = (event: any) => {
        const { target } = event;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight && searchAccountsCount.getTotalAccounts !== allData.length) {
            if(hasData){
                setCurrentPage((page) => page + 1);
            }
        }
    };

    return (
        <Select
            showSearch
            allowClear
            onPopupScroll       =   {handlePopupScroll}
            loading             =   {aLoading}
            size                =   'large'
            optionFilterProp    =   'filter'
            optionLabelProp     =   "label"
            placeholder         =   "Select account"
            suffixIcon          =   {<MaterialSymbolsRounded font="expand_more" size="18" />}
            notFoundContent     =   {
                <div style={{ height: "50px" }}>
                    <EmptyText text="No accounts found" />
                </div>
            }
        >
            {allData.map((_account: any) => (
                <Option key={_account.uuid} value={_account.uuid} filter={_account.companyName + _account.industryType} generateTitle={_account.companyName}
                    label={
                        <Space className="cm-flex">
                            <Avatar size={25} shape='square' style={{ backgroundColor: "#ededed", color: "#000", fontSize: "15px", display: "flex", alignItems: "center" }} src={_account.logoUrl ? <img src={_account.logoUrl} alt={_account.companyName} style={{ borderRadius: "4px" }} /> : ""}>
                                {CommonUtil.__getAvatarName(_account.companyName, 1)}
                            </Avatar>
                            <div className="cm-font-fam500 cm-font-size14">{_account.companyName}</div>
                        </Space>
                    }
                >
                    <Space>
                        <CompanyAvatar size={35} company={_account} />
                        <Space direction="vertical" size={0}>
                            <div className="cm-font-fam500 cm-font-size14">{_account.companyName}</div>
                            <div className="cm-font-fam300 cm-font-size12">{_account.industryType}</div>
                        </Space>
                    </Space>
                </Option>
            ))}
            {
                aLoading && 
                <div className="cm-padding5">
                    <Loading />
                </div>
            }
        </Select>
    )
}

export default AccountsDropdown;
