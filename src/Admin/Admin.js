import React, { useEffect, useState } from 'react';
import {
    Route,
    Link,
    useParams
} from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios';
import TriviaQuestion from '../TriviaQuestion/TriviaQuestion'



const Admin = () => {

    const { name } = useParams();

    const { profile_image } = useParams();

    const [members, setMembers] = useState([]);

    const [group, setGroup] = useState({})

    // const [trivia, setTrivia] = useState([]);

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

                q.question = q.question
                q.answers = shuffle([...q.incorrect_answers, q.correct_answer])
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
        socket.emit('startTrivia', { state: "started", time_per_question : 10 })

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
            "is_admin": true,
            "profile_image": profile_image
        }
        socket.connect();


        socket.on(`membersConnected`, (members) => {
            console.log(members)

            const members_list = Object.keys(members).map((key) => {
                // return <p>{members[key].username}</p>
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
            // setTrivia(game.trivia ?? [])
            console.log("Empezó")
        })

        setGroup({
            group_id: group_id
        })

    }, [])

    return (
        <div className="relative w-full max-w-md p-4 bg-white rounded-3xl">

            <h2 className="text-medium text-xl">Grupo</h2>
            <div class="relative text-gray-600 my-2 mb-4">
                <span type="text" name="group_id" placeholder="Sala" class="w-52 bg-gray-100 h-20 px-5 rounded-lg text-5xl focus:outline-none text-center" >{group.group_id}</span>
            </div>

            <form onSubmit={handleTriviaApi}>
                <div className="flex flex-col justify-center items-center">
                    {/* <label for="amount" className="text-sm">Cantidad de preguntas</label> */}
                    <input type="number" name="amount" id="amount" min="1" max="50" value="10" className="mt-2 bg-gray-50 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none w-3/4" />
                </div>

                <div className="flex flex-col justify-center items-center">
                    {/* <label for="category" className="text-sm">Selecciona una categoria </label> */}
                    <select name="category" className="mt-2 bg-gray-50 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none w-3/4">
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
                </div>

                <div className="flex flex-col justify-center items-center">
                    {/* <label for="difficulty" className="text-sm">Selecciona la dificultad </label> */}
                    <select name="difficulty" className="mt-2 bg-gray-50 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none w-3/4">
                        <option value="">Cualquier dificultad</option>
                        <option value="easy">Facil</option>
                        <option value="medium">Medio</option>
                        <option value="hard">Dificil</option>
                    </select>
                </div>

                <div className="flex flex-col justify-center items-center">

                    {/* <label for="type" className="text-sm" >Selecciona el tipo </label> */}
                    <select name="type" className="mt-2 bg-gray-50 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none w-3/4">
                        <option value="">Cualquier tipo</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="boolean">Verdadero / Falso</option>
                    </select>
                </div>


                <button class="mt-2 block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                    Generate trivia API
                </button>

                {/* <button type="submit">Generate API URL</button> */}
            </form>
            <button type="button" onClick={startTrivia} class="mt-2 block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                Start
                </button>
            <br />

            <span>Conectados</span>
            <br />
            {members}
{/* 
            {trivia.map((t) => (
                <TriviaQuestion trivia={t}></TriviaQuestion>
            ))} */}




        </div>

    )

}

export default Admin