import React, { useRef, useEffect, useState } from 'react'
import CountUp from 'react-countup'

import 'animate.css'

const Member = (props) => {

    const [animation, setAnimation] = useState('')

    useEffect(() => {

        setAnimation("")
        if (!props.isCorrect && props.isUser) setTimeout(() => { setAnimation("animate__animated animate__tada ")}, 10)

    }, [props.member])

    return (
        <div className={`bg-white w-full flex items-center px-1 my-1 rounded-xl ${animation} ${props.isUser ? 'bg-indigo-200' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
                <span className="pl-5 pr-12 text-xl font-bold">{ props.position }</span>
            </div>
            <div className="flex items-center space-x-3">
                <img src={decodeURIComponent(props.member.profile_image)} alt="imagen perfil" className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-grow p-3 text-left">
                <div className="font-semibold text-gray-700">
                    {props.member.username}
                </div>
            </div>
            <div className="p-2">

                <span className="font-bold"><CountUp end={props.member.score} /> </span><span className="text-sm">pts</span>
            </div>
        </div>
    )

}

export default Member