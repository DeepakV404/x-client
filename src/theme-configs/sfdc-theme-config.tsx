import { ConfigProvider } from "antd"

const SFDCThemeConfig = (props: {children: any}) => {

    const { children }  =   props;

    const currentThemeColor     =   "#0070D2";
    
    return (
        <ConfigProvider
            prefixCls   =   'ja'
            theme       =   {{
                token: {
                    fontFamily          :   'Inter400',
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
            {children}
        </ConfigProvider>
    )
}

export default SFDCThemeConfig