import { useEffect, useState } from "react";

import { EditorContent, BubbleMenu, useEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
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
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder';
import FloatingToolbar from "../../../../components/HTMLEditor/floating-toolbar";
import { FontSize } from "../../../../components/HTMLEditor/font-size";
import { TextSelection } from 'prosemirror-state';


const WidgetTitle = (props: { value?: any, onChange?: any, placeholder?: string, bordered?: boolean, className?: string }) => {

    const { value, onChange, placeholder = "Enter text...", bordered, className } = props;

    const [html, setHTML] = useState(value || '');
    const shouldCenterPlaceholder = placeholder === "Click here to add title";

    // Add custom CSS for placeholder alignment
    useEffect(() => {
        const style = document.createElement('style');
        
        // CSS that handles both centered and left-aligned placeholders
        style.innerHTML = `
            /* Default left-aligned placeholder */
            .ProseMirror p.is-editor-empty:first-child::before {
                color: #adb5bd;
                content: attr(data-placeholder);
                float: left;
                height: 0;
                pointer-events: none;
            }
            
            /* Centered placeholder - applied when the data-center-placeholder attribute exists */
            .ProseMirror[data-center-placeholder="true"] p.is-editor-empty:first-child::before {
                float: none;
                display: flex;
                justify-content: center;
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
            
            /* Position relative for centered placeholder parent */
            .ProseMirror[data-center-placeholder="true"] p.is-editor-empty:first-child {
                position: relative;
            }
        `;
        
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

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
                defaultAlignment: 'center',
            }),
            Highlight.configure({ multicolor: true }),
            Table.configure({
                resizable: true,
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
                emptyNodeClass: 'is-empty',
                showOnlyWhenEditable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image,
            Link.configure({
                openOnClick: true,
                autolink: true,
            }),
        ],
        content: html,
        onUpdate: ({ editor }) => {
            const newHtml = editor.getHTML();
            onChange && onChange(newHtml);
        },
    })

    // Apply data attribute for centered placeholder
    useEffect(() => {
        if (editor && editor.view && editor.view.dom) {
            if (shouldCenterPlaceholder) {
                editor.view.dom.setAttribute('data-center-placeholder', 'true');
                editor.commands.setTextAlign('center');
            } else {
                editor.view.dom.setAttribute('data-center-placeholder', 'false');
                editor.commands.setTextAlign('left');
            }
        }
    }, [editor, shouldCenterPlaceholder]);

    useEffect(() => {
        setHTML(value); 
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
            
            // Set alignment based on placeholder text
            if (shouldCenterPlaceholder) {
                editor.commands.setTextAlign('center');
            } else {
                editor.commands.setTextAlign('left');
            }
        }
    }, [value, editor, shouldCenterPlaceholder]);

    // Fixed cursor positioning handler with alignment support
    const handleEditorClick = () => {
        if (!editor) return;
        
        // For empty editor, we need special handling
        if (editor.isEmpty) {
            setTimeout(() => {
                // Use basic focus first
                editor.commands.focus();
                
                // Then set cursor at position 1 (beginning of first node)
                const { state, view } = editor;
                if (state.doc.content.size > 0) {
                    const tr = state.tr;
                    const pos = 1; // Position after paragraph opening tag
                    const newSelection = TextSelection.create(state.doc, pos);
                    tr.setSelection(newSelection);
                    view.dispatch(tr);
                    
                    // Apply alignment based on placeholder text
                    if (shouldCenterPlaceholder) {
                        editor.commands.setTextAlign('center');
                    } else {
                        editor.commands.setTextAlign('left');
                    }
                }
            }, 0);
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <>
            <BubbleMenu shouldShow={() => true} tippyOptions={{placement: "top"}} editor={editor}>
                <FloatingToolbar editor={editor}/>
            </BubbleMenu>
            <EditorContent 
                editor={editor} 
                className={`${className ?? "j-widget-title"} ${bordered ? "j-widget-rte-bordered" : "cm-width100"}`} 
                onClick={handleEditorClick}
            />
        </>
    );
}

export default WidgetTitle;