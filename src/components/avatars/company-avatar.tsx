import { Avatar } from 'antd';

import { COMPANY_FALLBACK_ICON } from '../../constants/module-constants';
import { CommonUtil } from '../../utils/common-util';

const CompanyAvatar = (props: {size?: number, company: any}) => {

    const { size = 35, company }  =   props;

    return (
        <Avatar 
            size        =   {size} 
            shape       =   "square" 
            style       =   {{backgroundColor: "#ededed", color: "#000", fontSize: "18px", display: "flex" , padding: "3px", alignItems: "center", justifyContent: "center"}} 
            src         =   {
                                company.logoUrl 
                                ? 
                                    <img src={company.logoUrl} alt={company.companyName} style={{borderRadius: "4px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/> 
                                : 
                                    <img src={COMPANY_FALLBACK_ICON} alt={company.companyName} style={{borderRadius: "4px", objectFit: "scale-down"}} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src= COMPANY_FALLBACK_ICON;}}/> 
                            }
            >
            {CommonUtil.__getAvatarName(company.companyName, 2)}
        </Avatar>
    )
}

export default CompanyAvatar