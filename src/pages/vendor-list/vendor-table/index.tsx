import { Button, Space, Table, Tag, Typography } from "antd"
import { useQuery } from "@apollo/client";

import { VENDORS } from "../api/vendor-query";
import { BUYERSTAGE_WEBSITE_URL, EMPTY_CONTENT_ACCOUNT_IMG } from "../../../constants/module-constants";

import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";
import VendorNameColumn from "./vendor-name-column";
import Loading from "../../../utils/loading";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography

const VendorTable = (props: {search: any, setShowModal: any}) => {

    const { search, setShowModal }    =   props;

    const { data, loading, error }                    =   useQuery(VENDORS, {
        fetchPolicy: "network-only"
    })

    const renderers = {
        "_vendor": (_company: string, _record: any) => {
            return(
                <VendorNameColumn company={_record} record={_record}/>
            )
        },
        "_websiteURL": (websiteUrl: any) => (
            <a href={BUYERSTAGE_WEBSITE_URL} target="_blank">{websiteUrl}</a>
        ),
        "_category": (_category: string) => {
            return(
                <Tag color="blue">{_category}</Tag>
            )
        }
    };

    const columns: any = [
        {
            title       :   <div className='cm-font-fam500'>Vendor</div>,
            dataIndex   :   "companyName",
            key         :   'companyName',
            render      :   renderers._vendor,
            width       :   '300px',
            fixed       :   "left"
        },
        {
            title       :    <div className='cm-font-fam500'>Portal Link</div>,
            dataIndex   :   'websiteUrl',
            key         :   'websiteUrl', 
            width       :   '250px',
            render      :   renderers._websiteURL
        },
        {
            title       :   <div className='cm-font-fam500'>Category</div>,
            dataIndex   :   'industryType',
            key         :   'industryType',
            render      :   renderers._category,
            width       :   '150px',
        },
    ]

    const filteredData = data?.vendors?.filter((vendor: any) =>
        vendor.companyName.includes(search)
    );

    const handleVendorClick = (record: any) => {
        window.open(`${import.meta.env.VITE_APP_DOMAIN}/${record.tenantName}#/`);
    };

    if(error) return <SomethingWentWrong/>;

    return (
        <div className="j-vendor-list-body cm-padding20 cm-overflow-auto">
            <Table 
                bordered
                className       =   'cm-height100 j-accounts-table'
                rowClassName    =   {"cm-cursor-pointer"}
                scroll          =   {{y: (window.innerHeight - 200)}}
                pagination      =   {false}
                dataSource      =   {filteredData}
                columns         =   {columns} 
                locale          =   {{
                    emptyText   :   (
                                        <div className='cm-flex-center' style={{ height: "calc(100vh - 230px)", width: "calc(100% - 60px)" }}>
                                            {(loading) 
                                                ? 
                                                    <Loading /> 
                                                : 
                                                    <div className='cm-flex-center cm-width100'>
                                                        <Space direction='vertical' className='cm-flex-align-center' size={20}>
                                                            <Space direction='vertical' className='cm-flex-align-center' size={0}>
                                                                <img height={200} width={200} src={EMPTY_CONTENT_ACCOUNT_IMG} alt=""/>
                                                                <Text className='cm-font-size18'>No Vendors Found</Text>
                                                            </Space>
                                                            <Button type='primary' className='cm-flex-center cm-icon-button' onClick={() => setShowModal(true)} icon={<MaterialSymbolsRounded font="add" size='20' weight='400'/>}>Add Vendor</Button>
                                                        </Space>
                                                    </div>}
                                        </div>
                                    )
                }}
                onRow           =   {(record) => ({
                    onClick: () => handleVendorClick(record),
                })}
            />
        </div> 
    )
}

export default VendorTable