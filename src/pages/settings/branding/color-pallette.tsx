import { Col, Row, Space } from 'antd';

import { THEME_COLOR_CONFIG } from '../theme-color-config';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';

const ColorPallette = (props: {defaultColor: string,  handleColorChange: (key: string) => void }) => {

    const { defaultColor, handleColorChange }  =   props;

    return (
        <div className='cm-flex cm-flex-direction-row' style={{columnGap: "40px"}}>
            <Space direction='vertical' size={25}>
                <Space direction='vertical' >
                    <div className='cm-font-size16 cm-font-fam500'>Theme</div>
                    <div className='cm-font-opacity-black-65'>Choose a color that matches your brand</div>
                </Space>
                <Row gutter={[25, 20]} style={{width: "420px"}}>
                    {
                        Object.values(THEME_COLOR_CONFIG).map((_color: any) => (
                            <Col>
                                <div style={{backgroundColor: _color.primaryColor}} className='cm-cursor-pointer j-color-cell' onClick={() => handleColorChange(_color.key)}>
                                    {defaultColor === _color.key ? <MaterialSymbolsRounded font='done' color='#fff' size='24'/> : null}
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </Space>
            <Space direction='vertical' size={0} className='cm-margin-left15'>
                <div className='j-palette-preview'>
                    <div className='j-paletter-preview-inner'>
                        <div className='j-palette-preview-header'>
                            <div className='j-palette-header-icons-wrapper'>
                                <div className='j-palette-header-icons' style={{backgroundColor: "#E66E5D"}}></div>
                                <div className='j-palette-header-icons' style={{backgroundColor: "#F7D664"}}></div>
                                <div className='j-palette-header-icons' style={{backgroundColor: "#8CEA5F"}}></div>
                            </div>
                        </div>
                        <div className='j-palette-body-wrapper'>
                            <div className='j-palette-sider'>
                                <div className='j-palette-user-wrapper'>
                                    <div className='j-palette-avatar'></div>
                                    <Space direction='vertical' size={3}>
                                        <div className='j-palette-user-title'></div>
                                        <div className='j-palette-user-subtitle'></div>
                                    </Space>
                                </div>
                                <Space direction='vertical' className='cm-width100' size={6}>
                                    <div className='j-palette-step' style={{backgroundColor: THEME_COLOR_CONFIG[defaultColor]?.bgColor}}>
                                        <div className='j-palette-step-name' style={{backgroundColor: THEME_COLOR_CONFIG[defaultColor]?.primaryColor}}></div>
                                    </div>
                                    <div className='j-palette-step'>
                                        <div className='j-palette-step-name'></div>
                                    </div> 
                                    <div className='j-palette-step'>
                                        <div className='j-palette-step-name'></div>
                                    </div> 
                                    <div className='j-palette-step'>
                                        <div className='j-palette-step-name'></div>
                                    </div> 
                                    <div className='j-palette-step'>
                                        <div className='j-palette-step-name'></div>
                                    </div> 
                                </Space>
                            </div>
                            <div className='j-palette-body'>
                                <div className='j-palette-body-head'>
                                    <Space size={3}>
                                        <div className='j-palette-logo'></div>
                                        <div className='j-palette-joiner'>+</div>
                                        <div className='j-palette-logo'></div>
                                    </Space>
                                    <div className='j-palette-button' style={{backgroundColor: THEME_COLOR_CONFIG[defaultColor]?.primaryColor}}></div>
                                </div>
                                <div className='j-palette-body-content'>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='j-palette-preview-title'>
                    Preview
                </div>
            </Space>
        </div>
    )
}

export default ColorPallette