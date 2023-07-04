/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
    useRouter
} from 'next/router';
import { toast } from "react-toastify";
var axios = require('axios');

const Profile = () => {


    const router = useRouter();
    const [token, setToken] = useState('');
    const [profile, setProfile] = useState();


    useEffect(() => {
        console.log('Profile')
        let s = sessionStorage.getItem('token')
        setToken(s)
        if (!s) {
            router.push('/')
        }
        else {
            getProfile(s)
        }
    }, [])


    const getProfile = (token) => {
        var config = {
            method: 'get',
            url: 'https://simply-backend.vercel.app/user',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        axios(config)
            .then(function (response) {
                //console.log(JSON.stringify(response.data));
                setProfile(response.data.Body)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const logout = () => {
        sessionStorage.removeItem('token')
        toast.success("Logged Out Successfully");
        router.push('/')
    }

    return (
        <div className="bg-yellow-200 min-h-screen p-6 lg:px-28 sm:px-12 px-3">
            <div className="sm:flex align-middle">
                <div className="sm:w-2/3 w-full">
                    <h1 className="md:text-4xl sm:text-2xl text-4xl sm:text-left text-center"><span
                        className="text-yellow-400">Simply</span> <span className="text-blue-300">!!!</span> 😂</h1>
                </div>
                <div className="flex sm:w-1/3 w-full sm:mt-0 mt-8 justify-between">
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={() => { router.push("/main") }}>Posts</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer bg-yellow-400 px-4 py-1 font-semibold rounded-md">Profile</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={logout}>Logout</h1>
                </div>
            </div>
            <h1 className="text-4xl mb-5 mt-20">Profile Info</h1>
            <div className="flex flex-col sm:flex-row">
                <div className="flex flex-col lg:w-1/4 md:w-1/2 sm:w-3/4 w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex w-full justify-between">
                            <h1 className="text-lg">Userame : </h1>
                            <h1 className="text-xl"> {profile ? profile.username : ''}</h1>
                        </div>
                        <div className="flex w-full justify-between">
                            <h1 className="text-lg">Email : </h1>
                            <h1 className="text-xl"> {profile ? profile.email : ''}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex w-full justify-between">
                            <h1 className="text-lg">Name : </h1>
                            <h1 className="text-xl"> {profile ? profile.name : ''}</h1>
                        </div>
                        <div className="flex w-full justify-between">
                            <h1 className="text-lg">Age : </h1>
                            <h1 className="text-xl"> {profile ? profile.age : ''}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex w-full justify-between">
                            <h1 className="text-lg">Bio : </h1>
                            <h1 className="text-xl"> {profile ? profile.bio : ''}</h1>
                        </div>
                        <div className="flex flex-col w-full mt-5">
                            <button className="w-1/2 bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg">Edit Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
