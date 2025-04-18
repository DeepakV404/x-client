import { ConfigProvider } from "antd"

const HubspotThemeConfig = (props: {children: any}) => {

    const { children }  =   props;

    const currentThemeColor     =   "#00a4bd";
    
    return (
        <ConfigProvider
            prefixCls   =   'ja'
            theme       =   {{
                token: {
                    fontFamily          :   'Inter',
                    colorBgContainer    :   '#fefefe',
                    colorPrimary        :   currentThemeColor,
                    fontSize            :   14,
                    borderRadius        :   5,
                    fontWeightStrong    :   400 
                },
                components: {
                    Layout: {
                        headerBg    :   '#0E072F',
                        bodyBg      :   '#fff',
                    },
                },
            }}
        >   
            <style dangerouslySetInnerHTML={{__html: `:root { --primary-color: ${currentThemeColor} };`}} />
            {children}
        </ConfigProvider>
    )
}

export default HubspotThemeConfig