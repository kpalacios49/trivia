import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import '../index.css';



const Guest = () => {

    const { group_id } = useParams();

    const { username } = useParams();

    const { profile_image } = useParams();

    const [members, setMembers] = useState([]);

    const [trivia, setTrivia] = useState([]);

    const history = useHistory();

    const [socket, setSocket] = useState(io("http://localhost:8080", { autoConnect: false }));


    const checkAnswer = (event) => {
        const answer_selected = event.target.getAttribute('data-answer')
        const question = event.target.getAttribute('data-question')

        if (!trivia[question].answer_selected) {
            trivia[question].answer_selected = answer_selected
            console.log(trivia)

            event.target.classList.remove('bg-indigo-200')

            if (answer_selected == trivia[question].correct_answer) {
                event.target.classList.add('bg-green-400')
            }
            else {
                event.target.classList.add('bg-red-400')
            }

        }

        socket.emit("resultAnswers", trivia)

        const all_answers_made = trivia.filter((t) => !t.answer_selected)
        if (all_answers_made == 0) {
            alert("Termino!")
        }
    }

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


            const members_list = Object.keys(members).map((key) => {
                return (
                    <>
                        <div className="bg-white w-full flex items-center p-2 rounded-3xl shadow border">
                            <div className="flex items-center space-x-4">
                                <img src={decodeURIComponent(members[key].profile_image)} alt="imagen perfil" className="w-16 h-16 rounded-full" />
                            </div>
                            <div className="flex-grow p-3">
                                <div className="font-semibold text-gray-700">
                                    {members[key].username}
                                </div>
                            </div>
                            <div className="p-2">
                                <span class="block h-4 w-4 bg-green-400 rounded-full bottom-0 right-0"></span>
                            </div>
                        </div>
                    </>
                )


            })
            setMembers(members_list)
        })

        socket.on(`gameStarted`, (game) => {
            setTrivia(game.trivia ?? [])
        })

    }, [])

    return (
        <div className="relative w-full max-w-md p-4 bg-white rounded-3xl">


            {/* <h1>Guest</h1> */}
            {/* 
            <h1>Nombre {username}</h1>
            <h2>Grupo {group_id}</h2> */}

            {members}


            {trivia.map((t, question_id) => (
                <div>
                    <p>{t.question}</p>
                    {/* <li style={{ color: 'red' }}>{t.correct_answer}</li> */}

                    <div class="p-2 " >

                    {t.answers.map((answer, index) => (
                        <>
                                <div key={index} data-question={question_id} data-answer={answer} onClick={checkAnswer} class="my-2 flex items-center p-4 bg-indigo-200 rounded-lg shadow-xs cursor-pointer hover:bg-indigo-500 hover:text-gray-100">

                                    {/* <svg class="h-6 fill-current hover:text-gray-100" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>CSS3 icon</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" /></svg> */}
                                    <div>
                                        <p class=" text-xs font-medium ml-2 text-center">
                                            {answer}
                                        </p>

                                    </div>
                                </div>
                            {/* <li key={index} data-question={question_id} onClick={checkAnswer}>{value}</li> */}
                        </>
                    ))}
                            </div>


                </div>
            ))}
        </div>

    )

}

export default Guest