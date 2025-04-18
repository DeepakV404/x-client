import { useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button, Divider, Input, Popover, Space, Tooltip } from 'antd';
import { InsertRowLeftOutlined, InsertRowRightOutlined, InsertRowBelowOutlined, InsertRowAboveOutlined } from '@ant-design/icons';

import { FONT_SIZE_CONFIG, FontSizeProps, FORMAT_TEXT_CONFIG, HEADING_STYLE_CONFIG, HeadingStyleProps, TextFormatProps } from './toolbar-config';

import MaterialSymbolsRounded from '../MaterialSymbolsRounded';
import Loading from '../../utils/loading';

const Toolbar = (props: { editor: any, loading?: boolean, saved?: boolean, showSave?: boolean }) => {

    const { editor, loading, saved, showSave }    =   props;

    const linkInputRef: any     =   useRef();
    const imageInputRef: any    =   useRef();

    const TextDecorationConfig = [
        {
            key: "bold",
            icon: "format_bold",
            onClick:   () => editor.chain().focus().toggleBold().run(),
            isDisabled: () => !editor.can().chain().focus().toggleBold().run()
        },
        {
            key: "italic",
            icon: "format_italic",
            onClick:   () => editor.chain().focus().toggleItalic().run(),
            isDisabled: () => !editor.can().chain().focus().toggleItalic().run()
        },
        {
            key: "underline",
            icon: "format_underlined",
            onClick:   () => editor.chain().focus().toggleUnderline().run(),
            isDisabled: () => !editor.can().chain().focus().toggleUnderline().run()
        },
        {
            key: "strike",
            icon: "strikethrough_s",
            onClick:   () => editor.chain().focus().toggleStrike().run(),
            isDisabled: () => !editor.can().chain().focus().toggleStrike().run()
        },
        {
            key: "subscript",
            icon: "subscript",
            onClick:   () => editor.chain().focus().toggleSubscript().run(),
            isDisabled: () => !editor.can().chain().focus().toggleSubscript().run()
        },
        {
            key: "superscript",
            icon: "superscript",
            onClick:   () => editor.chain().focus().toggleSuperscript().run(),
            isDisabled: () => !editor.can().chain().focus().toggleSuperscript().run()
        }
    ];
    
    return (
        <>
            <div className={`j-rte-toolbar`}>
                {
                    showSave ?
                        <>
                            <div className="j-rte-save-indicator">
                                {loading ? <Loading size={"small"} fontSize={16}/> : saved ? <MaterialSymbolsRounded font="cloud_done" size="20" color='#3eb200' filled/> : <MaterialSymbolsRounded font='cloud_sync' size='20' filled/>}
                            </div>
                            <Divider type='vertical' style={{height: "100%"}}/>
                        </>
                    :
                        null
                }
                <div className={`j-rte-toolbar-icon ${Object.values(FONT_SIZE_CONFIG).find((_fontSize: FontSizeProps) => editor.isActive('textStyle', { fontSize: _fontSize.size + "px" })) ? "is-active" : ""}`}>
                    <Popover
                        content = {
                            <Space direction='vertical' size={4}>
                                {Object.values(FONT_SIZE_CONFIG).map((_fontSize: FontSizeProps) => {
                                    return (
                                        <div 
                                            style           =   {{padding: "4px 6px"}}
                                            className       =   {`j-rte-action-wrapper ${editor.isActive('textStyle', { fontSize: _fontSize.size + "px" }) ? 'is-active' : ''}`} 
                                            onClick         =   {(event) => {event.stopPropagation(); editor.commands.setFontSize(_fontSize.size)}}
                                        >
                                            {_fontSize.size}
                                        </div>
                                    )
                                })}
                            </Space>
                        }
                        trigger         =   {["click"]}
                        placement       =   'bottom'
                        rootClassName   =   'j-rte-heading-popoup-wrapper'
                    >
                        <Space>
                            <div className='cm-margin-left5'>{Object.values(FONT_SIZE_CONFIG).find((_fontSize: FontSizeProps) => editor.isActive('textStyle', { fontSize: _fontSize.size + "px" }))?.size ?? 14}</div>
                            <MaterialSymbolsRounded font='expand_more' size='20' weight='400'/>
                        </Space>
                    </Popover>
                </div>
                {TextDecorationConfig.map((_textDecorationItem) => {
                    return (
                        <div 
                            key             =   {_textDecorationItem.key}
                            className       =   {`j-rte-action-wrapper ${editor.isActive(_textDecorationItem.key) ? 'is-active' : ''} ${_textDecorationItem.isDisabled() ? "is-disabled" : ""}`} 
                            onClick         =   {() => _textDecorationItem.onClick()}
                        >
                            <MaterialSymbolsRounded
                                size    =   '22'
                                font    =   {_textDecorationItem.icon}
                            />
                        </div>
                    )
                })}
                <Divider type='vertical' style={{height: "100%"}}/>
                <div className={`j-rte-toolbar-icon ${Object.values(FORMAT_TEXT_CONFIG).find((_format: TextFormatProps) => editor.isActive({ textAlign: _format.key })) ? "is-active" : ""}`}>
                    <Popover
                        content         =   {Object.values(FORMAT_TEXT_CONFIG).map((_elementFormatItem) => {
                            return (
                                <div 
                                    className       =   {`j-rte-action-wrapper cm-margin-bottom2 ${editor.isActive({ textAlign: _elementFormatItem.key }) ? 'is-active' : ''}`}
                                    onClick         =   {() => editor.chain().focus().setTextAlign(_elementFormatItem.key).run()}
                                >
                                    <Space>
                                        <MaterialSymbolsRounded
                                            size    =   '22'
                                            font    =   {_elementFormatItem.icon}
                                        />
                                        <div className='cm-font-size12'>{_elementFormatItem.text}</div>
                                    </Space>
                                </div>
                            )
                        })}
                        trigger         =   {["click"]}
                        placement       =   'bottom'
                        rootClassName   =   'j-rte-heading-popoup-wrapper'
                    >
                        <Space>
                            <MaterialSymbolsRounded font={Object.values(FORMAT_TEXT_CONFIG).find((_format: TextFormatProps) => editor.isActive({ textAlign: _format.key }))?.icon || "format_align_left"} size="22"/>
                            <MaterialSymbolsRounded font='expand_more' size='20' weight='400'/>
                        </Space>
                    </Popover>
                </div>
                <Divider type='vertical' style={{height: "100%"}}/>
                <div className={`j-rte-toolbar-icon ${Object.values(HEADING_STYLE_CONFIG).find((_heading: HeadingStyleProps) => editor.isActive('heading', { level: _heading.level })) ? "is-active" : ""}`}>
                    <Popover
                        content = {
                            <Space direction='vertical' size={4}>
                                {Object.values(HEADING_STYLE_CONFIG).map((_heading: HeadingStyleProps) => {
                                    return (
                                        <div 
                                            style           =   {{padding: "4px"}}
                                            className       =   {`j-rte-action-wrapper ${editor.isActive('heading', { level: _heading.level }) ? 'is-active' : ''}`} 
                                            onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().toggleHeading({ level: _heading.level }).run()}}
                                        >
                                            <MaterialSymbolsRounded
                                                size    =   {_heading.iconSize}
                                                font    =   {_heading.icon}
                                            />
                                        </div>
                                    )
                                })}
                            </Space>
                        }
                        trigger         =   {["click"]}
                        placement       =   'bottom'
                        rootClassName   =   'j-rte-heading-popoup-wrapper'
                    >
                        <Space>
                            <MaterialSymbolsRounded font={Object.values(HEADING_STYLE_CONFIG).find((_heading: HeadingStyleProps) => editor.isActive('heading', { level: _heading.level }))?.icon || "format_h1"} size="22"/>
                            <MaterialSymbolsRounded font='expand_more' size='20' weight='400'/>
                        </Space>
                    </Popover>
                </div>
                <div 
                    className       =   {`j-rte-action-wrapper ${editor.isActive('bulletList') ? "is-active" : ""} ${!editor.can().chain().focus().toggleBulletList().run() ? "is-disabled" : ""}`}
                    onClick         =   {() => editor.chain().focus().toggleBulletList().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"format_list_bulleted"}
                    />
                </div>
                <div 
                    className       =   {`j-rte-action-wrapper ${editor.isActive('orderedList') ? "is-active" : ""} ${!editor.can().chain().focus().toggleOrderedList().run() ? "is-disabled" : ""}`}
                    onClick         =   {() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"format_list_numbered"}
                    />
                </div>
                <div 
                    className       =   {`j-rte-action-wrapper ${editor.isActive('taskList') ? "is-active" : ""}`}
                    onClick         =   {() => editor.chain().focus().toggleTaskList().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"event_list"}
                    />
                </div>
                <div 
                    className   =   {`j-rte-action-wrapper ${editor.isActive('blockquote') ? "is-active" : ""} ${!editor.can().chain().focus().toggleBlockquote().run() ? "is-disabled" : ""}`}
                    onClick     =   {() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"format_quote"}
                    />
                </div>
                <div 
                    className       =   {`j-rte-action-wrapper ${editor.isActive('codeBlock') ? "is-active" : ""} ${!editor.can().chain().focus().toggleCodeBlock().run() ? "is-disabled" : ""}`}
                    onClick         =   {() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"code"}
                    />
                </div>
                <div 
                    className       =   {`j-rte-action-wrapper`}
                    onClick         =   {() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <MaterialSymbolsRounded
                        size    =   '22'
                        font    =   {"horizontal_rule"}
                    />
                </div>
                <Divider type='vertical' style={{height: "100%"}}/>
                <Popover
                    destroyTooltipOnHide
                    trigger     =   {["click"]}
                    placement   =   'bottom'
                    content     =   {
                        <Space>
                            <Input defaultValue={editor.getAttributes('link').href} ref={linkInputRef} placeholder='Enter URL' prefix={<MaterialSymbolsRounded font='link'/>}/>
                            <Button type='primary' onClick={() => {editor.chain().focus().extendMarkRange('link').setLink({ href: linkInputRef.current.input.value }).run();}}>Set Link</Button>
                        </Space>
                    }
                >
                    <div className       =   {`j-rte-action-wrapper ${editor.isActive('link') ? "is-active" : ""}`}>
                        <MaterialSymbolsRounded
                            size    =   '22'
                            font    =   {"link"}
                        />
                    </div>
                </Popover>
                <Popover
                    content =   {<HexColorPicker color={editor.getAttributes('textStyle').color} onChange={(color) => editor.chain().focus().setColor(`${color}`).run()} />}
                    trigger =   {["click"]}
                >
                    <div 
                        className       =   {`j-rte-action-wrapper`}
                        onClick         =   {() => editor.commands.unsetHighlight()}
                    >
                        <MaterialSymbolsRounded
                            size    =   '22'
                            font    =   {"format_color_text"}
                        />
                        <div style={{background: editor.getAttributes('textStyle').color}} className='j-rte-color-indicator'></div>
                    </div>
                </Popover>
                <Popover
                    content =   {<HexColorPicker color={editor.getAttributes('textStyle').color} onChange={(color) => editor.chain().focus().toggleHighlight({ color: `${color}` }).run()} />}
                    trigger =   {["click"]}
                >
                    <div 
                        className       =   {`j-rte-action-wrapper ${editor.isActive('highlight') ? "is-active" : ""}`}
                    >
                        <div className={`j-rte-action-style-remove ${editor.isActive('highlight') ? "show" : ""}`} onClick={(event) => {event.stopPropagation(); editor.commands.unsetHighlight()}}>
                            <MaterialSymbolsRounded font='close' size='14'/>
                        </div>
                        <MaterialSymbolsRounded
                            size    =   '22'
                            font    =   {"format_color_fill"}
                        />
                    </div>
                </Popover>
                <Divider type='vertical' style={{height: "100%"}}/>
                <Popover
                    destroyTooltipOnHide
                    trigger     =   {["click"]}
                    placement   =   'bottom'
                    content     =   {
                        <Space>
                            <Input ref={imageInputRef} placeholder='Enter Image URL' prefix={<MaterialSymbolsRounded font='link'/>}/>
                            <Button type='primary' onClick={() => {editor.chain().focus().setImage({ src: imageInputRef?.current?.input?.value }).run()}}>Upload</Button>
                        </Space>
                    }
                >
                    <div className       =   {`j-rte-action-wrapper`}>
                        <MaterialSymbolsRounded
                            size    =   '22'
                            font    =   {"image"}
                        />
                    </div>
                </Popover>
                <div className={`j-rte-action-wrapper`}>
                    <Popover
                        content =   {
                            <Space direction='vertical' size={0}>
                                <Space>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()}}
                                    >
                                        Insert Table (3x3)
                                    </div>
                                </Space>
                                <Divider style={{marginBlock: "5px"}}/>
                                <Space size={4}>
                                    <Tooltip title={"Add column before"}>
                                        <div 
                                            className       =   {`j-rte-action-wrapper`}
                                            onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().addColumnBefore().run()}}
                                        >
                                            <InsertRowLeftOutlined style={{fontSize: "16px"}}/>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={"Add column after"}>
                                        <div 
                                            className       =   {`j-rte-action-wrapper`}
                                            onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().addColumnBefore().run()}}
                                        >
                                            <InsertRowRightOutlined style={{fontSize: "16px"}}/>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={"Add row above"}>
                                        <div 
                                            className       =   {`j-rte-action-wrapper`}
                                            onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().addRowBefore().run()}}
                                        >
                                            <InsertRowAboveOutlined style={{fontSize: "16px"}}/>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={"Add row below"}>
                                        <div 
                                            className       =   {`j-rte-action-wrapper`}
                                            onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().addRowAfter().run()}}
                                        >
                                            <InsertRowBelowOutlined style={{fontSize: "16px"}}/>
                                        </div>
                                    </Tooltip>
                                </Space>
                                <Divider style={{marginBlock: "5px"}}/>
                                <Space direction='vertical' size={1}>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().toggleHeaderRow().run()}}
                                    >
                                        Toggle Row Header
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().toggleHeaderColumn().run()}}
                                    >
                                        Toggle Column Header
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().toggleHeaderCell().run()}}
                                    >
                                        Toggle Cell Header
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.commands.deleteRow()}}
                                    >
                                        Delete row
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.commands.deleteColumn()}}
                                    >
                                        Delete column
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().mergeCells().run()}}
                                    >
                                        Merge Cells
                                    </div>
                                    <div 
                                        className       =   {`j-rte-action-wrapper cm-font-size12`}
                                        onClick         =   {(event) => {event.stopPropagation(); editor.chain().focus().splitCell().run()}}
                                    >
                                        Split Cell
                                    </div>
                                </Space>
                            </Space>
                        }
                        trigger     =   {["click"]}
                        placement   =   'bottomRight'
                    >
                        <Space>
                            <MaterialSymbolsRounded
                                size    =   '22'
                                font    =   {"table"}
                            />
                            <MaterialSymbolsRounded font='expand_more' size='20' weight='400'/>
                        </Space>
                    </Popover>
                </div>
                <Divider type='vertical' style={{height: "100%"}}/>
                <div 
                    className   =   {`j-rte-action-wrapper ${!editor.can().chain().focus().undo().run() ? "is-disabled" : ""}`}
                    onClick     =   {() => editor.chain().focus().undo().run()}
                >
                    <MaterialSymbolsRounded font='undo' size='22'/>
                </div>
                <div 
                    className   =   {`j-rte-action-wrapper ${!editor.can().chain().focus().redo().run() ? "is-disabled" : ""}`}
                    onClick     =   {() => editor.chain().focus().redo().run()}
                >
                    <MaterialSymbolsRounded font='redo' size='22' />
                </div>
                <Divider type='vertical' style={{height: "100%"}}/>
            </div>
        </>
    )   
}

export default Toolbar