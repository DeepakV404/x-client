import { useQuery } from "@apollo/client";

import { ROOM_TEMPLATES } from '../api/room-templates-query';

import SomethingWentWrong from '../../../components/error-pages/something-went-wrong';
import TemplateLists from './template-lists';
import Loading from '../../../utils/loading';
  
const TemplatesListing = () => {

    const { data, loading, error } = useQuery(ROOM_TEMPLATES, {
        fetchPolicy: "network-only"
    });

    if (loading) return <Loading />;
    if (error) return <SomethingWentWrong />;

    return (
        <TemplateLists data={data}/>
    )
}

export default TemplatesListing;
