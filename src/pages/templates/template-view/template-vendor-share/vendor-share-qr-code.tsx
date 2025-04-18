import { useState } from "react";

import { Button, Dropdown, MenuProps, QRCode, QRCodeProps, Space } from "antd";
import { toUpper }  from "lodash";

import MaterialSymbolsRounded from "../../../../components/MaterialSymbolsRounded";

const VendorShareQRCode = (props: { sharableLink: string }) => {

    const { sharableLink }  =   props;

    const [renderType, setRenderType]   =    useState<QRCodeProps['type'] | 'png'>('svg');

    const items: MenuProps['items']     =   [
        { 
            key    : "svg",
            label  : <Space>SVG{renderType === "svg" ? <MaterialSymbolsRounded font="check" size="16" /> : null}</Space>, 
        },
        { 
            key    : "png",
            label  : <Space>PNG{renderType === "png" ? <MaterialSymbolsRounded font="check" size="16" /> : null}</Space>, 
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e: any) => {
        setRenderType(e.key as QRCodeProps['type'] | 'png');
    };

    function doDownload(url: string, fileName: string) {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const downloadPng = () => {
        const canvas = document.getElementById('qrcode')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            doDownload(url, 'QRCode.png');
        }
    };

    const downloadSvg = () => {
        const svg = document.getElementById('qrcode')?.querySelector<SVGElement>('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            doDownload(url, 'QRCode.svg');
        }
    };

    return (
        <>
            <div className="cm-padding15">
                <div className="cm-font-fam500">QR Code</div>
                <div className="cm-font-opacity-black-65 cm-font-size13">Use the QR code across your print materials and social media collaterals</div>
                <Space direction="vertical" className="cm-margin-top20">
                    <div>File Format</div>
                    <Dropdown 
                        menu        =   {{ items, onClick: handleMenuClick, selectedKeys: [renderType || 'png'] }} 
                        trigger     =   {["click"]} 
                        placement   =   {"bottom"}
                    >
                        <Button style={{paddingRight: "5px", width: "100px"}} className="cm-flex-justify-start ">
                            <Space className='cm-width100 cm-cursor-pointer cm-flex-space-between'>
                                {toUpper(renderType)}
                                <MaterialSymbolsRounded font='expand_more' size="18" />
                            </Space>
                        </Button>
                    </Dropdown> 
                </Space>
                <div className="j-pod-share-qr-code cm-flex-center cm-width100" id="qrcode">
                    <QRCode
                        value   =   {sharableLink}
                        bgColor =   "#fff"
                        type    =   {renderType === 'png' ? 'canvas' : renderType} 
                        size    =   {220}
                    />
                </div>
                <div className="cm-width100 cm-flex-center">
                    <Button 
                        type        =   "primary" 
                        onClick     =   {renderType === 'png' ? downloadPng : downloadSvg} 
                    >
                        Download
                    </Button>  
                </div>
            </div>
        </>
    );
};

export default VendorShareQRCode;
