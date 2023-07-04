/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
    useRouter
} from 'next/router';
import { toast } from "react-toastify";
var axios = require('axios');

import Image from 'next/image';

import av1 from "../Assets/avatars/av1.png"
import av2 from "../Assets/avatars/av2.png"
import av3 from "../Assets/avatars/av3.png"
import av4 from "../Assets/avatars/av4.png"
import av5 from "../Assets/avatars/av5.png"
import { CircularProgress } from '@mui/material';

const avatars = [av1, av2, av3, av4, av5]

const Profile = () => {

    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getDate = (m) => {
        return m.slice(8, 10) + " " + month[Number(m.slice(5, 7)) - 1];
    }


    const router = useRouter();
    const [token, setToken] = useState('');
    const [profile, setProfile] = useState();
    const [posts, setPosts] = useState([])

    const [getPostsLoading, setGetPostsLoading] = useState(false)
    const [getProfileLoading, setGetProfileloading] = useState(false)

    const [showEditProfile, setShowEditProfile] = useState(false)

    const [name, setName] = useState("")
    const [age, setAge] = useState(0)
    const [bio, setBio] = useState("")


    useEffect(() => {
        console.log('Profile')
        let s = sessionStorage.getItem('token')
        setToken(s)
        if (!s) {
            router.push('/')
        }
        else {
            getProfile(s)
            getPosts(s)
        }
    }, [])


    const getProfile = (token) => {
        setGetProfileloading(true)
        var config = {
            method: 'get',
            url: 'https://simply-backend.vercel.app/user',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        axios(config)
            .then(function (response) {
                setProfile(response.data.Body)
                setGetProfileloading(false)
            })
            .catch(function (error) {
                console.log(error);
                setGetProfileloading(false)
            });
    }

    const getPosts = async (token) => {
        var data = new FormData();
        setGetPostsLoading(true)
        var config = {
            method: 'get',
            url: 'https://simply-backend.vercel.app/posts',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                let a = response.data.Body.reverse()
                setPosts(a)
                console.log(a)
                setGetPostsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setGetPostsLoading(false)
            });
    }

    const updateProfile = () => {
        let data = JSON.stringify({
            "name": name,
            "age": age,
            "bio": bio
        });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'https://simply-backend.vercel.app/user',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                getProfile(token)
                setName("")
                setAge(0)
                setBio("")
                setShowEditProfile(false)
                toast.success("Updated Successfully")
            })
            .catch((error) => {
                //console.log(error);
                setShowEditProfile(false)
                toast.error("Some Error Occured")
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
            <h1 className="text-4xl mb-16 mt-20">Profile Info :</h1>
            {(!getPostsLoading && !getProfileLoading) && <div className="flex flex-col md:flex-row">
                <div className="flex flex-col lg:w-1/4 md:w-1/2 w-full">
                    <div className=' h-40 w-40 self-center mb-10'>
                        <Image src={avatars[Math.floor(Math.random() * 4)]} alt='avatar' />
                    </div>
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
                        <div className="flex flex-col w-full mt-10">
                            {showEditProfile ? <>
                                <input className='my-2 rounded-md py-2 pl-2' placeholder='Enter New Username' value={name} onChange={(e) => { setName(e.target.value) }} />
                                <input className='my-2 rounded-md py-2 pl-2' placeholder='Enter New Age' value={age} onChange={(e) => { setAge(e.target.value) }} />
                                <input className='my-2 rounded-md py-2 pl-2' placeholder='Enter New Bio' value={bio} onChange={(e) => { setBio(e.target.value) }} />
                                <button className="w-1/2 bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg mt-10" onClick={updateProfile}>Update</button>
                            </> : <button className="w-1/2 bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" onClick={() => { setShowEditProfile(true) }}>Edit Profile</button>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-3/4 md:w-1/2 w-full">
                    <h1 className="text-2xl md:mb-16 mb-4 md:mt-0 mt-10 text-center">My Posts :</h1>
                    {posts.map((post, index) => {
                        return (<div className="flex justify-between mt-5 mb-5 lg:pl-60 md:pl-24 pl-10" key={index}>
                            <div className="w-full">
                                <h1 className="text-2xl italic">{'"' + post.title + '"'}</h1>
                                <div className="flex">
                                    <h1 className="text-sm capitalize mt-2 mr-4 font-serif font-semibold cursor-pointer">{post.type}
                                    </h1>
                                    <div className="flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" className="bi bi-calendar mt-2 mr-2"
                                            viewBox="0 0 16 16">
                                            <path
                                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                        </svg>
                                        <h1 className="text-sm capitalize mt-2 mr-4">{getDate(post.date)}</h1>
                                    </div>
                                    <h1 className="text-md capitalize mt-2 font-mono">{post.likes} Likes</h1>
                                </div>
                                <h1 className="text-sm mt-2 mr-4 cursor-pointer">- {post.postedBy}</h1>
                            </div>
                        </div>)
                    })}

                </div>
            </div>}
            {(getPostsLoading || getProfileLoading) && <CircularProgress />}
        </div>
    )
}

export default Profile
