import { useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import { Steps, Space } from 'antd';

// import { ONBOARDING_ACCOUNT_SETUP, ONBOARDING_CREATE_ROOM, ONBOARDING_CREATE_TEMPLATE, ONBOARDING_CRM_VIDEO, ONBOARDING_INVITE_BUYER } from '../../constants/module-constants';
import { WELCOME_PAGE_VISITED } from '../../tracker-constants';
// import { CommonUtil } from '../../utils/common-util';
// import { GlobalContext } from '../../globals';
import { AppTracker } from '../../app-tracker';

// import { ONBOARDING_META } from '../../layout/onboarding/api/onboarding-query';
// import { PermissionCheckers } from '../../config/role-permission';
// import { FEATURE_HOME } from '../../config/role-permission-config';

// import SomethingWentWrong from '../../components/error-pages/something-went-wrong';
// import AccountOnboarding from './account-onboarding';
// import OnboardedPage from './onboarded-success';
// import Loading from '../../utils/loading';
import HomeDashboard from './dashboard';

// const {Text} = Typography

const WelcomePage = () => {

    // const { $isVendorMode, $isVendorOrg, $dictionary }     =   useContext(GlobalContext);

    // const navigate      =   useNavigate();

    // let stepsArr        =   ["hasOrgDataUpdated", "hasPersonalDataUpdated", "hasTemplateCreated", "hasRoomCreated", "hasInvitedBuyer", "hasCRMCreated", "isSlackConnected", "isBrandUpdated"];

    // const [showWelcome, setShowWelcome] =   useState(false);
    // const [current, setCurrent]         =   useState(0);
    // const [currentPage, setCurrentPage] =   useState("dashboard");

    // const handleButtonClick = () => {
    //     if(currentPage === "gettingStarted") setCurrentPage("dashboard")
    //     else setCurrentPage("gettingStarted")
    // };
    
    // const { data, loading, error }  =   useQuery(ONBOARDING_META, {
    //     fetchPolicy: "network-only"
    // })

    // const allStepsCompleted = !Object.values(data?.onboardingDetails).includes("false");

    useEffect(() => {
        AppTracker.trackEvent(WELCOME_PAGE_VISITED, {});
    }, [])

    // useEffect(() => {
    //     if(CommonUtil.__getQueryParams(window.location.search)?.hasOwnProperty("signup-success")){
    //         setShowWelcome(true)
    //     }
    // }, [window.location])

    // useEffect(() => {
    //     if(data){
    //         let notCompleted: any = [];
    //         stepsArr.some(function(element) {
    //             (data.onboardingDetails[element] === "false") ? notCompleted.push(element) : null
    //         });
    //         setCurrent(notCompleted.length > 0 ? ((stepsArr.indexOf(notCompleted[0]) - 1) > 0 ?  (stepsArr.indexOf(notCompleted[0]) - 1) : 0) : 0)
            
    //         // if(($isVendorMode || $isVendorOrg)){
    //         //     setCurrentPage("gettingStarted")
    //         // }else if(data?.onboardingDetails.hasRoomCreated === "true"){
    //         // setCurrentPage("dashboard")
    //         // }else{
    //         //     PermissionCheckers.__checkPermission($user.role, FEATURE_HOME, 'create') ? setCurrentPage("gettingStarted") : setCurrentPage("dashboard")
    //         // }

    //     }
    // }, [data])

    // const closeWelcome = () => {
    //     setShowWelcome(false)
    //     window.location.href = window.location.origin + window.location.pathname;
    // }

    // if(loading) return <Loading/>
    // if(error) return <SomethingWentWrong/>

    // let onboarding_steps: any = [
    //     {
    //         key         :   "accountSetup",
    //         title       :   <div className={`cm-font-size14 ${current === 0 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Account Setup</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   (data.onboardingDetails.hasOrgDataUpdated === "true" && data.onboardingDetails.hasPersonalDataUpdated === "true") ? "finish" : (current === 0 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   'Account Setup' 
    //                             ctaText     =   "Setup Account Details"
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Setup-Profile-ca758b7e72734b97bbd47e6e42cb5e0c", "_blank")}
    //                             videoLink   =   {ONBOARDING_ACCOUNT_SETUP}
    //                             desc        =   {[
    //                                                 <li key={"as1"}>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Personal Details"</span>.</li>,
    //                                                 <li key={"as2"}>Enter your Name, upload your photo, calendar link, and click on the <span className='cm-font-fam600'>"Update"</span> button.</li>,
    //                                                 <li key={"as3"}>Go to <span className='cm-font-fam600'>"Organization Details"</span> section.</li>,
    //                                                 <li key={"as4"}>Enter your Company Name, Industry Type, Website URL, etc to set up your Organization profile, and click on the <span className='cm-font-fam600'>"Update"</span> button.</li>]
    //                                             }
    //                             ctaLink     =   {() => navigate("/settings/personal-details")}
    //                         />
    //     },
    //     {
    //         key         :   "createTemplate",
    //         title       :   <div className={`cm-font-size14 ${current === 1 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Create a {$dictionary.templates.singularTitle}</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.hasTemplateCreated === "true" ? "finish" : (current === 1 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   {`Create a ${$dictionary.templates.singularTitle}`}
    //                             ctaText     =   {`Create ${$dictionary.templates.singularTitle}`}
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Template-Creation-353228f4440449da94b4780ee3d68304", "_blank")}
    //                             videoLink   =   {ONBOARDING_CREATE_TEMPLATE}
    //                             desc        =   {[
    //                                                 <li key={"ct1"}>Go to the <span className='cm-font-fam600'>"{$dictionary.templates.title}"</span> tab at the top bar and click on the <span className='cm-font-fam600'>"Create {$dictionary.templates.singularTitle}"</span> button.</li>,
    //                                                 <li key={"ct2"}>Enter the Title and Description of the {$dictionary.templates.singularTitle} and click on the <span className='cm-font-fam600'>"Create"</span> button.</li>,
    //                                                 ($isVendorMode || $isVendorOrg) ? 
    //                                                     <li key={"ct3"}>Configure the Welcome, Demo and Resources sections.</li>
    //                                                 :
    //                                                     <li key={"ct4"}>Configure the Welcome, Demo, Resources, and Action Plan sections.</li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/templates")}
    //                         />
    //     },
    //     {
    //         key         :   "createRoom",
    //         title       :   <div className={`cm-font-size14 ${current === 2 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Create a {$dictionary.rooms.singularTitle}</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.hasRoomCreated === "true" ? "finish" : (current === 2 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   {`Create a ${$dictionary.rooms.singularTitle}`}
    //                             ctaText     =   {`Create ${$dictionary.rooms.singularTitle}`}
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Room-Creation-6b12928ad31e4363b16f41ae68e5af97", "_blank")}
    //                             videoLink   =   {ONBOARDING_CREATE_ROOM}
    //                             desc        =   {[
    //                                                 <li key={"cr1"}>Go to the <span className='cm-font-fam600'>"{$dictionary.rooms.title}"</span> tab at the top bar and click on the <span className='cm-font-fam600'>"Create {$dictionary.rooms.singularTitle}"</span> button.</li>,
    //                                                 <li key={"cr2"}>Choose the existing {$dictionary.templates.singularTitle} or create new one using the <span className='cm-font-fam600'>"Create {$dictionary.templates.singularTitle}"</span> link.</li>,
    //                                                 <li key={"cr3"}>Click on the <span className='cm-font-fam600'>"Create Account"</span> link for new Account or choose existing one.</li>,
    //                                                 <li key={"cr4"}>Enter the details of the buyer's organization like Name, Website, Industry type, etc.</li>,
    //                                                 <li key={"cr5"}>Click on the <span className='cm-font-fam600'>"Create"</span> button to create an account.</li>,
    //                                                 <li key={"cr6"}>Enter a {$dictionary.rooms.singularTitle} Name and click on the <span className='cm-font-fam600'>"Create"</span> button. </li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/rooms")}
    //                         />
    //     },
    //     {
    //         key         :   "inviteBuyer",
    //         title       :   <div className={`cm-font-size14 ${current === 3 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Invite a Buyer</div>,
    //         description :   <div className='cm-padding10'></div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.hasInvitedBuyer === "true" ? "finish" : (current === 3 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   'Invite a buyer'
    //                             ctaText     =   {undefined}
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Invite-Buyers-d25c7db7fcc34b399485164f7652a95f", "_blank")}
    //                             videoLink   =   {ONBOARDING_INVITE_BUYER}
    //                             desc        =   {[
    //                                                 <li key={"ib1"}>Go to the Sales Room and click on the <span className='cm-font-fam600'>"Share"</span> button.</li>,
    //                                                 <li key={"ib2"}>Click on the <span className='cm-font-fam600'>"Invite Buyers"</span> option from the list.</li>,
    //                                                 <li key={"ib3"}>Enter the Email ID of the buyer, the Reason for the Invitation, and the custom message to be sent to the buyer.</li>,
    //                                                 <li key={"ib4"}>Click on the <span className='cm-font-fam600'>"Send Invite"</span> button.</li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/rooms")}
    //                         />
    //     },
    //     {
    //         key         :   "connectCrm",
    //         title       :   <div className={`cm-font-size14 ${current === 4 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Connect your CRM</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.hasCRMCreated === "true" ? "finish" : (current === 4 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   'Connect your CRM'
    //                             ctaText     =   'Connect your CRM'
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/HubSpot-Integration-2e64832bc2234ec3b81a03e9058d6a1a", "_blank")}
    //                             videoLink   =   {ONBOARDING_CRM_VIDEO}
    //                             desc        =   {[
    //                                                 <li key={"cc1"}>Click on  the <span className='cm-font-fam600'>"Setting"</span> ⚙️, access the <span className='cm-font-fam600'>"Integrations"</span> section, and sign-in to your HubSpot account by clicking the <span className='cm-font-fam600'>"Connect"</span> button.</li>,
    //                                                 <li key={"cc2"}>Go to your HubSpot account, visit any of your Contacts, and click on the <span className='cm-font-fam600'>"Create a Deal room"</span> button inside the <span className='cm-font-fam600'>"Buyerstage"</span> panel at the right pane.</li>,
    //                                                 <li key={"cc3"}>Choose a Template, enter the Room Name, and click on the <span className='cm-font-fam600'>"Create Room"</span> button.</li>,
    //                                                 <li key={"cc4"}>Access all the insights, resources, actions plans, etc of <span className='cm-font-fam600'>Buyerstage</span> within the <span className='cm-font-fam600'>HubSpot</span> to enhance you sales effectiveness.</li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/settings/integrations")}
    //                         />
    //     },
    //     {
    //         key         :   "connectSlack",
    //         title       :   <div className={`cm-font-size14 ${current === 5 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Connect your Slack</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.isSlackConnected === "true" ? "finish" : (current === 5 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   'Connect your Slack'
    //                             ctaText     =   'Connect your Slack'
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Slack-Integration-c72a0cf53be54a6594ab4262ab80131e", "_blank")}
    //                             videoLink   =   {null}
    //                             desc        =   {[
    //                                                 <li key={"cs1"}>Go to the <span className='cm-font-fam600'>"Setting"</span> ⚙️  at the top bar and access the “Integrations” section.</li>,
    //                                                 <li key={"cs2"}>Click on the <span className='cm-font-fam600'>"Connect"</span> button inside the Slack.</li>,
    //                                                 <li key={"cs3"}>Sign-in with your Slack account, and click on the <span className='cm-font-fam600'>"Allow"</span> button.</li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/settings/integrations")}
    //                         />
    //     },
    //     {
    //         key         :   "brandingAndTheme",
    //         title       :   <div className={`cm-font-size14 ${current === 6 ? "j-onboarding-item-current cm-font-fam500" : ""}`}>Branding and Themes</div>,
    //         description :   <div className='cm-padding10'> </div>,//<div className='cm-font-size12 cm-secondary-text'>This is a description</div>,
    //         status      :   data.onboardingDetails.isBrandUpdated === "true" ? "finish" : (current === 6 ? "process" : "wait"),
    //         content     :   <AccountOnboarding
    //                             title       =   'Branding and Themes'
    //                             ctaText     =   'Branding and Themes'
    //                             onClick     =   {() => window.open("https://buyerstage.notion.site/Themes-and-Branding-df816454a8244a269d0af51093a43a15", "_blank")}
    //                             videoLink   =   {null}
    //                             desc        =   {[
    //                                                 <li key={"bt1"}>Click on the <span className='cm-font-fam600'>"Setting"</span> ⚙️  and go to <span className='cm-font-fam600'>"Branding"</span> section.</li>,
    //                                                 <li key={"bt2"}>Update your Logo, Portal Name, and Theme color. </li>,
    //                                                 <li key={"bt3"}>Click on the <span className='cm-font-fam600'>"Update"</span> button</li>
    //                                             ]}
    //                             ctaLink     =   {() => navigate("/settings/branding")}
    //                         />
    //     }
    // ];

    return (
        <>
            <div className='j-onboarding-wrapper cm-height100 cm-width100 cm-padding20'>
                {/* <div className='j-onboarding-banner cm-flex-align-center' style={{backgroundImage: `url(${ONBOARDING_BANNER})`}}>
                    <Space direction='vertical' className='j-onboarding-banner-text'>
                        <span>
                            <Text className='cm-font-size24 cm-font-fam600 cm-white-text'>Hey, </Text>
                            <Text style={{maxWidth: "800px"}} ellipsis={{tooltip: CommonUtil.__getFullName($user.firstName, $user.lastName)}} className='cm-font-size24 cm-font-fam600 cm-white-text'>{CommonUtil.__getFullName($user.firstName, $user.lastName)}</Text>
                            <Text className='cm-font-size24 cm-font-fam600 cm-white-text'>!</Text>
                        </span>
                        <span className='cm-flex'>&#128075; Welcome to Buyerstage</span>
                    </Space>
                    {
                        PermissionCheckers.__checkPermission($user.role, FEATURE_HOME, 'create') && !($isVendorMode || $isVendorOrg) ?
                            <Button style={{borderRadius: "22px", color: "#2150FF", border: "1px solid #FFFFFF"}} onClick={handleButtonClick} className='cm-font-size13 cm-font-fam500'>{currentPage === "gettingStarted" ? "Go to Dashboard" : "Show Onboarding"}</Button>
                        :
                            null
                    }
                </div> */}
                <div className='j-onboarding-flex-wrapper'>
                    {/* {
                        currentPage === 'gettingStarted'
                        ?
                            <>
                                <div style={{background: "#fff", borderRadius: "6px", padding: "25px 20px", width: "300px", overflow: "auto"}} className='cm-height100'>
                                    <Space direction='vertical' style={{marginBottom: "25px"}} size={5}>
                                        <div className='cm-font-fam600 cm-font-size18'>Getting started</div>
                                        <div style={{color: "#000000AB", lineHeight: "22px"}}>Seven simple steps to change the way you sell</div>
                                    </Space>
                                    <Steps
                                        direction   =   "vertical"
                                        current     =   {current}
                                        className   =   'j-onboarding-steps'
                                        items       =   {onboarding_steps}
                                        onChange    =   {(step: number) => setCurrent(step)}
                                    />
                                </div>
                                <div style={{width: "calc(100% - 300px)", height: "100%", overflow: "auto", paddingBottom: "30px"}} className='cm-margin-top20'>
                                    {onboarding_steps[current].content}
                                </div>
                            </>
                        :
                            <HomeDashboard/>
                        
                    } */}
                    <HomeDashboard/>
                </div>
            </div>
            {/* <OnboardedPage isOpen={showWelcome} onClose={()=> closeWelcome()}/> */}
        </>
    )
}

export default WelcomePage