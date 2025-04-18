import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { STAGE_ACTION_POINTS } from '../../api/buyers-query';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import Translate from '../../../components/Translate';
import Loading from '../../../utils/loading';
import Board from './board';

interface ParamsProps 
{
    stepId?  :   string;
}
  
const ActionPoints = () => {

    const params : ParamsProps = useParams();

    const { data, loading, error }  =   useQuery(STAGE_ACTION_POINTS, {
        variables: {
            stageUuid   :   params.stepId
        },
        fetchPolicy: "network-only"
    });

    if(loading) return <Loading/>
    if(error) return <SomethingWentWrong/>

    if(params && params.stepId){
        return (
            <div className='cm-width100'>
                {
                    data.buyerActionPointsStub.length > 0
                    ?
                        <Board actionsList={data.buyerActionPointsStub}/>
                    :
                        <div className='cm-light-text cm-font-size11'><Translate i18nKey={'step.no-action-points'}/></div>
                }
            </div>
        );
    }
}

export default ActionPoints