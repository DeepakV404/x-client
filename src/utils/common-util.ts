import { message } from "antd";
import { CHUNK_SIZE, EXCEL_FALLBACK_IMAGE, IMAGE_FALLBACK_IMAGE, LINK_FALLBACK_IMAGE, PDF_FALLBACK_IMAGE, PPT_FALLBACK_IMAGE, URL_PARSER_REGEX, VIDEO_FALLBACK_IMAGE, WORD_FALLBACK_IMAGE } from "../constants/module-constants";
import { LibraryAgent } from "../pages/library/api/library-agent";
import { BuyerAgent } from "../buyer-view/api/buyer-agent";

interface CommonUtilProps
{
    __getAvatarName             :   (name: string, charCount: number) => string;
    __getFullName               :   (firstName: string, lastName: string)  => string;
    __getFormatDate             :   (timestamp: number) => string;
    __showSuccess               :   (content: string | React.ReactNode) => void ;
    __showError                 :   (content: string) => void;
    __getFileSize               :   (file: File, decimal: number) => string;
    __getYoutubeEmbedURL        :   (url: string) => string;
    __getSubdomain              :   (url: string) => string;
    __format_AM_PM              :   (dateObject: Date) => string;
    __getDateDay                :   (dateObject: Date) => string;
    __getDateDayYear            :   (dateObject: Date) => string;
    __checkVideoDomain          :   (contentUrl: string) => boolean;
    __getFormatDuration         :   (timeStamp: number) => any;
    __getQueryParams            :   (searchObj: any) => any;
    __getUnixTime               :   (timestamp: any) => any
    __getResourceFallbackImage  :   (url: any) => any
    __triggerIfIdle             :   (callback: any, idleTime: number) => any;
    __replaceURLInText          :   (text: string) => string
    __getTextAlignmentClass     :   (align: string) => string;
    __formateAPIKey             :   (name: string)  => string
    __copyToClipboard           :   (link: string) =>  Promise<void>;
    __uploadToS3                :   (file: File, presignedUrls: string[], contentId: string, uploadId: string, onCompletionCallback?: () => void, type?: string) => void
}

export const CommonUtil =   {} as CommonUtilProps;

const Months: string[]  =   ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

CommonUtil.__getUnixTime = (timestamp) => {
    return Math.floor(new Date(parseInt(timestamp)).getTime() / 1000);
}

CommonUtil.__getAvatarName = function(name, charCount) {
    name = name.replace(/[^A-Z0-9]/ig, " ");

    let logo = "";

    name.split(' ').forEach((entry) => {
        logo = logo + entry.charAt(0)
    });
    logo = logo.length === 1 ? logo = logo + name.charAt(1) : logo;
    return logo.substr(0,charCount).toUpperCase();
}

CommonUtil.__getFullName = (firstName, lastName) => {
    if(lastName){
        return `${firstName} ${lastName}`
    }else{
        return firstName
    } 
}

CommonUtil.__getFormatDate = (timestamp) => {
    return (
        `${new Date(timestamp).toDateString()}`
    )
}

CommonUtil.__showSuccess = (content) => {

    message.success({
        className   :   "",
        content     :   content,
        duration    :   1
    })
}

CommonUtil.__showError = (content) => {

    content === "This preview is just for viewing" 
    ? 
        message.warning({
            className: "",
            content :   content
        })
    :
        message.error({
            className   :   "",
            content     :   content
        })
}

