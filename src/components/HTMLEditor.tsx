import { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const HtmlEditor = (props: { value?: any, onChange?: any }) => {

    const { value, onChange }   =   props;

    const [html, setHTML]       =   useState("");
      
    useEffect(() => {
        setHTML(value);
    },[value])

    var Size            =   Quill.import('attributors/style/size');
    const fontSizeArr   =   ['8px','9px','10px','12px','14px','16px','20px','24px','32px'];
    Size.whitelist      =   fontSizeArr;
    Quill.register(Size, true);

    const modules = {
        toolbar: [
            // [{ header: [1, 2, 3, 4, false] }],
            [{ "size": fontSizeArr }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["link"],
        ]
    };

    const formats = [
        "header",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "code",
        "align",
        "color",
        "background"
    ];

    const handleOnChange = (newVal: any) => {
        if (newVal.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
            newVal = "";
        }
        setHTML(newVal);
        onChange(newVal);
    };

    return (
        <ReactQuill
            className       =   "j-rt-rich-text-editor"
            theme           =   "snow"
            value           =   {html ? html : ""}
            formats         =   {formats}
            modules         =   {modules}
            onChange        =   {handleOnChange}
            placeholder     =   {"Message"}
        />
    );
}

export default HtmlEditor;
