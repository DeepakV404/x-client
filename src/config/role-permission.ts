import { CONTENT_EDITOR, USER, VIEWER } from "../pages/settings/config/settings-config";
import { ROLE_MANAGER, ROLE_PERMISSION } from "./role-config";
import { FEATURES_PEM_ALL } from "./role-permission-config";

interface PermissionCheckerProps
{
    __checkResourceCategoryPermisson:   (roleKey: string) => {create: boolean, read: boolean, update: boolean, delete: boolean};
    __checkUsecaseCategoryPermisson:    (roleKey: string) => {create: boolean, read: boolean, update: boolean, delete: boolean};
    __checkPermission:  (roleKey: string, module: string, action: "create" | "read" | "update" | "delete") => boolean;
}

export const PermissionCheckers = {} as PermissionCheckerProps;

export const checkPermission = (roleKey: any, module: any, action: any) => {
    const rolePermission = ROLE_PERMISSION[roleKey];

    if(rolePermission?.permissions?.hasAllPermission) {
        return true;
    }else if(rolePermission?.permissions?.featuresPermisson === FEATURES_PEM_ALL){
        return true
    }else if (rolePermission?.permissions?.features[module]) {
        return rolePermission.permissions.features[module][action];
    }
    return false;
}

PermissionCheckers.__checkPermission = (roleKey: any, module: any, action: any) => {
    const rolePermission = ROLE_PERMISSION[roleKey];

    if(rolePermission?.permissions?.hasAllPermission) {
        return true;
    }else if(rolePermission?.permissions?.featuresPermisson === FEATURES_PEM_ALL){
        return true
    }else if (rolePermission?.permissions?.features[module]) {
        return rolePermission.permissions.features[module][action];
    }
    return false;
}


PermissionCheckers.__checkResourceCategoryPermisson = (roleKey) => {
    const rolePermission = ROLE_PERMISSION[roleKey];

    if(rolePermission?.permissions?.hasAllPermission || rolePermission?.permissions?.featuresPermisson === FEATURES_PEM_ALL) {
        return {create: true, read: true, update: true, delete: true};
    }else if(roleKey === CONTENT_EDITOR || roleKey === USER){
        return {create: true, read: true, update: true, delete: false}
    }else if(roleKey === VIEWER){
        return {create: false, read: true, update: false, delete: false}
    }else if(roleKey === ROLE_MANAGER){
        return {create: true, read: true, update: true, delete: true}
    }
    return {create: false, read: false, update: false, delete: false}
}

PermissionCheckers.__checkUsecaseCategoryPermisson = (roleKey) => {
    const rolePermission = ROLE_PERMISSION[roleKey];

    if(rolePermission?.permissions?.hasAllPermission || rolePermission?.permissions?.featuresPermisson === FEATURES_PEM_ALL) {
        return {create: true, read: true, update: true, delete: true};
    }else if(roleKey === USER){
        return {create: true, read: true, update: true, delete: false}
    }else if(roleKey === VIEWER){
        return {create: false, read: true, update: false, delete: false}
    }else if(roleKey === ROLE_MANAGER){
        return {create: true, read: true, update: true, delete: true}
    }
    return {create: false, read: false, update: false, delete: false}

}