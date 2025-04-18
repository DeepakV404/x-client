import { Button } from "antd"
import { useNavigate } from "react-router-dom";
import { ACCESS_DENIED_IMAGE } from "../../constants/module-constants"

const NoAccess = () => {

    const navigate          =   useNavigate();
    
    return (
        <div className="j-no-access-div">
            <div className="j-no-access-div-2">
                <div className="j-no-access-div-3">
                    <div className="j-no-access-div-4">
                        <div className="j-no-access-div-5"></div>
                        <div className="j-no-access-div-6">
                            <div className="j-no-access-div-7"></div>
                            <div className="j-no-access-div-8"></div>
                            <div className="j-no-access-div-9"></div>
                            <div className="j-no-access-div-10"></div>
                        </div>
                    </div>
                    <div className="j-no-access-div-11"></div>
                </div>
            </div>
            <div className="cm-height100 cm-flex-center cm-flex-direction-column">
                <img loading="lazy" className="img" src={ACCESS_DENIED_IMAGE}/>
                <div className="j-no-access-div-12" >Access Denied</div>
                <div className="j-no-access-div-13" >You don't have permission to access this page. If you believe this is an error, please contact</div>
                <Button type="primary" className="cm-margin-top20" onClick={() => navigate("/")}>Go Back Home</Button>
            </div>
        </div>
    )
}

export default NoAccess