import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react"

function Login() {
    const [listOfPosts, setListOfPosts] = useState([]);
    useEffect(()=> {
        axios.get("http://localhost:3001/posts").then((response) => {
            setListOfPosts(response.data)
        })
    }, []);

    return (
        <div>
            {listOfPosts.map((value,key)=> {
                return (
                    <div className="post">
                        <div className="title"> {value.title}</div>
                        <div className="body"> {value.text}</div>
                    </div>
                )
            })}
      </div>
      );
}

export default Login