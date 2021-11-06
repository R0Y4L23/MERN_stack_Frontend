/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect, useState
} from 'react'
import {
    useRouter
} from 'next/router';
import {toast} from "react-toastify";
import Avatar from  '@mui/material/Avatar';
var axios = require('axios');
var FormData = require('form-data');

const Main = () => {
    const router = useRouter();

    const [title,setTitle]=useState('');
    const [type,setType]=useState('');
    const [posts,setPosts]=useState([]);
    const [token,setToken]=useState('');

    useEffect(() => {
        console.log('Main')
        let s = sessionStorage.getItem('token')
        setToken(s)
        if (!s) {
            router.push('/')
        }
        else
        {
            getPosts(s)
        }
    }, [])


    const getPosts = async (token) => {
        var data = new FormData();
        var config = {
            method: 'get',
            url: 'https://mern-stack-backend-1.herokuapp.com/posts',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        axios(config)
            .then(function (response) 
            {
                console.log(JSON.stringify(response.data.Body[0]));
                setPosts(response.data.Body)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const post = () => {
        var data = new FormData();
        data.append('title', title);
        data.append('type', type);

        var config = {
            method: 'post',
            url: 'https://mern-stack-backend-1.herokuapp.com/post',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                toast.success("Posted Successfully");
                setType('select')
                setTitle('')
            })
            .catch(function (error) {
                let e = error.response.data.errors;
                e.forEach(function (error) {
                    toast.error(error.msg)
                });
            });

    }

    const logout = () => {
        sessionStorage.removeItem('token')
        router.push('/')
    }

    return ( 
        <div className="bg-yellow-200 min-h-screen p-6 md:px-28 px-12">
            <div className="flex align-middle">
                <div className="w-2/3">
                    <h1 className="md:text-4xl text-2xl"><span className="text-yellow-400">Simply</span> <span
                            className="text-blue-300">!!!</span> 😂</h1>
                </div>
                <div className="flex w-1/3 justify-between">
                    <h1 className="md:text-2xl text-lg cursor-pointer underline font-semibold">Posts</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer">Profile</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={logout}>Logout</h1>
                </div>
            </div>

            <div className="flex mt-20 justify-between">
                <div className="w-3/5">
                    <input type="text" className="w-full rounded-md p-3 text-lg" placeholder="Whats on your mind?"
                        value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
                    <div className="flex justify-between mt-8 mb-16">
                        <select className="w-1/2 rounded-md p-3 text-xl bg-yellow-400 text-white" value={type}
                            onChange={(e)=>{setType(e.target.value)}}>
                            <option value="select">Select</option>
                            <option value="joke">Joke</option>
                            <option value="quote">Quote</option>
                            <option value="fact">Fact</option>
                            <option value="thought">Thought</option>
                        </select>
                        <button className="bg-yellow-400 text-white font-semibold p-3 rounded-lg w-1/4"
                            onClick={post}>Post</button>
                    </div>
                    <div className="w-3/5">
                        {posts.length>0&&posts.map((post,index)=>{
                        return <div className="flex justify-between mt-8 mb-16" key={index}>
                            <div className="w-1/2">
                                <h1 className="text-2xl">{post.title}</h1>
                                <div className="flex">
                                    <h1 className="text-sm capitalize mt-2 mr-4">{post.type}</h1>
                                    <h1 className="text-sm capitalize mt-2 mr-4">{post.date}</h1>
                                    <h1 className="text-sm capitalize mt-2">{post.likes} Likes</h1>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <Avatar className="w-16 h-16 rounded-md" alt="Remy Sharp"
                                    src="https://source.unsplash.com/random/100x100" />
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">Like
                                </h1>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Comment</h1>
                            </div>
                        </div>
                        }
                        )}
                    </div>
                </div>
                <div className="w-1/4 text-center bg-yellow-400 rounded-lg">
                    <h1 className="text-xl my-5">People You Might Know</h1>
                    <div className="w-3/4 mx-auto">
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Remy Sharp" src="https://source.unsplash.com/random" />
                            <div>
                                <h1 className="text-lg">Remy Sharp</h1>
                                <h1 className="text-sm">@remy</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Kelly Dirk" src="https://source.unsplash.com/random" />
                            <div>
                                <h1 className="text-lg">Kelly Dirk</h1>
                                <h1 className="text-sm">@keld</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Daniel Hose" src="https://source.unsplash.com/random" />
                            <div>
                                <h1 className="text-lg">Daniel Hose</h1>
                                <h1 className="text-sm">@dany</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-xl my-5">Recent Posts</h1>
                </div>
            </div>
        </div>
    )
}

export default Main
