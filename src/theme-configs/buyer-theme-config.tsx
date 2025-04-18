import { useContext } from "react";
import { ConfigProvider } from "antd";

import { BuyerGlobalContext } from "../buyer-globals";
import { THEME_COLOR_CONFIG, THEME_DEFAULT } from "../pages/settings/theme-color-config";

const BuyerThemeConfig = (props: {children: any}) => {

    const { children }  =   props;
    
    const { $orgProperties }   =   useContext(BuyerGlobalContext);

    return (
        <ConfigProvider
            prefixCls   =   'ja'
            theme       =   {{
                token: {
                    fontFamily          :   'Inter400',
                    colorBgContainer    :   '#fefefe',
                    colorPrimary        :   THEME_COLOR_CONFIG[$orgProperties.brandColor ? $orgProperties.brandColor : THEME_DEFAULT].primaryColor,
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
            <>
                <style dangerouslySetInnerHTML={{__html: `:root { --primary-color: ${THEME_COLOR_CONFIG[$orgProperties.brandColor ? $orgProperties.brandColor : THEME_DEFAULT].primaryColor}; --menu-color: ${THEME_COLOR_CONFIG[$orgProperties.brandColor ? $orgProperties.brandColor : THEME_DEFAULT].bgColor}; --light-bg-color: ${THEME_COLOR_CONFIG[$orgProperties.brandColor ? $orgProperties.brandColor : THEME_DEFAULT].bgColor}  };`}} />
                {children}
            </>
        </ConfigProvider>
    )
}

export default BuyerThemeConfig