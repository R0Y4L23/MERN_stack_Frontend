import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router';
import pic from '../Assets/regscreen.jpg'
import { toast } from "react-toastify"
import CircularProgress from '@mui/material/CircularProgress';
var axios = require('axios');
var FormData = require('form-data');

const Register = () => {

    const router = useRouter();
    const [willBeRegister, setWillBeRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirm, setConfirm] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');
    const [accept, setAccept] = useState(false);
    const [loading, setLoading] = useState(false);


    const register = () => {
        setLoading(true);
        var data = new FormData();
        data.append('username', username);
        data.append('name', name);
        data.append('age', age);
        data.append('email', email);
        data.append('password', password);
        data.append('bio', bio);

        var config = {
            method: 'post',
            url: 'https://simply-backend.vercel.app/register',
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                if (response.data.Message === "Email already exists" || response.data.Message === "Username already in Use") {
                    toast.error(response.data.Message);
                } else {
                    toast.success("Registered Successfully");
                    sessionStorage.setItem('token', response.data.Token);
                    router.push('/main');
                }
                setLoading(false);
            })
            .catch(function (error) {
                let e = error.response.data.errors;
                e.forEach(function (error) {
                    toast.error(error.msg)
                });
                setLoading(false);
            });
    }

    const login = () => {
        setLoading(true);
        var data = new FormData();
        data.append('email', email);
        data.append('password', password);

        var config = {
            method: 'post',
            url: 'https://simply-backend.vercel.app/login',
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data.Message === "Invalid Email" || response.data.Message === "Wrong Password") {
                    toast.error(response.data.Message);
                } else {
                    toast.success("Logged In Successfully");
                    sessionStorage.setItem('token', response.data.Token);
                    router.push('/main');
                }
                setLoading(false);
            })
            .catch(function (error) {
                let e = error.response.data.errors;
                e.forEach(function (error) {
                    toast.error(error.msg)
                });
                setLoading(false);
            });

    }

    return (
        <div className={`flex bg-yellow-200 min-h-screen`}>
            <div className="lg:w-1/3 md:w-1/2 md:block hidden my-auto px-5">
                <Image src={pic} alt="Register Screen" />
            </div>
            <div className="lg:w-2/3 md:w-1/2 w-screen bg-yellow-100">
                <h1 className="text-right m-10 md:text-4xl text-2xl"><span className="text-yellow-400">Simply</span> <span
                    className="text-blue-300">!!!</span> 😂</h1>
                <p className={`text-center font-semibold md:text-3xl text-xl ${willBeRegister ? "mt-20" : "mt-40"}`}>One Destination
                    for all your fun.</p>
                <p className="text-center md:text-2xl text-lg mt-5">Access any types of jokes , quotes , memes , facts and many
                    more.</p>
                <p className="text-center md:text-2xl text-lg mt-5 cursor-pointer"><span
                    className={`px-4 py-1 rounded-2xl ${!willBeRegister ? "font-semibold bg-yellow-200" : ""} mr-16`}
                    onClick={() => { setWillBeRegister(false) }}>Login</span> <span
                        className={`px-4 py-1 rounded-2xl ${willBeRegister ? "font-semibold bg-yellow-200" : ""}`}
                        onClick={() => { setWillBeRegister(true) }}>Register</span></p>
                <form action="" className="md:w-1/2 w-3/4 mx-auto mb-16 mt-10">
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Username</label>
                        <input type="text" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={username}
                            onChange={(e) => { setUsername(e.target.value) }} />
                    </div>}
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Name</label>
                        <input type="text" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={name}
                            onChange={(e) => { setName(e.target.value) }} />
                    </div>}
                    <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Email</label>
                        <input type="email" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={email}
                            onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Password</label>
                        <input type="password" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={password}
                            onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Confirm Password</label>
                        <input type="password" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={confirm}
                            onChange={(e) => { setConfirm(e.target.value) }} />
                    </div>}
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Age</label>
                        <input type="text" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={age}
                            onChange={(e) => { setAge(e.target.value) }} />
                    </div>}
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="text-xl font-semibold">Bio</label>
                        <input type="text" className="w-full mt-2 p-2 border rounded-lg border-gray-400" value={bio}
                            onChange={(e) => { setBio(e.target.value) }} />
                    </div>}
                    {willBeRegister && <div className="flex flex-col mt-4">
                        <label className="md:text-xl text-base font-semibold">
                            <input type="checkbox" className="mr-2" defaultChecked={accept}
                                onChange={() => { setAccept(!accept) }} />
                            I agree to the <span className="text-blue-300">Terms and Conditions</span>
                        </label>
                    </div>}
                    <div className="flex flex-col mt-8">
                        <button className="w-full bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                if (willBeRegister) {
                                    register();
                                } else {
                                    login();
                                }
                            }}
                            disabled={willBeRegister ? ((!accept) || !(password == confirm) || (password == "")) : (false)}>{loading ? <CircularProgress /> : (willBeRegister ? "Register" : "Login")}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
