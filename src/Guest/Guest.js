import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import '../index.css';
import TriviaQuestion from '../TriviaQuestion/TriviaQuestion'




const Guest = () => {

    const { group_id } = useParams();

    const { username } = useParams();

    const { profile_image } = useParams();

    const [members, setMembers] = useState([]);

    const [trivia, setTrivia] = useState([]);

    const [time, setTime] = useState(10);

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


            // const members_list = 
            setMembers(members)
        })


        
        socket.on(`gameStarted`, (game) => {

            if (game.trivia) game.trivia[question_id].show = true

            setTrivia(game.trivia ?? [])


            // startTimer(game.time_per_question)
        })

    }, [])

    // const startTimer = (seconds) => {
    //     console.log(seconds)
    //     // let time_start = new Date().getTime() / 1000;
    //     console.log(time_counter_start)
    // }


    const handleAnswerSelected = (question_id, question) => {
        const time_counter_finish = new Date().getTime() / 1000;

        

        question.response_time = time_counter_finish - time_counter_start
        question.time = time

        const score = Math.round((question.time - question.response_time) * 1000 / question.time)

        question.score = (question.answer_selected.is_correct && question.response_time <= 10 && score > 0) ? score : 0

        console.log(trivia)


        trivia[question_id] = question

        socket.emit("resultAnswers", trivia)


        const all_answers_made = trivia.filter((t) => !t.answer_selected)
        if (all_answers_made == 0) {
            alert("Termino!")
        }



        trivia[question_id].show = false;

        question_id++
        setTrivia([...trivia])

        setTimeout(() => {
            if (trivia[question_id]) trivia[question_id].show = true;
            setTrivia([...trivia])
            time_counter_start = new Date().getTime() / 1000
        }, 1000, trivia, question_id);




    }

    return (
        <div className="relative w-full max-w-md p-4 bg-white rounded-3xl">
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
            {Object.keys(members).map((key) => {
                return (
                    <>
                        <div className="bg-white w-full flex items-center px-1 my-1 rounded-xl bg-gray-50">
                        <div className="flex items-center space-x-3">
                                <span className="pl-5 pr-12 text-xl font-bold">1</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img src={decodeURIComponent(members[key].profile_image)} alt="imagen perfil" className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="flex-grow p-3 text-left">
                                <div className="font-semibold text-gray-700">
                                    {members[key].username}
                                </div>
                            </div>
                            <div className="p-2">
                                <span className="font-bold">{members[key].score} </span><span className="text-sm">pts</span>
                            </div>
                        </div>
                    </>
                )


            })}

            


            {trivia.map((question, question_id) => (
                <TriviaQuestion question={question} question_id={question_id} onAnswerSelected={handleAnswerSelected}></TriviaQuestion>

            ))}
        </div>

    )

}

export default Guest