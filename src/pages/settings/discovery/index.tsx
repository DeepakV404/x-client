import { useContext } from 'react';
import { Space } from 'antd';
import { useQuery } from '@apollo/client';

import { ROOM_TEMPLATES } from '../../templates/api/room-templates-query';
import { GlobalContext } from '../../../globals';

import MaterialSymbolsRounded from '../../../components/MaterialSymbolsRounded';
import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import Loading from '../../../utils/loading';

const DiscoveryQuestions = () => {

    const { $user } =   useContext(GlobalContext);

    const { data, loading, error }  =   useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    let templateNames = "";
    data.roomTemplates.map((_template: any) => templateNames += `${_template.title},`)

    return (
        <div className="cm-height100 cm-overflow-auto">
            <div className='cm-width100 j-setting-header'>
                <Space>
                    <MaterialSymbolsRounded font='question_answer' size='22' color="#0065E5"/>
                    <div className="cm-font-size16 cm-font-fam500">Discovery Questions</div>
                </Space>
            </div> 
            <div className='cm-padding0 cm-overflow-auto' style={{height: "calc(100% - 45px)"}}>
                <iframe 
                    allowTransparency   =   {true}
                    scrolling           =   'auto'
                    width               =   {"100%"} 
                    height              =   {"99%"} 
                    style               =   {{border: "none"}}
                    src                 =   {`https://creatorapp.zohopublic.com/hema_clocknext/discovery-question-setup/page-embed/Discovery_Question_BS/GPByqjyM0hOh8SJKBXxbARRtFxkujfkWq1Dv5jAj9K91fS230MunyteHKupdq4MhGgt9HqDOEDJqFmRuRp5y8gpBCz41NmuRn5ft?email=${$user.emailId}&Templates=${templateNames}`}
                />
            </div>
        </div>
    )
}

export default DiscoveryQuestions