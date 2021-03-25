import React, { useEffect, useState } from 'react';
import {
    Route,
    Link,
    useParams
} from "react-router-dom";
import { io } from "socket.io-client";



const Admin = () => {

    const { name } = useParams();

    const [members, setMembers] = useState([]);

    const [group, setGroup] = useState({})

    const socket = io("http://localhost:8080", { autoConnect: false });


    function makeID(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result.toUpperCase();
    }


    useEffect(() => {

        const group_id = makeID(6)

        socket.auth = {
            "username": name,
            "group_id": group_id,
            "is_admin": true
        }
        socket.connect();

        socket.on(`membersConnected${group_id}`, (members) => {
            console.log(members)

            const members_list = Object.keys(members).map((key) => {
                return <p>{members[key].username}</p>
            }) 
            setMembers(members_list)
        })

        setGroup({
            group_id: group_id
        })
    }, [])

    return (
        <div>

            <h1>Admin {name}</h1>
            <h2>Grupo {group.group_id}</h2>

            <span>Conectados</span>
            <br />
            {members}


        </div>

    )

}

export default Admin