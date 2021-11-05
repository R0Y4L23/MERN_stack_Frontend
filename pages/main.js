/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect
} from 'react'
import {
    useRouter
} from 'next/router';

const Main = () => {
    const router = useRouter();
    useEffect(() => {
        console.log('Main')
        let s = sessionStorage.getItem('token')
        if (!s) {
            router.push('/')
        }
    }, [])

    return ( 
        <div>Main Page is Under Development</div>
    )
}

export default Main
