import { Avatar } from 'antd';

import { CommonUtil } from '../../utils/common-util';

const SellerAvatar = (props: {seller: any, size?: number, fontSize?: number, isOwner?: boolean}) => {

    const { 
        seller, 
        size        =   35, 
        fontSize    =   14,
        isOwner
    } =   props;

    return (
        <Avatar 
            size        =   {size} 
            style       =   {{backgroundColor: "#ededed", color: "#000", fontSize: `${fontSize}px`, display: "flex", alignItems: "center", outline: isOwner ? "2px solid #0065e5" : "2px solid #f2f2f2"}}
            src         =   {
                seller.profileUrl 
                ? 
                    <img src={seller.profileUrl} alt={CommonUtil.__getFullName(seller.firstName, seller.lastName)}/> 
                : 
                    ""
            }
        >
            {CommonUtil.__getAvatarName(seller.firstName,1)}
        </Avatar>
    )
}

export default SellerAvatar