/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import IMG from "../../assets/img/party-popper.png"
import axios from "axios";
import {Table} from "react-bootstrap";


export default function (props) {
    const navigate = useNavigate();
    const [url,setUrl] = useState(null);
    const [title,setTitle] = useState('');
    const [msg,setMsg] = useState('');


    useEffect (() => {
        const urlParams = new URLSearchParams(window.location.search);
        let uid = urlParams.get('uid')
        if(uid) {
            axios({
                url: `http://localhost:8080/api/v1/player/account/verify?token=${uid}`,
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            }).then((response) => {
                if (response?.data?.success) {
                        setTitle('Verification Completed')
                        setMsg(response.data.message);
                } else {
                        setTitle('Failed!')
                        setMsg(response.data.message);
                }
            });
        }
    },[])










    return (
            <div className="quiz-main d-flex justify-content-center align-items-center">
              <div className={'verify-box w-50 h-auto'}>
                  <h1 className={'text-center mt-3'} style={{color:'black'}}>DONE</h1>
                  <div className={'w-100 d-flex justify-content-center my-3'}>
                      {title === 'Verification Completed' && <img style={{width:'80px',height:'80px'}} src={IMG}/>}
                      <img style={{width:'80px',height:'80px'}} src={IMG}/>
                  </div>

                  <div className={'w-100 pb-3 mb-5 d-flex justify-content-center'}>
                      <div className={'gradient-box w-75 p-3'}>
                          <h4 style={{color:'black'}} className={'text-center'}>{title}</h4>
                          <h5 style={{color:'black'}} className={'text-center'}>{msg}</h5>
                      </div>
                  </div>

                  <div className={'w-100 d-flex py-3 justify-content-center'}>
                      <button onClick={()=> navigate('/auth')} className={'signin-btn'}>Signin</button>
                  </div>

              </div>
            </div>

    )
}
