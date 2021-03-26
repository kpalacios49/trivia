import React, { useEffect, useState } from 'react';
import {
    Route,
    Link,
    useParams
} from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios';



const Admin = () => {

    const { name } = useParams();

    const [members, setMembers] = useState([]);

    const [group, setGroup] = useState({})

    const [trivia, setTrivia] = useState([]);

    const [socket, setSocket] = useState(io("http://localhost:8080", { autoConnect: false }));

    const makeID = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.toUpperCase();
    }

    const handleTriviaApi = async (event) => {
        event.preventDefault()

        const amount = event.target.amount.value;
        const category = event.target.category.value;
        const difficulty = event.target.difficulty.value;
        const type = event.target.type.value;

        const params = {}


        // https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
        // const request = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`

        const request = await axios.get(`https://opentdb.com/api.php`, {
            params: {
                amount: amount,
                category: category,
                difficulty: difficulty,
                type: type
            }
        })
        // .then( (res) => {
        //     console.log(res)
        // })
        if (request.data.results.length > 0) {
            const trivia_response = request.data.results
            trivia_response.map(q => {
                console.log(q)
                q.answers = shuffle([...q.incorrect_answers, q.correct_answer])
                // return {
                //     // ...q,
                //     answers: [].concat(q.incorrect_answers).push(q.correct_answer)
                // }
            })
            console.log(trivia_response)

            socket.emit('triviaQuestionsAPI', trivia_response)

        }
        else {
            console.log("No se encontraron preguntas con esas especificaciones")
        }
    }

    const startTrivia = () => {
        // Verificar que haya jugadores conectados
        // Verificar que haya QA cargadas
        socket.emit('startTrivia', { state: "started" })

    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

    useEffect(() => {

        const group_id = makeID(6)

        socket.auth = {
            "username": name,
            "group_id": group_id,
            "is_admin": true
        }
        socket.connect();


        socket.on(`membersConnected`, (members) => {
            console.log(members)

            const members_list = Object.keys(members).map((key) => {
                return <p>{members[key].username}</p>
            })
            setMembers(members_list)
        })

        socket.on(`gameStarted`, (game) => {
            setTrivia(game.trivia)
        })

        setGroup({
            group_id: group_id
        })

    }, [])

    return (
        <div>

            <h1>Admin {name}</h1>
            <h2>Grupo {group.group_id}</h2>

            <form onSubmit={handleTriviaApi}>
                <label for="amount">Number of Questions:</label>
                <input type="number" name="amount" id="amount" min="1" max="50" value="10" />

                <br />

                <label for="category">Selecciona una categoria: </label>
                <select name="category">
                    <option value="">Cualquier categoria</option>
                    <option value="9">Conocimiento General</option>
                    <option value="10">Entretenimiento: Libros</option>
                    <option value="11">Entretenimiento: Peliculas</option>
                    <option value="12">Entretenimiento: Musica</option>
                    <option value="13">Entretenimiento: Musicales &amp; obras de teatro</option>
                    <option value="14">Entretenimiento: Television</option>
                    <option value="15">Entretenimiento: Videojuegos</option>
                    <option value="16">Entretenimiento: Juegos de mesa</option>
                    <option value="17">Ciencia &amp; Naturaleza</option>
                    <option value="18">Ciencia: Computadoras</option>
                    <option value="19">Ciencia: Matemáticas</option>
                    <option value="20">Mitología</option>
                    <option value="21">Deportes</option>
                    <option value="22">Geografia</option>
                    <option value="23">Historia</option>
                    <option value="24">Politica</option>
                    <option value="25">Arte</option>
                    <option value="26">Celebridades</option>
                    <option value="27">Animales</option>
                    <option value="28">Vehiculos</option>
                    <option value="29">Entretenimiento: Comics</option>
                    <option value="30">Ciencia: Gadgets</option>
                    <option value="31">Entretenimiento: Anime &amp; Manga</option>
                    <option value="32">Entretenimiento: Cartoon &amp; Animaciones</option>
                </select>

                <br />

                <label for="difficulty">Selecciona la dificultad: </label>
                <select name="difficulty">
                    <option value="">Cualquier dificultad</option>
                    <option value="easy">Facil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Dificil</option>
                </select>

                <br />

                <label for="type">Selecciona el tipo: </label>
                <select name="type">
                    <option value="">Cualquier tipo</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">Verdadero / Falso</option>
                </select>

                <br />

                <button type="submit">Generate API URL</button>
            </form>

            <button type="button" onClick={startTrivia}>Start</button>
            <br />

            <span>Conectados</span>
            <br />
            {members}

            {trivia.map((t) => (
                <div>
                    <p>{t.question}</p>
                    <ul>
                        <li style={{color:'red'}}>{t.correct_answer}</li>

                        {t.answers.map(i => (
                            <li>{i}</li>
                        ))}
                    </ul>

                </div>
            ))}


        </div>

    )

}

export default Admin