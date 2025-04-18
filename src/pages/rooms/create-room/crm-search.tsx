import { useContext, useState } from "react";
import { debounce } from 'lodash';
import { Form, Select, Space, Tooltip } from "antd";
import { useLazyQuery } from "@apollo/client";

import { CRM_INTEGRATION_CONFIG } from "../../settings/config/integration-type-config";
import { SEARCH_DEALS } from "../../common/api/crm-query";
import { GlobalContext } from "../../../globals";

import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";
import Loading from "../../../utils/loading";

const { Option } = Select;

const CRM_DEALS_SEARCH_LIMIT = 50;

const CRMSearch = () => {

    const { $orgDetail }    =   useContext(GlobalContext);

    const [_searchDeals]  = useLazyQuery(SEARCH_DEALS, {
        fetchPolicy: "network-only"
    })

    const [deals, setDeals]             =   useState<any>([]);
    const [loading, setLoading]         =   useState<boolean>(false);
    const [searchKey, setSearchKey]     =   useState<string>("");    
    const [nextCursor, setNextCursor]   =   useState<string>("");

    const onScroll = async (event: any) => {
    
        if(nextCursor){
            const target = event.target;
            if (
                !loading &&
                target.scrollTop + target.offsetHeight === target.scrollHeight
            ) {

                target.scrollTo(0, target.scrollHeight);

                setLoading(true)
                _searchDeals({
                    variables: {
                        input : {
                            searchKey   :  searchKey,
                            cursorPgInput  :   {
                                limit      : CRM_DEALS_SEARCH_LIMIT,
                                nextCursor : nextCursor
                            }
                        }
                    },
                    onCompleted: (data: any) => {
                        setLoading(false)
                        setNextCursor(data?.searchDeals?.cursorPgOutput?.nextCursor ?? "")
                        setDeals((prevDeals: any) => [...prevDeals, ...(data?.searchDeals?.deals ?? [])]);
                    },
                    onError: () => {
                        setLoading(false)
                    }
                }) 
            }
        }
    };


    const handleSearch = (
        debounce((searchQuery: string) => {
            if(searchQuery){
                setLoading(true)
                _searchDeals({
                    variables: {
                        input : {
                            searchKey  : searchQuery,
                            cursorPgInput  :   {
                                limit      : CRM_DEALS_SEARCH_LIMIT,
                            }
                        }
                    },
                    onCompleted: (data: any) => {
                        setSearchKey(searchQuery ?? "")
                        setLoading(false)
                        setNextCursor(data?.searchDeals?.cursorPgOutput?.nextCursor ?? "")
                        setDeals(data?.searchDeals?.deals ?? [])
                    },
                    onError: () => {
                        setLoading(false)
                    }
                }) 
            }
        }, 1000)       
    )

    return (
        <Form.Item
            name        =   {"crmEntity"}
            label       =   {
                <Space>
                    <div className="cm-flex-align-center">{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo ? <img width={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.["logo-sm-size"]} height={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.["logo-sm-size"]} src={CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.productLogo}/> : null}</div>
                    <div>{CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.label}</div>
                    <Tooltip title={`Search ${CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName]?.deals} from your CRM, and map them with the Room`}>
                        <div>
                            <MaterialSymbolsRounded font="info" size="14"/>
                        </div>
                    </Tooltip>
                </Space>
            }
        >
            <Select 
                showSearch
                labelInValue 
                allowClear
                size                        =   "large"
                placeholder                 =   {<Space className="cm-flex" size={4}><MaterialSymbolsRounded font="search" size="18"/>Type to search in {CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName].displayName}</Space>}
                filterOption                =   {false}
                onPopupScroll               =   {onScroll}
                onSearch                    =   {handleSearch}
                loading                     =   {loading}
                optionLabelProp             =   "label"
                notFoundContent             =   {
                    loading 
                    ? 
                        <Loading/> 
                    : 
                        (
                            searchKey === "" ? 
                                <Space className="cm-flex-center">
                                    <MaterialSymbolsRounded font="search" size="22"/>
                                    <div>Type to search in {CRM_INTEGRATION_CONFIG[$orgDetail?.crmDetail?.serviceName].displayName}</div>
                                </Space>
                            : 
                                (
                                    deals.length === 0 && !loading ? 
                                        <Space style={{height:"100px"}} direction="vertical" className="cm-flex-center" size={2}>
                                            <div className="cm-font-opacity-black-85 cm-font-fam500">No deals found</div>
                                            <div className="cm-font-size12 cm-font-opacity-black-65">Enter any deal name to search it from the CRM</div>
                                        </Space> 
                                    : 
                                        null
                                )
                        )
                }
                defaultActiveFirstOption    =   {false}
                suffixIcon                  =   {null}
            >   
                {deals.map((_deal: any) => (
                    <Option key={_deal.id} title={_deal.name} label={_deal.name} disabled={_deal.isMapped}>
                        {_deal.name}
                    </Option>
                ))}
                {
                    loading ?
                        <Option disabled>
                            <Loading/>
                        </Option>
                    :
                        null
                }
            </Select>
        </Form.Item>
    );
};

export default CRMSearch;
