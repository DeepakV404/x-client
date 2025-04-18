import { FC, useEffect, useState } from "react";
import { Button, Card, Space } from "antd";

import { ORG_DPR, ORG_DSR, ORG_GTM } from "./constants/module-constants";
import { CommonUtil } from "./utils/common-util";

import MaterialSymbolsRounded from "./components/MaterialSymbolsRounded";
import LinkLoading from "./layout/onboarding/link-loading";
import OnboardingHeader from "./layout/onboarding/header";
import Loading from "./utils/loading";

interface CreateBSOrgProps {
    children: JSX.Element;
}

const CreateBSOrg: FC<CreateBSOrgProps> = ({ children }) => {
    
    const [hasOrg, setHasOrg]               =   useState<boolean>(false);
    const [isSelected, setIsSelected]       =   useState<string | null>(null);
    const [loading, setLoading]             =   useState<any>({
        isCreatingOrg       :   false,
        type                :   ""
    });

    const [hasOrgLoading, setHasOrgLoading] =   useState(true);
    
    const searchParams                      =   new URLSearchParams(window.location.search);

    const apiUrl                            =   window.location.hostname === "preapp.buyerstage.io" ? "https://preapp.buyerstage.io/hasOrg" : `${import.meta.env.VITE_APP_DOMAIN}/hasOrg`;

    useEffect(() => {
        fetch(apiUrl, { method: 'GET', credentials: "include" })
            .then(response => response.json()) 
            .then((data) => {
                setHasOrgLoading(false)
                setHasOrg(data.hasOrg)
            }) 
            .catch(() => {
                setHasOrgLoading(false)
            }); 

        const typeParam = searchParams.get("p");
        
        if (typeParam && ["DPR", "DSR", "GTM"].includes(typeParam.toUpperCase())) {
            setIsSelected(typeParam.toUpperCase());
        }

    }, []);

    const handleCreateOrg = () => {

        setLoading({
            isCreatingOrg: true,
            type: isSelected
        })
        
        const apiUrl = `${import.meta.env.VITE_APP_DOMAIN}/createOrg?type=${isSelected?.toLowerCase()}`;

        fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }})
            .then(response => response.json())
            .then((data) => {
                if (data.tenantName) {
                    const newUrl = `${import.meta.env.VITE_APP_DOMAIN}/${data.tenantName}`;
                    window.location.href = newUrl
                }
                setHasOrg(true); 
            })
            .catch(() => CommonUtil.__showError("Something went wrong. Please try again."));
    }

    const orgTypes = [
        {
            key          :  "DPR",
            label        :  "Marketing",
            description  :  "Distribute and track content performance with Smart Links & Collateral Pods.",
            color        :  "#0065E5",
            image        :  ORG_DPR,
            bgColor      :  "#E7F0FE"
        },
        {
            key          :  "DSR",
            label        :  "Sales",
            description  :  "Create deal rooms for efficient buyer collaboration and close deals faster.",
            color        :  "#F48125",
            image        :  ORG_DSR,
            bgColor      :  "#FDEFDE"

        },
        {
            key          :  "GTM",
            label        :  "End-to-End GTM",
            description  :  "Seamlessly handle operations from discovery to onboarding.",
            color        :  "#E225AF",
            image        :  ORG_GTM,
            bgColor      :  "#FFE5F8"       
        }
    ]

    return (
       <div className="cm-height100">
            {
                hasOrgLoading ? 
                    <Loading/>
                :
                    (hasOrg ?
                        <>
                            {children}
                        </>
                    :
                        <div className="cm-height100 j-onboarding-body">
                            <OnboardingHeader headerColor={'blue'}/>
                            {
                                loading.isCreatingOrg ?
                                    <div className="cm-flex-center cm-width100 cm-height100">
                                        <div className="cm-flex-center cm-flex-direction-column" style={{width: "500px", rowGap: "15px"}}>
                                            <div className="cm-font-size24 cm-font-opacity-black-85 cm-font-fam500">Preparing For You</div>
                                            <LinkLoading/>
                                            <div className="cm-font-opacity-black-85">This may take a few seconds</div>
                                        </div>
                                    </div>
                                :
                                    <Space className="cm-flex-center fade-in" style={{height: "calc(100% - 61px)"}} direction="vertical" size={20}>
                                        <Space direction="vertical" size={20} className="cm-text-align-center">
                                            <div className="cm-font-size30 cm-font-fam600">Which crew in your org is gonna be all over Buyerstage?</div>
                                            <div className="cm-font-size18 cm-font-fam400">Tell us who's leading the charge!</div>   
                                        </Space>
                                        <Space size={20} className="cm-margin-block20">
                                            {
                                                orgTypes.map((_type: any) => {
                                                    return(
                                                        <div data-key={_type.key} key={_type.key} className="j-onboarding-select-org-type-card-wraper cm-border-radius24 cm-cursor-pointer" onClick={() => setIsSelected(_type.key)} style={{border: `8px solid ${isSelected === _type.key ? _type.bgColor : "#F5F5F5"}`}}>
                                                            <Card className="j-onboarding-select-org-type-card" style={{border: `1px solid ${isSelected === _type.key ? _type.color : "#F5F5F5"}`}}>
                                                                <img src={_type.image} className="j-org-type-image"/>
                                                                <Space direction="vertical" className="cm-padding-inline15 cm-padding-block10">
                                                                    <Space className="cm-flex-space-between">
                                                                        <div className="cm-font-fam600">{_type.label}</div>
                                                                        { isSelected === _type.key && <MaterialSymbolsRounded font="check_circle" filled color="#3DB200" size="22"/>}
                                                                    </Space>
                                                                    <div className="cm-font-opacity-black-67">{_type.description}</div>
                                                                </Space>
                                                            </Card>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Space>
                                        <Button 
                                            className   =   {isSelected ? "cm-border-none" : ""} style={{backgroundColor: orgTypes.find((type) => type.key === isSelected)?.color, color: isSelected ? "#fff" : "#000"}} 
                                            onClick     =   {handleCreateOrg}
                                            disabled    =   {!isSelected}
                                        >
                                            Get Started
                                        </Button>
                                    </Space> 
                            }
                        </div>
                )
            }
       </div>
    )
};

export default CreateBSOrg;
