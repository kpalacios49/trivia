import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../index.css';
import { AiOutlinePlus } from 'react-icons/ai'

const Home = () => {

    const history = useHistory();

    const [profileImage, setProfileImage] = useState('')

    const createGroup = (event) => {
        const username = document.querySelector('form').username.value;
        const profile_image = encodeURIComponent(document.querySelector('form').profile_image.value);

        if (username) {
            history.push(`admin/${username}/${profile_image}`);
        }
    }

    const joinGroup = (event) => {
        const username = document.querySelector('form').username.value;
        const group_id = document.querySelector('form').group_id.value;
        const profile_image = encodeURIComponent(document.querySelector('form').profile_image.value);


        if (username && group_id) {
            history.push(`join/${group_id}/${username}/${profile_image}`);
        }
    }

    const selectProfileImage = () => {
        document.getElementById("profile-images").classList.toggle('hidden')
    }
    const profileImageSelected = (event) => {
        event.stopPropagation()
        const imageSelected = event.target.getAttribute('data-profile-image')
        localStorage.setItem('profileImage', imageSelected)
        setProfileImage(imageSelected)

        document.getElementById("profile-images").classList.toggle('hidden')
    }

    useEffect(() => {
        let localImageProfile = localStorage.getItem('profileImage')
        if (!localImageProfile) {
            localStorage.setItem('profileImage', 'https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
        }
        localImageProfile = localStorage.getItem('profileImage')
        setProfileImage(localImageProfile)
    }, [])

    return (
        <>
            <div id="profile-images" className={`hidden absolute top-0 right-0 z-10 bg-black bg-opacity-50 w-full h-full flex items-center justify-center`}
                onClick={selectProfileImage}>
                <button type="button" className="w-16 h-16 rounded-full mx-2 bg-profile-1 bg-cover transform hover:scale-110" onClick={profileImageSelected}
                    data-profile-image='https://images.pexels.com/photos/1617366/pexels-photo-1617366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'></button>
                <button type="button" className="w-16 h-16 rounded-full mx-2 bg-profile-2 bg-cover transform hover:scale-110" onClick={profileImageSelected}
                    data-profile-image='https://images.pexels.com/photos/4751420/pexels-photo-4751420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'></button>
                <button type="button" className="w-16 h-16 rounded-full mx-2 bg-profile-3 bg-cover transform hover:scale-110" onClick={profileImageSelected}
                    data-profile-image='https://images.pexels.com/photos/105809/pexels-photo-105809.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'></button>
                <button type="button" className="w-16 h-16 rounded-full mx-2 bg-profile-4 bg-cover transform hover:scale-110" onClick={profileImageSelected}
                    data-profile-image='https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'></button>
                <button type="button" className="w-16 h-16 rounded-full mx-2 bg-profile-5 bg-cover transform hover:scale-110" onClick={profileImageSelected}
                    data-profile-image='https://images.pexels.com/photos/7203687/pexels-photo-7203687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'></button>
            </div>

            <div className="relative flex flex-col items-center w-full max-w-xs p-4 bg-white rounded-3xl md:flex-row">
                <button type="button" onClick={createGroup} className="absolute right-1 top-1 md:-right-5 md:-top-5 h-11 w-11 rounded-full bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 flex items-center justify-center">
                    <AiOutlinePlus size={22} color={'white'} />
                </button>
                <button type="button" className="-mt-28 md:-my-16 md:-ml-32 rounded-full overflow-hidden transform hover:scale-105 duration-200 " onClick={selectProfileImage}>
                    <img
                        className="w-48 h-48"
                        src={profileImage}
                        alt="Avatar image"
                    />
                </button>
                <div className="flex flex-col space-y-4 md:pl-3">
                    <div className=" flex flex-col items-center justify-center md:items-start md:pr-4">

                        <form className="mt-4 ">
                            <div class="relative text-gray-600">
                                <input type="text" name="username" placeholder="Alias" class="bg-gray-50 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none" />
                                {/* <button type="submit" class="absolute right-0 top-0 mt-3 mr-4">
                                    ?
                                </button> */}
                            </div>
                            <div class="relative text-gray-600 my-2 mb-4">
                                <input type="text" name="group_id" placeholder="Sala" class="w-52 bg-gray-50 h-20 px-5 rounded-lg text-4xl focus:outline-none text-center" />
                            </div>
                            <input type="hidden" name="profile_image" value={profileImage}></input>
                            <button onClick={joinGroup}
                                class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                                Unirse
                                </button>

                        </form>
                    </div>
                </div>
            </div>
        </>

    )

}

export default Home