import React, { forwardRef, useEffect, useImperativeHandle,useRef,useState } from 'react'


export default forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] =   useState(0)
    const listRef                           =   useRef(null) 

    const selectItem = index => {
        const item = props.items[index]

        if (item) {
            props.command({ id: item })
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => {
        if (listRef.current && listRef.current.children[selectedIndex]) {
            const selectedItem = listRef.current.children[selectedIndex]
            selectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }
    }, [selectedIndex, props.items])

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        },
    }))

    return (
        <div className="j-tiptap-dropdown-menu" style={{height: "150px", overflow: "auto"}} ref={listRef}>
            {
                props.items.length 
                ? 
                    props.items.map((item, index) => 
                        (
                            <button
                                className   =   {`cm-margin-bottom5 cm-font-size15 ${index === selectedIndex ? 'is-selected' : ''}`}
                                key         =   {index}
                                onClick     =   {() => selectItem(index)}
                            >
                                {item}
                            </button>
                        ))
                : 
                    <div className="cm-flex-center cm-height100 cm-font-opacity-black-65 cm-font-fam400 cm-font-size13">No result</div>
            }
        </div>
    )
})