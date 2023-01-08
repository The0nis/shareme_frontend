import React, { useEffect } from 'react';
import { gapi } from "gapi-script"
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { render } from 'react-dom';

import { client } from '../client';

const Login = () => {
        // i had to do npm install gapi-script and include the below for the page to redirect to the home page    const clientId = '981891596220-bb1ibms8lfpo7sjk1dlm17amiovdjqac.apps.googleusercontent.com';
    const clientId = '981891596220-bb1ibms8lfpo7sjk1dlm17amiovdjqac.apps.googleusercontent.com';
    useEffect(() => {
        const initClient = () => {
          gapi.client.init({
            clientId: clientId,
            scope: "",
          });
        };
        gapi.load("client:auth2", initClient);
      });
    
    const navigate = useNavigate();
    const responseGoogle = (response) => {
        // console.log(response);
        localStorage.setItem('user', JSON.stringify(response.profileObj));

        //destructuring the array
        const { name, googleId, imageUrl} = response.profileObj;

        //doc for the sanity schema
        const doc ={
            _id: googleId,
            _type: 'user', // specifying it to the user schema
            userName: name,
            image: imageUrl,
        }
        //to create doc if not exist and navigate back to home using the useNavigate hook
        client.createIfNotExists(doc).then(() => {
            navigate('/', { replace: true })
        })

    }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
            <video
                src={shareVideo}
                type='video/mp4'
                loop
                controls={false}
                muted
                autoPlay
                className='w-full h-full object-cover'
            />
            <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-black-overlay'>
                <div className='p-5'>
                    <img src={logo} width='130px' alt='moniSocial Logo' />
                </div>

                <div className='shadow-2xl'>
                    <GoogleLogin
                    //to get the client id, go to https://console.cloud.google.com/getting-started?hl=en-AU, 
                    //Create new project
                    //go to create credientials, then oAuth client follow the process and copy the client id and paste in the .env file before coming here
                        clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                        render={(renderProps) => (
                            <button
                            type='button'
                            className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            >
                                <FcGoogle className='mr-4'/> Sign in with Google
                            </button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy='single_host_origin'
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login