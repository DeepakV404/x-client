import { Space, Button } from "antd"

import { TEMPLATE_FAQ } from "../../../../constants/module-constants"

const RoomFaq = () => {
    
    const openFAQ = () => {
        return window.open(`${window.location.href.split("#")[0]}#/settings/faqs`, "_blank")
    }

    return (
        <div className='cm-height100 cm-padding15 cm-background-gray cm-flex-center'>
            <Space direction="vertical" className="cm-flex-center" size={12}>
                <img className="cm-margin-block20" src={TEMPLATE_FAQ} width={130} height={100} alt=""/>
                <div className="cm-font-size18 cm-font-fam500">FAQ's</div>
                <div className="cm-font-size16 cm-font-fam400 cm-secondary-text">Click the button below to access and manage your FAQ's</div>
                <Button className="cm-margin-block20" type="primary" onClick={openFAQ}>Go to FAQ's</Button>
            </Space>
        </div>
    )
}

export default RoomFaq
