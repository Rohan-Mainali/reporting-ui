import React, { useEffect } from 'react'
import { useState } from 'react'

const ReportIcon = ({color}) => {

    const [fill,setFill] = useState('#0BBCD6')

    useEffect(() => {
        if ( color === 'blue') {
            setFill('#0BBCD6')
        } else {
            setFill('#0BBCD6')
        }
    },[color])

    return (
        <>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.3" cx="14" cy="14" r="14" fill={fill}/>
            <path d="M18.6667 8H9.33333C8.6 8 8 8.6 8 9.33333V18.6667C8 19.4 8.6 20 9.33333 20H18.6667C19.4 20 20 19.4 20 18.6667V9.33333C20 8.6 19.4 8 18.6667 8ZM15.3333 17.3333H10.6667V16H15.3333V17.3333ZM17.3333 14.6667H10.6667V13.3333H17.3333V14.6667ZM17.3333 12H10.6667V10.6667H17.3333V12Z" fill="black"/>
            </svg>
        </>
    )
}

export default ReportIcon