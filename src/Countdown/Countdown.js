import React, { useState, useEffect } from 'react'

const Countdown = (props) => {

    const [time, setTime] = useState(3)
    const [timeAnimation, setTimeAnimation] = useState('animate__animated animate__flipInX')
    const [hideCountdown, setHideCountdown] = useState('hidden')

    const countdown = () => {
        setTimeAnimation("")
        if (time <= 0) {
            setHideCountdown('animate__animated animate__flipOutX')
            setTimeout(() => setHideCountdown('hidden'), 1000);
            return
        }
        console.log(time)
        setTimeout(() => {
            setTimeAnimation("animate__animated animate__flipInX")
            setTime(time - 1)

        }, 10)
    }

    useEffect(() => {
        if(props.start){
            setHideCountdown('')
            setTimeout(countdown, 1500);
        }
    }, [time, props.start])

    return (
        <div className={`${hideCountdown} h-96 flex justify-center items-center`}>
            <div className={`${time == 0 ? 'hidden' : ''}`}>
                <p className={`text-8xl ${timeAnimation}`}>{time}</p>
                <p className={`text-4xl`}>Preparate!</p>
            </div>
            <div className={`${time != 0 ? 'hidden' : ''} animate__animated animate__flipInX`}>
                <p className={`text-8xl`}>Ya!</p>
            </div>
        </div>
    )

}

export default Countdown