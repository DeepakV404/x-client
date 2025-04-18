import { Card, Col, Row, Space, Typography } from "antd";

const { Paragraph } =   Typography;

const LibraryFolder = (props: {folders: any, onFolderClick: any}) => {

    const { folders, onFolderClick }   =   props;
    
    return(
        <div className="j-library-folder cm-margin-bottom20">
            <div className="cm-secondary-text cm-font-fam500 cm-margin-bottom10">Folders</div>
            <Row gutter={[15, 15]}>
                {
                    folders && folders.length > 0 ?
                        (folders.map((_folder: any) => (
                            <Col key={_folder.uuid} xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                                <Card className= {`j-library-folder-card cm-cursor-pointer`} onClick={() => onFolderClick(_folder.uuid)}>
                                    <Space direction="vertical" className="cm-width100">
                                        <div style={{paddingBlock: "8px"}} className="cm-height100 cm-flex">
                                            <img style={{width: "40px"}} src={`${import.meta.env.VITE_STATIC_ASSET_URL}/folder.svg`} alt='logo'/>
                                        </div>
                                        <Paragraph
                                            className   =   "cm-font-fam500 cm-font-size14 cm-width100 cm-margin-bottom0"
                                            ellipsis    =   {{rows:1, expandable:false, tooltip: _folder.title}}
                                        >
                                            {_folder.title}
                                        </Paragraph>
                                        <Space className="cm-secondary-text cm-font-size13" size={15}>
                                            <span>{_folder.resourcesCount > 0 ? _folder.resourcesCount + ' Files' : 'No files'}</span>
                                            {_folder.subfoldersCount > 0  && <span>{_folder.subfoldersCount} Folders</span>}
                                        </Space>
                                    </Space>
                                </Card>
                            </Col>
                        )))
                    :
                        null
                }
            </Row>
        </div>
    )
}

export default LibraryFolder