import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import '../index.css';
import TriviaQuestion from '../TriviaQuestion/TriviaQuestion'
import Member from '../Member/Member'
import Countdown from '../Countdown/Countdown'
import 'animate.css'




const Guest = () => {

    const { group_id } = useParams();

    const { username } = useParams();

    const { profile_image } = useParams();

    const [members, setMembers] = useState([]);

    const [scorePosition, setScorePosition] = useState(0);

    const [trivia, setTrivia] = useState([]);

    const [time, setTime] = useState(10);

    const [isCorrect, setIsCorrect] = useState(true);

    const [membersScoreClass, setMembersScoreClass] = useState('hidden');

    const [membersClass, setMembersClass] = useState('');

    const [startCountdown, setStartCountdown] = useState(false);

    const [showTrivia, setShowTrivia] = useState(false);

    


    const history = useHistory();

    const [socket, setSocket] = useState(io("http://localhost:8080", { autoConnect: false }));

    let time_counter_start = new Date().getTime() / 1000;

    let question_id = 0


    useEffect(() => {
        console.log("useeffect")
        socket.auth = {
            "username": username,
            "group_id": group_id,
            "profile_image": profile_image
        }
        socket.connect();

        socket.on(`membersConnected`, (members) => {
            console.log(members)

            const admin = Object.keys(members).filter((key) => members[key].is_admin)

            if (admin.length == 0) {
                socket.disconnect()
                socket.removeAllListeners(`membersConnected`);
                return history.push(`/`)
            }

            setMembers(members)
        })



        socket.on(`gameStarted`, (game) => {

            setStartCountdown(true)


            setTimeout(() => {

                if (game.trivia) game.trivia[question_id].show = true

                setTrivia(game.trivia ?? [])
    
                setMembersClass('hidden')

            }, 6000, game);


        })

    }, [])


    const handleAnswerSelected = (question_id, question) => {
        const time_counter_finish = new Date().getTime() / 1000;

        question.response_time = time_counter_finish - time_counter_start
        question.time = time

        const score = Math.round((question.time - question.response_time) * 1000 / question.time)

        question.score = (question.answer_selected.is_correct && question.response_time <= 10 && score > 0) ? score : 0

        trivia[question_id] = question

        console.log(trivia)

        socket.emit("resultAnswers", trivia)


        const all_answers_made = trivia.filter((t) => !t.answer_selected)
        if (all_answers_made == 0) {
            alert("Termino!")
        }

        setIsCorrect(question.answer_selected.is_correct)

        trivia[question_id].show = false;

        question_id++
        setTrivia([...trivia])
        setMembersScoreClass('')

        setTimeout(() => {
            if (trivia[question_id]) trivia[question_id].show = true;
            setTrivia([...trivia])
            
            if (all_answers_made > 0) setMembersScoreClass('hidden')

            time_counter_start = new Date().getTime() / 1000
        }, 5000, trivia, question_id);

    }

    // const showQuestions = () => {
    //     alert("ra")
    // }


    return (
        <div className="relative w-full max-w-md p-4 bg-white rounded-3xl">

            <div className={membersClass}>
                {Object.keys(members).map((key) => {
                    let isUser = false
                    if (key == socket.id) {
                        isUser = true
                    }

                    return (
                        // <Member member={members[key]} key={key} isCorrect={isCorrect} isUser={isUser}></Member>

                        <div className={`bg-white w-full flex items-center px-1 my-1 rounded-xl bg-gray-50`}>
                            <div className="flex items-center space-x-3">
                                <img src={decodeURIComponent(members[key].profile_image)} alt="imagen perfil" className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="flex-grow p-3 text-left">
                                <div className="font-semibold text-gray-700">
                                    {members[key].username}
                                </div>
                            </div>
                            <div className="p-2">
                                <span class="block h-4 w-4 bg-green-400 rounded-full bottom-0 right-0"></span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Countdown start={startCountdown}></Countdown>


            <div className={membersScoreClass}>
                <div className="bg-white w-full flex items-center px-1 my-1 rounded-xl">
                    <div className="flex items-center space-x-3 pr-8 font-semibold text-gray-700">
                        <span>Clasificación</span>
                    </div>
                    <div className="flex-grow p-3 text-left">
                        <div className="font-semibold text-gray-700">
                            Nombre
                    </div>
                    </div>
                    <div className="p-2">
                        <span className="font-semibold text-gray-700">Puntuación</span>
                    </div>
                </div>
                {Object.entries(members).sort((a, b) => {
                    return b[1].score - a[1].score
                })
                    .map((member, index) => {
                        let isUser = false
                        if (member[0] == socket.id) {
                            isUser = true
                        }

                        return (
                            <Member position={index+1} member={member[1]} key={member[0]} isCorrect={isCorrect} isUser={isUser}></Member>
                        )
                    })}

            </div>

            {trivia.map((question, question_id) => (
                <TriviaQuestion question={question} question_id={question_id} onAnswerSelected={handleAnswerSelected}></TriviaQuestion>
            ))}
        </div>

    )

}

export default Guest