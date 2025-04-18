import NoAccess from "../components/error-pages/no-access";

interface ProtectedRouteProps {
    permissionCheck: boolean;
    element: JSX.Element;
}

const ProtectedRoute = ({ permissionCheck, element }: ProtectedRouteProps) => {
    if(permissionCheck){
        return element;
    }else{
        return <NoAccess/>
    }
};

export default ProtectedRoute;