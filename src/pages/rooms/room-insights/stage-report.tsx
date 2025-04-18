import { useQuery } from "@apollo/client"
import { Card, Statistic } from "antd"
import { STAGES_REPORT} from "../api/rooms-query"
import { useParams } from "react-router-dom";
import Loading from "../../../utils/loading";
import SomethingWentWrong from "../../../components/error-pages/something-went-wrong";

const StageReport = () => {

    const params    =   useParams();

    const{ data, loading, error } = useQuery(STAGES_REPORT, {
        fetchPolicy: "network-only",
        variables: {
            roomUuid: params.roomId
        }
    })

    
    if(loading) return <Loading />

    if(error) return <SomethingWentWrong />

    return (
        <div>
            <div className="cm-font-fam500 cm-font-size16 cm-margin-bottom10" style={{height: "20px"}}>Step Info</div>
            <Card bordered={false} style={{minHeight: "165px"}} className="j-room-insight-card">
                <Statistic
                    title       =   {<div className=''>Total Steps</div>}
                    value       =   {data.stagesReport.totalStages}
                    precision   =   {0}
                    valueStyle  =   {{ color: '#000', fontSize: "22px" }}
                    className   =   "cm-font-fam500"
                />
                <Statistic
                    title       =   {<div className=''>Steps completed</div>}
                    value       =   {data.stagesReport.completedStages}
                    precision   =   {0}
                    valueStyle  =   {{ color: '#000', fontSize: "22px" }}
                    className   =   "cm-font-fam500"
                />
            </Card>
        </div>
    )
}

export default StageReport