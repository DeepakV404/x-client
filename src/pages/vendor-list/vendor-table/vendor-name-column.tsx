import { Space, Typography } from "antd";
import { LinkedinFilled, TwitterOutlined } from '@ant-design/icons';
import { capitalize }  from 'lodash';

import CompanyAvatar from "../../../components/avatars/company-avatar";
import MaterialSymbolsRounded from "../../../components/MaterialSymbolsRounded";

const { Text }  =   Typography;

const VendorNameColumn = (props: {company: any, record: any}) => {

    const { company, record }   =   props;
    
    return(
        <div style={{columnGap: "15px"}} className='cm-width100 cm-flex'>
            <div style={{width: "45px"}}>
                <CompanyAvatar company={company} size={42}/>
            </div>
            <div style={{width: "calc(100% - 50px)", display: 'flex',flexDirection: "column"}}>
                <div className='cm-width100 cm-flex-space-between-center'>
                    <Text style={{maxWidth: "200px"}} ellipsis={{tooltip: record.companyName}} className='cm-font-fam500 cm-font-size14'>
                        {capitalize(record.companyName)}
                    </Text>
                </div>
                <Space size={10}>
                    {
                        record.websiteUrl ?
                            <MaterialSymbolsRounded className='cm-cursor-pointer cm-dark-grey-text' font='link' size='16' onClick={(event) => {event.stopPropagation(); window.open(record.websiteUrl, "_blank")}}/>
                        :
                            null
                    }
                    {
                        record.linkedInUrl ?
                            <LinkedinFilled className='cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event) => {event.stopPropagation(); window.open(record.linkedInUrl, "_blank")}}/>
                        :
                            null
                    }
                    {
                        record.twitterUrl ?
                            <TwitterOutlined className='cm-cursor-pointer cm-dark-grey-text' size={13} onClick={(event) => {event.stopPropagation(); window.open(record.twitterUrl, "_blank")}}/>
                        :
                            null
                    }
                </Space>
            </div>
        </div>
    )
}

export default VendorNameColumn