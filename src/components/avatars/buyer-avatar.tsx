import { Avatar } from 'antd';

import { CommonUtil } from '../../utils/common-util';

const BuyerAvatar = (props: {buyer: any, size?: number, fontSize?: number}) => {

    const { 
        buyer, 
        size        =   35, 
        fontSize    =   14
    } =   props;

    return (
        <Avatar 
            size        =   {size} 
            style       =   {{backgroundColor:`${buyer.status === "INVITED" ? "#f2f2f2" :"#ededed" }`, color: "#000", fontSize: `${fontSize}px`, display: "flex", alignItems: "center",opacity: `${buyer.status === "INVITED" ? "70%" :"100%" }`}} 
            src         =   {
                buyer.profileUrl 
                ? 
                    <img src={buyer.profileUrl} alt={CommonUtil.__getFullName(buyer.firstName, buyer.lastName)}/> 
                : 
                    ""
            }
        >
            {CommonUtil.__getAvatarName(buyer.firstName,1)}
        </Avatar>
    )
}

export default BuyerAvatar