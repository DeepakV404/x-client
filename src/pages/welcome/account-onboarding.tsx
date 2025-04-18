import { Suspense, lazy } from "react";
import { Button, Space } from "antd";

import MaterialSymbolsRounded from "../../components/MaterialSymbolsRounded";
import Loading from "../../utils/loading";

const ReactPlayer = lazy(() => import("react-player"))

const AccountOnboarding = (props: {title: string, ctaText: string | undefined, onClick: () => void, videoLink: string | null, desc: any, ctaLink: () => void}) => {

    const { title, ctaText, onClick, videoLink, desc, ctaLink } =   props;

    return (
        <div className="j-onboarding-content-wrapper">
            <Space direction="vertical" className={videoLink ? "j-onboarding-content" : "cm-width100"} size={30}>
                <Space direction="vertical">
                    <div className="cm-font-size16 cm-font-fam600">{title}</div>
                    <div style={{lineHeight: "22px"}}>
                            <div className='j-onboarding-content-list'>
                                <ol>
                                    {desc.map((_item: any) => 
                                        _item
                                    )}
                                </ol>
                            </div>
                    </div>
                </Space>
                <Space size={20} className="cm-cursor-pointer">
                    {ctaText && <Button className="cm-cursor-pointer" type="primary" onClick={ctaLink}> {ctaText} </Button>}
                    <Space onClick={onClick} className="cm-cursor-pointer">
                        <MaterialSymbolsRounded font="open_in_new" size="18" />
                        <span className="cm-font-size12">Help Document</span>
                    </Space>
                </Space>
            </Space>
            {
                videoLink ?
                    <div className="j-onboarding-video">
                        <Suspense fallback={<Loading/>}>
                            <ReactPlayer
                                className   =   "j-onboarding-video-player" 
                                width       =   "100%"
                                height      =   "100%"
                                controls    =   {true}
                                url         =   {videoLink}
                                loop        =   {false}
                                config={{
                                    youtube: {
                                        playerVars: { autoplay: 0 }
                                    },
                                }}
                            />
                        </Suspense>
                    </div>
                :
                    null
            }
        </div>
    )
}

export default AccountOnboarding