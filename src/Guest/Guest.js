import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";


const Guest = () => {

    const { group_id } = useParams();

    const { username } = useParams();

    const [members, setMembers] = useState([]);

    const [trivia, setTrivia] = useState([]);

    const history = useHistory();

    const socket = io("http://localhost:8080", { autoConnect: false });

    const checkAnswer = (event) => {
        const answer_selected = event.target.innerHTML
        const question = event.target.getAttribute('data-question')

        if (!trivia[question].answer_selected) {
            trivia[question].answer_selected = answer_selected
            console.log(trivia)

            if (answer_selected == trivia[question].correct_answer) {
                event.target.style.color = "green"
            }
            else {
                event.target.style.color = "red"
            }

        }

        // emitir un evento y subirlo a firebase


    }

    useEffect(() => {
        console.log("useeffect")
        socket.auth = {
            "username": username,
            "group_id": group_id
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
                return <p>{members[key].username}</p>
            })
            setMembers(members_list)
        })

        socket.on(`gameStarted`, (game) => {
            setTrivia(game.trivia)
        })

    }, [])

    return (
        <div>

            <h1>Guest</h1>

            <h1>Nombre {username}</h1>
            <h2>Grupo {group_id}</h2>

            {members}


            {trivia.map((t, question_id) => (
                <div>
                    <p>{t.question}</p>
                    <ul>
                        <li style={{ color: 'red' }}>{t.correct_answer}</li>

                        {t.answers.map((value, index) => (
                            <li key={index} data-question={question_id} onClick={checkAnswer}>{value}</li>
                        ))}
                    </ul>

                </div>
            ))}
        </div>

    )

}

export default Guest