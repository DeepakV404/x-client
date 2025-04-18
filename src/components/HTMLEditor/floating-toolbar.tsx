import { Popover, Space } from 'antd';
import { HexColorPicker } from 'react-colorful';

import { FONT_SIZE_CONFIG, FontSizeProps, FORMAT_TEXT_CONFIG, HEADING_STYLE_CONFIG, HeadingStyleProps, TextFormatProps, TITLE_HEADING_STYLE_CONFIG } from './toolbar-config';

import MaterialSymbolsRounded from '../MaterialSymbolsRounded';

const FloatingToolbar = (props: {editor: any}) => {

    const { editor }    =   props;

    const handldleFormatTextClick = (currentFormat: any) => {
        const formatOptions = Object.values(FORMAT_TEXT_CONFIG).map((_formatItem: any) => _formatItem.key);
        let nextIndex = formatOptions.findIndex((format: string) => format === currentFormat) + 1

        if(nextIndex > 3){
            nextIndex = 0
        }

        editor.chain().focus().setTextAlign(formatOptions[nextIndex]).run()
    }

    return (
        <Space className="j-rte-bubble-menu cm-flex-align-center cm-padding5" size={2}>
            <div className={`j-rte-toolbar-icon ${Object.values(FONT_SIZE_CONFIG).find((_fontSize: FontSizeProps) => editor.isActive('textStyle', { fontSize: _fontSize.size + "px" })) ? "is-active" : ""}`}>
                <Popover
                    content = {
                        <Space direction='vertical' size={4}>
                            {Object.values(FONT_SIZE_CONFIG).map((_fontSize: FontSizeProps) => {
                                return (
                                    <div 
                                        key             =   {_fontSize.size}
                                        className       =   {`j-rte-bubble-action-wrapper cm-font-size12 ${editor.isActive('textStyle', { fontSize: _fontSize.size + "px" }) ? 'is-active' : ''}`} 
                                        onClick         =   {(event) => {event.stopPropagation(); editor.commands.setFontSize(_fontSize.size)}}
                                        style           =   {{color: "#5F6368"}}
                                    >
                                        {_fontSize.size}
                                    </div>
                                )
                            })}
                        </Space>
                    }
                    trigger         =   {["click"]}
                    placement       =   'bottom'
                    rootClassName   =   "j-rte-bubble-menu-popover"
                >
                    <Space size={4}>
                        <div className='cm-margin-left5 cm-font-size12' style={{color: "#5F6368"}}>{Object.values(FONT_SIZE_CONFIG).find((_fontSize: FontSizeProps) => editor.isActive('textStyle', { fontSize: _fontSize.size + "px" }))?.size ?? 14}</div>
                        <MaterialSymbolsRounded 
                            font    =   'expand_more' 
                            size    =   '20' 
                            weight  =   '400' 
                            color   =   '#5F6368'
                        />
                    </Space>
                </Popover>
            </div>
            <Popover
                rootClassName   =   "j-rte-bubble-menu-popover"
                content         =   {
                    <Space size={4} direction='vertical'>
                        {
                            Object.values(TITLE_HEADING_STYLE_CONFIG).map((_heading: HeadingStyleProps) => (
                                <div 
                                    key             =   {_heading.level}
                                    className       =   {`j-rte-toolbar-icon ${editor.isActive('heading', { level: _heading.level }) ? 'is-active' : ''}`}
                                    onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().toggleHeading({ level: _heading.level }).run()}}
                                >
                                    <MaterialSymbolsRounded font={_heading.icon} size={_heading.iconSize} color='#5F6368'/>
                                </div>
                            ))
                        }
                    </Space>
                }
                trigger     =   {["hover"]}
                placement   =   'bottom'
            >
                <div className="cm-cursor-pointer cm-flex-center">
                    <div className={`j-rte-toolbar-icon ${Object.values(HEADING_STYLE_CONFIG).find((_heading: HeadingStyleProps) => editor.isActive('heading', { level: _heading.level })) ? "is-active" : ""}`}>
                        <MaterialSymbolsRounded font={Object.values(HEADING_STYLE_CONFIG).find((_heading: HeadingStyleProps) => editor.isActive('heading', { level: _heading.level }))?.icon || "format_h1"} size="20" color='#5F6368'/>
                    </div>
                </div>
            </Popover>
            <div className={`j-rte-toolbar-icon ${editor.isActive('bold') ? 'is-active' : ''}`} onClick =   {() => editor.chain().focus().toggleBold().run()}>
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   'format_bold'
                    color   =   '#5F6368'
                />
            </div>
            <div className={`j-rte-toolbar-icon ${editor.isActive('italic') ? 'is-active' : ''}`} onClick =   {() => editor.chain().focus().toggleItalic().run()}>
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   'format_italic'
                    color   =   '#5F6368'
                />
            </div>
            <div className={`j-rte-toolbar-icon ${editor.isActive('underline') ? 'is-active' : ''}`} onClick =   {() => editor.chain().focus().toggleUnderline().run()}>
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   'format_underlined'
                    color   =   '#5F6368'
                />
            </div>
            <div className={`j-rte-toolbar-icon ${editor.isActive('strike') ? 'is-active' : ''}`} onClick =   {() => editor.chain().focus().toggleStrike().run()}>
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   'strikethrough_s'
                    color   =   '#5F6368'
                />
            </div>
            <div 
                className       =   {`j-rte-toolbar-icon ${editor.isActive('bulletList') ? "is-active" : ""}`}
                onClick         =   {() => editor.chain().focus().toggleBulletList().run()}
            >
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   "format_list_bulleted"
                    color   =   '#5F6368'
                />
            </div>
            <div 
                className       =   {`j-rte-toolbar-icon ${editor.isActive('orderedList') ? "is-active" : ""}`}
                onClick         =   {() => editor.chain().focus().toggleOrderedList().run()}
            >
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   "format_list_numbered"
                    color   =   '#5F6368'
                />
            </div>
            {/* <div 
                className       =   {`j-rte-toolbar-icon ${editor.isActive('taskList') ? "is-active" : ""}`}
                onClick         =   {() => editor.chain().focus().toggleTaskList().run()}
            >
                <MaterialSymbolsRounded
                    size    =   '20'
                    font    =   "event_list"
                    color   =   '#5F6368'
                />
            </div> */}
            <Popover
                rootClassName   =   "j-rte-bubble-menu-popover"
                content         =   {<HexColorPicker color={editor.getAttributes('textStyle').color} onChange={(color: any) => editor.chain().focus().setColor(`${color}`).run()} />}
                trigger         =   {["click"]}
            >
                <div 
                    onClick         =   {() => editor.commands.unsetHighlight()}
                    className       =   "j-rte-toolbar-icon"
                >
                    <MaterialSymbolsRounded
                        size    =   '20'
                        font    =   "format_color_text"
                        color   =   '#5F6368'
                    />
                    <div style={{background: editor.getAttributes('textStyle').color}} className='j-rte-color-indicator'></div>
                </div>
            </Popover>


            <div className="cm-cursor-pointer cm-flex-center" onClick={() => handldleFormatTextClick(Object.values(FORMAT_TEXT_CONFIG).find((_format: TextFormatProps) => editor.isActive({ textAlign: _format.key }))?.key)}>
                <div className={`j-rte-toolbar-icon ${Object.values(FORMAT_TEXT_CONFIG).find((_format: TextFormatProps) => editor.isActive({ textAlign: _format.key })) ? "is-active" : ""}`}>
                    <MaterialSymbolsRounded font={Object.values(FORMAT_TEXT_CONFIG).find((_format: TextFormatProps) => editor.isActive({ textAlign: _format.key }))?.icon || "format_align_left"} size="20" color='#5F6368'/>
                </div>
            </div>

        </Space>
    )
}

export default FloatingToolbar