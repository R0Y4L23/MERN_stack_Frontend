/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect, useState
} from 'react'
import {
    useRouter
} from 'next/router';
import { toast } from "react-toastify";
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
var axios = require('axios');
var FormData = require('form-data');

const Main = () => {
    const router = useRouter();
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const getDate = (m) => {
        return m.slice(8, 10) + " " + month[Number(m.slice(5, 7)) - 1];
    }

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [posts, setPosts] = useState([]);
    const [postsLikedByUser, setPostsLikedByUser] = useState([])
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const [getPostsLoading, setGetPostsLoading] = useState(false)
    const [getLikesLoading, setGetLikesLoading] = useState(false)

    useEffect(() => {
        console.log('Main')
        let s = sessionStorage.getItem('token')
        setToken(s)
        if (!s) {
            router.push('/')
        }
        else {
            getPosts(s)
            getPostsLikedByUser(s)
        }
    }, [])


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
                setGetPostsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setGetPostsLoading(false)
            });
    }

    const getPostsLikedByUser = async (token) => {
        setGetLikesLoading(true)
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://simply-backend.vercel.app/like',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => {
                setPostsLikedByUser(response.data.Body.map((item) => { return item.ofPost }))
                setGetLikesLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setGetLikesLoading(false)
            });
    }

    const post = () => {
        setLoading(true)
        var data = new FormData();
        data.append('title', title);
        data.append('type', type);

        var config = {
            method: 'post',
            url: 'https://simply-backend.vercel.app/post',
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
                setPostsLikedByUser(token)
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

    const likeHandler = (id) => {
        let data = JSON.stringify({
            "ofPost": id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://simply-backend.vercel.app/like',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                toast.success("Success");
                getPosts(token)
                getPostsLikedByUser(token)
            })
            .catch((error) => {
                //console.log(error);
                toast.error("Some error occured");
            });
    }

    const showComments = async (id) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://simply-backend.vercel.app/comment/' + id,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
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
                    <h1 className="md:text-2xl text-lg cursor-pointer bg-yellow-400 px-4 py-1 font-semibold rounded-md">Posts</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={() => { router.push("/profile") }}>Profile</h1>
                    <h1 className="md:text-2xl text-lg cursor-pointer" onClick={logout}>Logout</h1>
                </div>
            </div>

            <div className="flex mt-20 justify-between">
                <div className="xl:w-3/5 md:w-1/2 w-full">
                    <input type="text" className="w-full rounded-md p-3 text-lg" placeholder="Whats on your mind?"
                        value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    <div className="flex justify-between mt-8 mb-16">
                        <select className="w-1/2 rounded-md p-3 text-xl bg-yellow-400 text-white" value={type}
                            onChange={(e) => { setType(e.target.value) }}>
                            <option value="select">Select</option>
                            <option value="joke">Joke</option>
                            <option value="quote">Quote</option>
                            <option value="fact">Fact</option>
                            <option value="thought">Thought</option>
                        </select>
                        <button className="bg-yellow-400 text-white font-semibold p-3 rounded-lg w-1/4"
                            onClick={post}>{loading ?
                                <CircularProgress /> : "Post"}</button>
                    </div>
                    <div className="lg:w-4/5 w-full">
                        {(!getPostsLoading && !getLikesLoading && posts.length > 0) && posts.map((post, index) => {
                            return <div className="flex justify-between mt-8 mb-16" key={index}>
                                <div className="sm:w-3/5 w-5/7">
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
                                    <div className="flex mt-3 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            className="bi bi-arrow-return-right mt-2 mr-2" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z" />
                                        </svg>
                                        <h1 onClick={() => { showComments(post._id) }} className="text-md capitalize mt-1 font-mono">Read All Comments</h1>
                                    </div>
                                </div>
                                <div className='xl:w-1/5 sm:w-2/5 w-2/7 sm:mt-0 mt-5'>
                                    <h1
                                        onClick={() => { likeHandler(post._id) }}
                                        className="sm:text-lg text-xs bg-green-400 text-white px-5 py-2 rounded-md text-center cursor-pointer mb-3">
                                        {postsLikedByUser.includes(post._id) ? "Unlike" : "Like"}
                                    </h1>
                                    <h1
                                        className="sm:text-lg text-xs bg-green-400 text-white px-5 py-2 rounded-md text-center cursor-pointer">
                                        Comment</h1>
                                </div>
                            </div>
                        }
                        )}
                        {(!getPostsLoading && !getLikesLoading && posts.length === 0) && <div className="flex justify-center">
                            <h1 className="text-lg text-center">No Posts Yet</h1>
                        </div>}
                        {(getPostsLoading || getLikesLoading) && <CircularProgress />}
                    </div>
                </div>
                <div className="xl:w-1/4 w-2/5 text-center bg-yellow-400 rounded-lg h-full md:block hidden">
                    <h1 className="text-xl my-5">New Creators</h1>
                    <div className="w-3/4 mx-auto">
                        <div className="flex justify-between items-center mt-3">
                            <Avatar className="w-16 h-16" alt="Remy Sharp"
                                src="https://source.unsplash.com/1600x900/?celebrity" />
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
                            <Avatar className="w-16 h-16" alt="Kelly Dirk"
                                src="https://source.unsplash.com/1600x900/?actor" />
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
                            <Avatar className="w-16 h-16" alt="Daniel Hose"
                                src="https://source.unsplash.com/1600x900/?scientist" />
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
                            <Avatar className="w-16 h-16" alt="Remy Sharp"
                                src="https://source.unsplash.com/1600x900/?author" />
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
                            <Avatar className="w-16 h-16" alt="Candice Rol"
                                src="https://source.unsplash.com/1600x900/?director" />
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
                            <Avatar className="w-16 h-16" alt="Joseph Beth"
                                src="https://source.unsplash.com/1600x900/?gamer" />
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