CommonUtil.__getFileSize = (file, decimal) => {
    let bytes = file.size;

    if (!+bytes) return '0 Bytes'

    const k     =   1024;
    const dm    =   decimal < 0 ? 0 : decimal;
    const sizes =   ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i     =   Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

CommonUtil.__getYoutubeEmbedURL = (url) => {
    
    function getId(url: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    return getId(url) ? "https://www.youtube.com/embed/" + getId(url) + "?rel=0&modestbranding=1&mute=0&controls=1&autoplay=1&loop=1" : "";
}

CommonUtil.__getSubdomain = (url) => {
    let domain = url;
    if (url.includes("://")) {
        domain = url.split('://')[1];
    }
    const subdomain = domain.split('.')[0];

    return subdomain;
};

CommonUtil.__format_AM_PM = (dateObject) => {
    let date: number            =   dateObject?.valueOf()
    let hours: string|number    =   new Date(date).getHours();
    let minutes: string|number  =   new Date(date).getMinutes();
    let am_pm: string           =   hours >= 12 ? 'PM' : 'AM';
    hours                       =   hours % 12;
    hours                       =   hours ? hours : 12;
    minutes                     =   minutes < 10 ? '0'+ minutes : minutes;
    let strTime: string         =   hours + ':' + minutes + ' ' + am_pm;

    return strTime;
}

CommonUtil.__getDateDay = (dateObject) => {
    let date: Date  =   new Date(dateObject.valueOf());

    return date.getDate() + " " + Months[date.getMonth()]
}

CommonUtil.__getDateDayYear = (dateObject) => {
    let date: Date  =   new Date(dateObject.valueOf());

    return date.getDate() + " " + Months[date.getMonth()] + " " + date.getFullYear();
}

CommonUtil.__checkVideoDomain = (contentUrl: string) => {
    const supportedVideoTypes = ["youtu.be", "youtube", "loom", "vimeo",  "www.loom.com", "vimeo.com", "www.youtube.com",  "fast.wistia.net", "play.vidyard.com", "player.vimeo.com"];
    if (!contentUrl.startsWith('http://') && !contentUrl.startsWith('https://')) {
        contentUrl = 'https://' + contentUrl;
    }
    try {
        const domain = new URL(contentUrl);
        return supportedVideoTypes.includes(domain.hostname);
    } catch (error) {
        return false;
    }
}

CommonUtil.__getFormatDuration = (secs: any) => {

    var sec_num = parseInt(secs, 10);
    var hours: any   = Math.floor(sec_num / 3600);
    var minutes: any = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds: any = sec_num - (hours * 3600) - (minutes * 60);

    let wholeDuration = [];

    if(hours > 0) {
        let duration = {
            unit : "",
            value : ""
        }
        duration.unit = "hr";
        duration.value = hours;
        wholeDuration.push(duration);
    }
    if(minutes > 0) {
        let duration = {
            unit : "",
            value : ""
        }
        duration.unit = "min";
        duration.value = minutes;
        wholeDuration.push(duration);
    }
    if(seconds > 0) {
        let duration = {
            unit : "",
            value : ""
        }
        duration.unit = "sec";
        duration.value = seconds;
        wholeDuration.push(duration);
    }

    return wholeDuration
        
}

CommonUtil.__getQueryParams = (searchObj: any) => {
    let query = decodeURIComponent(searchObj)
    let params: any = {};
    if(query){
        query           = query ? query.split('?')[1] : "";
        let paramArray  = query.split("&");

        for (var i=0;i<paramArray.length;i++) 
        {
            let pair = paramArray[i].split("=");
            params[pair[0]] = pair[1];
        }
    }
    return params
}

CommonUtil.__getResourceFallbackImage = (type) => {

    if (type?.includes("image") || type?.includes("IMAGE")) return IMAGE_FALLBACK_IMAGE;

    if (type?.includes("video") || type?.includes("VIDEO")) return VIDEO_FALLBACK_IMAGE;

    switch (type) {
        case "application/pdf": return PDF_FALLBACK_IMAGE
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.ms-powerpoint":
            return PPT_FALLBACK_IMAGE
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
        case "application/vnd.ms-excel.sheet.macroEnabled.12":
            return EXCEL_FALLBACK_IMAGE
        case "DOCUMENT" :
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword": return WORD_FALLBACK_IMAGE
        default:
            return LINK_FALLBACK_IMAGE
    }
}

CommonUtil.__triggerIfIdle = (callBack: any, idleItemInSecs: number= 30) => {
    let time: any;
    window.onload           =   resetTimer;
    document.onmousemove    =   resetTimer;
    document.onkeydown      =   resetTimer;
    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(callBack, (idleItemInSecs*1000))
    }
}

CommonUtil.__replaceURLInText = (text: string) => {
    return text.replace(URL_PARSER_REGEX, (url: string) => `<a href="${url}" target="_blank">${url}</a>`);
}

CommonUtil.__getTextAlignmentClass = (align: string) => {
    switch (align) {
        case "right":
            return "cm-text-align-end"
        
        case "middle":
            return "cm-text-align-center"
        
        default:
            return "cm-text-align-start"
    }
}

CommonUtil.__formateAPIKey = (key: string) => {
    let formatted = key.charAt(0).toUpperCase() + key.slice(1);
  
    formatted = formatted.replace(/([A-Z])/g, ' $1').trim();
  
    return formatted;
}

CommonUtil.__copyToClipboard = (link: string) => {
    return navigator.clipboard.writeText(link)
}

CommonUtil.__uploadToS3 = async (file: File, presignedUrls: string[], contentId: string, uploadId: string, onCompletionCallback?: () => void, type?: string) => {
    
    const uploadPart = async (fileChunk: Blob, presignedUrl: string, partNo: number) => {
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: fileChunk,
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        return { value: { eTag: uploadResponse.headers.get('ETag'), partNumber: partNo } };
    };

    const uploadsArray: any = [];

    for (let i = 0; i < presignedUrls.length; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blobChunk = file.slice(start, end);

        uploadsArray.push(uploadPart(blobChunk, presignedUrls[i], i + 1));
    }

    try {
        const uploadResponses: any = await Promise.all(uploadsArray);
        if(type) {
            BuyerAgent.completeBlobRequest({
                variables: {
                    uploadId,
                    contentUuid: contentId,
                    input: uploadResponses.map((_part: any) => _part.value)
                },
                onCompletion: () => {
                    if(onCompletionCallback){
                        onCompletionCallback();
                    }
                },
                errorCallBack: () => {}
            });
        } else { 
            LibraryAgent.completeBlobRequest({
                variables: {
                    uploadId,
                    contentUuid: contentId,
                    input: uploadResponses.map((_part: any) => _part.value)
                },
                onCompletion: () => {
                    if(onCompletionCallback){
                        onCompletionCallback();
                    }
                },
                errorCallBack: () => {}
            });
        }
    } 
    catch {}
}