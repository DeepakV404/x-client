import { Suspense, lazy } from "react";
import { Button, Space } from "antd";

import Loading from "../../utils/loading";

const ReactPlayer = lazy(() => import("react-player"))

const VendorOnboarding = (props: {title: string, ctaText: string | undefined, videoLink: string | null, imgLink: string | null, desc: any, ctaLink: () => void}) => {

    const { title, ctaText, videoLink, desc, ctaLink, imgLink } =   props;

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
                {ctaText && <Button className="cm-cursor-pointer" type="primary" onClick={ctaLink}> {ctaText} </Button>}
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
            {
                imgLink ?
                    <div className="j-onboarding-img">
                        <img src={imgLink} style={{ width: "100%", borderRadius: "6px"}} alt=""/>
                    </div>
                :
                    null
            }
        </div>
    )
}

export default VendorOnboarding