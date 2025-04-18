import { Layout, Space } from "antd";

const { Header }    =   Layout;

const OnboardingHeader = (props: {headerColor?: "blue"|"white"}) => {

    const { headerColor }   =   props;

    const color = headerColor === "blue" ? "#161A30" : "#fff";
    
    return (
        <Header className={`j-onboarding-header cm-flex-space-between cm-width100`} style={{backgroundColor: color}}>
            <Space className="cm-flex-align-center cm-flex-space-between cm-width100 cm-padding-inline20">
                <Space size={30} className="cm-flex-align-center">
                    <a className='j-app-logo' href="/">
                        <img style={{width: "50px", height: "50px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/buyerstage-product-logo.svg`} alt='logo'/>
                    </a>
                    <Space size={20}>
                        <div className="j-header-option-skleton" style={headerColor === "blue" ? {opacity : "20%"} : {}}></div>
                        <div className="j-header-option-skleton" style={headerColor === "blue" ? {opacity : "20%"} : {}}></div>
                        <div className="j-header-option-skleton" style={headerColor === "blue" ? {opacity : "20%"} : {}}></div>
                        <div className="j-header-option-skleton" style={headerColor === "blue" ? {opacity : "20%"} : {}}></div>
                    </Space>
                </Space>
                <div className="j-header-profile-skleton" style={headerColor === "blue" ? {opacity : "20%"} : {}}></div>
            </Space>
        </Header>
    )
}

export default OnboardingHeader