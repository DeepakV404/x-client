import { Button, Space } from "antd"

import { TEMPLATE_FAQ } from "../../../../constants/module-constants"
import { useNavigate } from "react-router-dom"


const RoomNextSteps = () => {

    const navigate   =   useNavigate()

    return (
        <div className='cm-height100 cm-padding15 cm-flex-center'>
            <Space direction="vertical" className="cm-flex-center" size={12}>
                <img className="cm-margin-block20" src={TEMPLATE_FAQ} width={130} height={100} alt=""/>
                <div className="cm-font-size18 cm-font-fam500">Mutual Action Plan</div>
                <div style={{width: "500px", lineHeight: "22px"}} className="cm-font-size16 cm-text-align-center cm-secondary-text cm-line-height23">Add stages and action points to align sales with the buyer's journey.</div>
                <Button className="cm-margin-block20" type="primary" onClick={() => navigate("../../collaboration")}>Go to Action Plan</Button>
            </Space>
        </div>
    )
}

export default RoomNextSteps
