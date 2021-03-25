import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { io } from "socket.io-client";


const Guest = () => {

    const { group_id } = useParams();
    const { username } = useParams();

    const [members, setMembers] = useState([]);

    const history = useHistory();

    const socket = io("http://localhost:8080", { autoConnect: false });

    useEffect(() => {
        console.log("useeffect")
        socket.auth = {
            "username": username,
            "group_id": group_id
        }
        socket.connect();

        // socket.emit("membersList")

        socket.on(`membersConnected${group_id}`, (members) => {
            console.log(members)

            const admin = Object.keys(members).filter((key) => members[key].is_admin)

            if(admin.length == 0) {
                socket.disconnect()
                socket.removeAllListeners(`membersConnected${group_id}`);
                return history.push(`/`)
            }
            

            const members_list = Object.keys(members).map((key) => {

                return <p>{members[key].username}</p>
                
            }) 
            setMembers(members_list)
        })

    }, [])

    return (
        <div>

            <h1>Guest</h1>

            <h1>Nombre {username}</h1>
            <h2>Grupo {group_id}</h2>

            {members}

        </div>

    )

}

export default Guest