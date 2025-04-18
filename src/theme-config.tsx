import { ConfigProvider } from "antd";

import App from "./App";

const ThemeConfig = () => {
    return (
        <ConfigProvider
            prefixCls   =   'ja'
            theme       =   {{
                token: {
                    fontFamily          :   'Inter400',
                    colorBgContainer    :   '#fefefe',
                    colorPrimary        :   '#0065E5',
                    fontSize            :   14,
                    borderRadius        :   4, 
                    fontWeightStrong    :   400
                },
                components: {
                    Layout: {
                        headerBg    :   '#0E072F',
                        bodyBg      :   '#fff',
                    },
                    Table: {
                        borderColor    :   "#E8E8EC",
                        headerBorderRadius: 4
                    }
                },
            }}
        >
            <App />
        </ConfigProvider>
    )
}

export default ThemeConfig