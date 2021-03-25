import React from 'react';
import { useHistory } from "react-router-dom";

const Home = () => {
    const history = useHistory();


    const createGroup = (event) => {
        const username = event.target.parentElement.username.value;
        if (username) {
            history.push(`admin/${username}`);
        }
    }

    const joinGroup = (event) => {
        const username = event.target.parentElement.username.value;
        const group_id = event.target.parentElement.group_id.value;

        if (username && group_id) {
            history.push(`join/${group_id}/${username}`);
        }
    }

    return (
        <div>
            <form>

                <h1>Home</h1>
                <input name="username" placeholder="Alias" />
                <br />

                <button type="button" onClick={createGroup}>Crear</button>
                <br />

                <input name="group_id" placeholder="Nombre Grupo" />
                <button  type="button" onClick={joinGroup}>uNIRSE</button>
            </form>

        </div>

    )

}

export default Home