import { useEffect, useState } from "react";

import { EditorContent, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import { FontSize } from "./font-size";
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Mention from "@tiptap/extension-mention";
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./toolbar";
import suggestion from "./suggestion";

const RichTextEditor = (props: { value?: any, onChange?: any, loading?: boolean, saved?: boolean, showSave?: boolean, placeholder?: string }) => {

    const { value, onChange, loading, saved, showSave, placeholder="" }   =   props;

    const [html, setHTML]                           =   useState(value || '');
      
    useEffect(() => {
        setHTML(value);
    },[value])    

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline, 
            Subscript, 
            Superscript, 
            TaskList,
            TextStyle,
            FontSize,
            Color,
            TaskItem.configure({
                nested: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({ multicolor: true }),
            Table.configure({
                resizable: true,
            }),
            Placeholder.configure({
                placeholder: ({ node }) => node.type.name === 'paragraph' ? placeholder || "Enter any text or use $ to insert variables" : ""
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image,
            Link.configure({
                openOnClick: true,
                autolink: true,
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: "j-insert-variable"
                },
                suggestion,
            }),
        ],
        content: html,
        autofocus: 'end',
        onUpdate: ({ editor }: { editor: any }) => {
            const html = editor.getHTML();
            const text = editor.getText();
            console.log("Text length:", text.length);
            console.log("HTML length:", html.length);
            onChange && onChange(html);
        },
    })

    if(!editor){
        return null
    }

    return (
        <>
            <Toolbar editor={editor} loading={loading} saved={saved} showSave={showSave}/>
            <EditorContent editor={editor} className='j-rte-content'/>
        </>
    );
}

export default RichTextEditor;
