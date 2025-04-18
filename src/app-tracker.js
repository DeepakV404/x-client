import mixpanel from "mixpanel-browser";

import { CommonUtil } from "./utils/common-util";

export const AppTracker = {};

AppTracker.isEnabled = false;

AppTracker.initialize = (user) => {

    AppTracker.isEnabled    =   true;
    mixpanel.init('ae9bb85d50923ecb33bd2e8dabd324d8', {debug: true, track_pageview: true, persistence: 'localStorage'});
    mixpanel.identify(user.uuid)

    window.intercomSettings = {
        api_base    :   "https://api-iam.intercom.io",
        app_id      :   import.meta.env.VITE_INTERCOM_APP_ID,
        name        :   CommonUtil.__getFullName(user.firstName, user.lastName),
        user_id     :   user.uuid,
        email       :   user.emailId,
        user_hash   :   user.userHash,
        created_at  :   CommonUtil.__getUnixTime(new Date().valueOf())
    };

    (function(){
        var w=window;
        var ic=w.Intercom;
        if(typeof ic==="function")
        {
            ic('reattach_activator');ic('update',w.intercomSettings);
        }
        else
        {
            var d=document;
            var i=function(){
                i.c(arguments);
            };
            i.q=[];
            i.c=function(args){
                i.q.push(args);
            };
            w.Intercom=i;
            var l=function(){
                var s=d.createElement('script');
                s.type='text/javascript';
                s.async=true;
                s.src=`https://widget.intercom.io/widget/${import.meta.env.VITE_INTERCOM_APP_ID}`;
                var x=d.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s,x);
            };
            if(document.readyState==='complete'){
                l();
            }else if(w.attachEvent){
                w.attachEvent('onload',l);
            }else{
                w.addEventListener('load',l, false);
            }
        }
    })();
}

AppTracker.trackEvent = (event, data) => {
    if(AppTracker.isEnabled){
        data.logTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        window.Intercom('trackEvent', event, data);
    }
}