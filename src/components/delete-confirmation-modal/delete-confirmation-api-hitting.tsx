import { useQuery } from "@apollo/client"
import DeleteConfirmationForm from "./delete-confirmation-form"
import { RESOURCE_DEPENDENCIES } from "../../pages/library/api/library-query"
import { useEffect, useState } from "react"

const DeleteConfirmationApiHitting = (props: any) => {

    const { content, otherReqInfo } = props  

    const [modifiedContent, setModifiedContent] = useState(content)

    const { data: resourceData }  =  useQuery(RESOURCE_DEPENDENCIES, {
        skip: content.module !== "Resource",
        variables: {
            resourceUuid: otherReqInfo?.deleteConfirmation?.data?.uuid,
        },
        fetchPolicy: "network-only"
    })

    const getMessage = (module: string) => {        
        switch (module) {
            case "Resource": 
                return `Caution! Deleting this resource (used in ${resourceData?.resourceDependencies?.roomDependencies?.count ?? 0} rooms and ${resourceData?.resourceDependencies?.templateDependencies?.count ?? 0} templates) will remove it from them.`;
        }
    }
    
    useEffect(() => {
        if (resourceData && !modifiedContent.cautionMessage) {
          setModifiedContent((prevContent: any) => ({
            ...prevContent,
            cautionMessage: getMessage(prevContent.module),
          }));
        }
    }, [resourceData]);

    const newProps = {
        ...props,
        modifiedContent,
    };

    return (
        <DeleteConfirmationForm {...newProps}/>
    )
}

export default DeleteConfirmationApiHitting