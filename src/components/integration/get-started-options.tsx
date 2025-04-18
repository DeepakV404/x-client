import { Radio, Space, Typography } from 'antd';

import MaterialSymbolsRounded from '../MaterialSymbolsRounded';

const { Text }  =   Typography

const GetStartedOptions = (props: {setCurrentView?: any, libraryURL: string, linksURL: string, handleCreateRoomClick: () => void}) => {

    const { handleCreateRoomClick, setCurrentView }  =   props;

    return (
        <>
            <Space className='cm-width100 cm-flex-center' style={{height: "25px", marginBottom: "5px"}}>
                <Radio.Group value={"rooms"} className='cm-flex' size='small' >
                    <Radio.Button value="rooms" key={"rooms"} className='cm-font-size12 cm-flex' onClick={() => setCurrentView("empty")}>
                        Room
                    </Radio.Button>
                    <Radio.Button value="library" key={"library"}  className='cm-font-size12 cm-flex' onClick={() => setCurrentView("library")}>
                        Library
                    </Radio.Button>
                    <Radio.Button value="links" key={"links"}  className='cm-font-size12 cm-flex' onClick={() => setCurrentView("links")}>
                        Links
                    </Radio.Button>
                </Radio.Group>
            </Space>
            <div className="cm-width100 cm-flex-center" style={{overflow: "hidden", background: "linear-gradient(360deg, #FFFFFF 0%, #ECFEFF 100%", height: "calc(100% - 30px)"}}>
                <Space className='cm-text-align-center cm-width100' direction='vertical'>
                    {/* <Space direction='vertical'>
                        <Text className='cm-font-fam500 cm-font-size16'>Buyerstage</Text>
                        <Text className='cm-font-fam500 cm-font-size28'>Start by creating a Room?</Text>
                    </Space> */}
                    <Space style={{marginTop: "30px"}} size={20}>
                        <div className='cm-background-white cm-cursor-pointer cm-flex-center cm-flex-direction-column cm-padding20' style={{height: "250px", width: "250px", borderRadius: "20px", border: "1px solid #E9E9E9", boxShadow: "0px 1px 4px 0px #4444441A"}} onClick={() => handleCreateRoomClick()}>
                            <div className='cm-flex-center' style={{height: "60px", width: "60px", borderRadius: "20px", background: "#FFD8CC", border: "1px solid #FFD8CC", boxShadow: "2px 2px 3px 0px #FFFFFFB2 inset"}}><MaterialSymbolsRounded font="roofing" color='#000000D9'/></div>
                            <Space direction='vertical' className='cm-margin-top20'>
                                <Text className='cm-font-fam500 cm-font-size18'>Create New Room</Text>
                                <Text>You can create a personalized room for this opportunity with content, document.</Text>
                            </Space>
                        </div>
                        {/* <div className='cm-position-relative cm-cursor-pointer cm-background-white cm-flex-center cm-flex-direction-column cm-padding20' style={{height: "250px", width: "250px", borderRadius: "20px", border: "1px solid #E9E9E9", boxShadow: "0px 1px 4px 0px #4444441A"}} onClick={() => setCurrentView("library")}>
                            <a href={libraryURL} target='_blank' className='cm-flex-center cm-flex-direction-column'>
                                <div className='cm-position-absolute' style={{top: "10px", right: "15px"}}><MaterialSymbolsRounded font="open_in_new" color='#5F6368' size='18'/></div>
                                <div  className='cm-flex-center'  style={{height: "60px", width: "60px", borderRadius: "20px", background: "#CCCEFF", border: "1px solid #CCCEFF", boxShadow: "2px 2px 3px 0px #FFFFFFB2 inset"}}><MaterialSymbolsRounded font="home_storage" color='#000000D9'/></div>
                                <Space direction='vertical' className='cm-margin-top20'>
                                    <Text className='cm-font-fam500 cm-font-size18'>Library</Text>
                                    <Text>Organize, store, and manage files centrally with seamless access and sharing.</Text>
                                </Space>
                            </a>
                        </div>
                        <div className='cm-position-relative cm-cursor-pointer cm-background-white cm-flex-center cm-flex-direction-column cm-padding20' style={{height: "250px", width: "250px", borderRadius: "20px", border: "1px solid #E9E9E9", boxShadow: "0px 1px 4px 0px #4444441A"}} onClick={() => setCurrentView("links")}>
                            <a href={linksURL} target='_blank' className='cm-flex-center cm-flex-direction-column'>
                                <div className='cm-position-absolute' style={{top: "10px", right: "15px"}}><MaterialSymbolsRounded font="open_in_new" color='#5F6368' size='18'/></div>
                                <div  className='cm-flex-center'  style={{height: "60px", width: "60px", borderRadius: "20px", background: "#CCF6FF", border: "1px solid #CCF6FF", boxShadow: "2px 2px 3px 0px #FFFFFFB2 inset"}}><MaterialSymbolsRounded font="link" color='#000000D9'/></div>
                                <Space direction='vertical' className='cm-margin-top20'>
                                    <Text className='cm-font-fam500 cm-font-size18'>Create Links</Text>
                                    <Text>Quickly generate and share a unique URL for easy access to resources or content.</Text>
                                </Space>
                            </a>
                        </div> */}
                    </Space>
                </Space>
            </div>
        </>
    )
}

export default GetStartedOptions