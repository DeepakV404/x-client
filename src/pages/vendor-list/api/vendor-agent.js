import { APIHandler } from "../../../api-handler";
import { CREATE_VENDOR, MARK_USER_AS_VENDOR } from "./vendor-mutation";
import { VENDORS } from "./vendor-query";

export const VendorAgent = {};

VendorAgent.createVendor = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   CREATE_VENDOR,
        variables       :   variables,
        refetchQueries  :   [VENDORS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}


VendorAgent.markUserAsVendor = ({variables, onCompletion, errorCallBack}) => {

    APIHandler.client.mutate({
        mutation        :   MARK_USER_AS_VENDOR,
        variables       :   variables,
        refetchQueries  :   [VENDORS]
    }).then(
        (response) => {
            onCompletion && onCompletion(response.data)
        },
        (errors) => errorCallBack && errorCallBack(errors)
    )
}