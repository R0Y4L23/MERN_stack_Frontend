/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect, useState
} from 'react'
import {
    useRouter
} from 'next/router';
import {toast} from "react-toastify";
import Avatar from  '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
var axios = require('axios');
var FormData = require('form-data');

const Main = () => {
    const router = useRouter();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    const getDate = (m) => {
        return m.slice(8,10) + " " + month[Number(m.slice(5,7)) - 1] + " " + m.slice(0,4);
    }
        

    const [title,setTitle]=useState('');
    const [type,setType]=useState('');
    const [posts,setPosts]=useState([]);
    const [token,setToken]=useState('');
    const [loading,setLoading]=useState(false);

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
                //console.log(JSON.stringify(response.data.Body[0]));
                setPosts(response.data.Body)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const post = () => {
        setLoading(true)
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
                getPosts(token)
                setLoading(false)
            })
            .catch(function (error) {
                let e = error.response.data.errors;
                e.forEach(function (error) {
                    toast.error(error.msg)
                });
                setLoading(false)
            });

    }

    const logout = () => {
        sessionStorage.removeItem('token')
        router.push('/')
    }

    return ( 
        <div className="bg-yellow-200 min-h-screen p-6 lg:px-28 sm:px-12 px-3">
            <div className="sm:flex align-middle">
                <div className="sm:w-2/3 w-full">
                    <h1 className="md:text-4xl sm:text-2xl text-4xl sm:text-left text-center"><span className="text-yellow-400">Simply</span> <span
                            className="text-blue-300">!!!</span> 😂</h1>
                </div>
                <div className="flex sm:w-1/3 w-full sm:mt-0 mt-8 justify-between">
                    <h1 className="md:text-2xl text-lg cursor-pointer underline font-semibold">Posts</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer">Profile</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={logout}>Logout</h1>
                </div>
            </div>

            <div className="flex mt-20 justify-between">
                <div className="xl:w-3/5 md:w-1/2 w-full">
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
                            onClick={post}>{loading?<CircularProgress/>:"Post"}</button>
                    </div>
                    <div className="lg:w-4/5 w-full">
                        {posts.length>0&&posts.map((post,index)=>{
                        return <div className="flex justify-between mt-8 mb-16" key={index}>
                            <div className="sm:w-3/5 w-5/7">
                                <h1 className="text-2xl">{post.title}</h1>
                                <div className="flex">
                                    <h1 className="text-sm capitalize mt-2 mr-4">{post.type}</h1>
                                    <h1 className="text-sm capitalize mt-2 mr-4">{getDate(post.date)}</h1>
                                    <h1 className="text-sm capitalize mt-2">{post.likes} Likes</h1>
                                </div>
                                <h1 className="text-sm mt-2 mr-4">- {post.postedBy}</h1>
                            </div>
                            <div className='xl:w-1/5 sm:w-2/5 w-2/7 sm:mt-0 mt-5'>
                                <h1 className="sm:text-lg text-xs bg-green-400 text-white px-5 py-2 rounded-md text-center cursor-pointer mb-3">Like
                                </h1>
                                <h1 className="sm:text-lg text-xs bg-green-400 text-white px-5 py-2 rounded-md text-center cursor-pointer">
                                    Comment</h1>
                            </div>
                        </div>
                        }
                        )}
                    </div>
                </div>
                <div className="xl:w-1/4 w-2/5 text-center bg-yellow-400 rounded-lg h-full md:block hidden">
                    <h1 className="text-xl my-5">People You Might Know</h1>
                    <div className="w-3/4 mx-auto">
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Remy Sharp" src="https://source.unsplash.com/1600x900/?celebrity" />
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
                            <Avatar className="w-16 h-16" alt="Kelly Dirk" src="https://source.unsplash.com/1600x900/?actor" />
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
                            <Avatar className="w-16 h-16" alt="Daniel Hose" src="https://source.unsplash.com/1600x900/?scientist" />
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
                    <h1 className="text-xl mb-5 mt-16">Top Creators</h1>
                    <div className="w-3/4 mx-auto mb-5">
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Remy Sharp" src="https://source.unsplash.com/1600x900/?author" />
                            <div>
                                <h1 className="text-lg">Sherry Dillons</h1>
                                <h1 className="text-sm">@shed</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Candice Rol" src="https://source.unsplash.com/1600x900/?director" />
                            <div>
                                <h1 className="text-lg">Candice Rol</h1>
                                <h1 className="text-sm">@carol</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Joseph Beth" src="https://source.unsplash.com/1600x900/?gamer" />
                            <div>
                                <h1 className="text-lg">Joseph Beth</h1>
                                <h1 className="text-sm">@Joe</h1>
                            </div>
                            <div>
                                <h1 className="text-lg bg-green-400 text-white px-5 py-2 rounded-md cursor-pointer">
                                    Follow</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
