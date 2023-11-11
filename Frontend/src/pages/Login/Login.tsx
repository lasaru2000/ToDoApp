import React, { useState,useEffect } from 'react';
import "./login.css";
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import todo from "../../assets/3961975-removebg.png"
import { Input, Select, Button,message } from 'antd';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

interface loginData{
  id: string;
  name: string;
  password: string;

}


function Login() {

  const [both, setBoth] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

 // hide show both login signup parts and show login when user clicks login
  const handleLeftClick = () => {
    setBoth(false);
    setIsLogin(true)
  }
   // hide show both login signup parts and show signup when user clicks signup
  const handleRightClick = () => {
    setBoth(false);
    setIsLogin(false)
  }

  // set sample guid value 
  const [inputData, setInputData] = useState<loginData>({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: '',
   password: '',
  
  });

  //creating warnings for validation errors
  const [messageApi, contextHolder] = message.useMessage();
  const warning = () => {
    let warningMessage = 'Please fill in all fields!!.';
    if (!inputData.name || inputData.password) {
      warningMessage = 'Please fill in all fields!!.';
    } else if (!inputData.name) {
      warningMessage = 'Name is required!!';
    } else if (!inputData.password) {
      warningMessage = 'Password is required!!';
    }
  
    messageApi.open({
      type: 'error',
      content: warningMessage,
      style:{
       fontSize: "15px",
       color:"tomato",
       fontFamily:'agbalumo'
      }
    });
  
  };
  // Create SUCCESS messages 
  const success = (content:string) => {
    messageApi.open({
      type: 'success',
      content: content,
      style:{
        fontSize: "15px",
        color:"tomato",
        fontFamily:'agbalumo'
       }
    });
  }
//creating messages for server side messages 
  const warningsever = (content:string) => {
    messageApi.open({
      type: 'error',
      content: content,
      style:{
        fontSize: "15px",
        color:"tomato",
        fontFamily:'agbalumo'
       }
    });
  }

// check all fields not null and send data to server to create new user
  const handleSignUp = async () => {
    if(!inputData.name || !inputData.password){
      warning();
      return ;

    }
    try {
      const apiUrl = '/api/user/signup';
      const response = await axios.post(apiUrl, inputData);
      setInputData({
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: '',
        password: '',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        warningsever(error.response?.data.message);
      }
    }
  };

  // send data to the server and check password and username macthing
  const navigate = useNavigate();
  const handleLogin = async () => {
    if(!inputData.name || !inputData.password){
      warning();
      return ;

    }
    try {

      const apiUrl = '/api/user/login';
      const response = await axios.post(apiUrl, inputData); 
      if(response.status === 200){
        localStorage.setItem("message",response.data.message);
        navigate('/home', { 
          state: { 
            id: response.data.userid, 
            name: response.data.username 
          }
        });
       
      }
      setInputData({
        id: '',
        name: '',
        password: '',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        warningsever(error.response?.data.message);
      }
    }
  };
  
  

  return (
    <div className='main'>
       {contextHolder}
      <div className='main-container'>

        {/* login and singup container */}
        {both ? (
          <div>
            <div className="left-part" onClick={handleLeftClick}>
              <div className='icon-name-left'>
                <AccountCircleOutlinedIcon className='logo'/>
                <h1>Sign In</h1>
              </div>
            </div>
            <div className="right-part" onClick={handleRightClick}>
              <div className='icon-name-right'>
                <ControlPointOutlinedIcon className='logo'/>
                <h1>Sign Up</h1>
              </div>
            </div>
          </div>
          
        ) : isLogin ?  (
          
          <div className='content-main-container' >

            {/* login container */}
          <div className='login-part'>
           <h1>Hi, Welcome back !!</h1>
           <div className='login-container'>
           <div className='input'>
           <h2>Username : </h2>
           <Input
                type="text"
                className="stylish-input"
                placeholder="Enter Username"
                value={inputData.name}
                onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              />
           </div>
           <div className='input'>
           <h2>Password : </h2>
           <Input
               type="password"
                className="stylish-input"
                placeholder="Enter Password"
                value={inputData.password}
                onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
              />
              
           </div>
        
           <div className='input'>
           <Button className="button" type="primary" onClick={handleLogin}>
                 Login
                </Button>
           
           </div>


              </div>
          </div>

          {/* signup page navigate conatiner */}
          <div className='navto-signup' onClick={handleRightClick}>
          <ControlPointOutlinedIcon className='logo-nav'/>
          </div>
          </div>
          
        ):(
          // loginpage navigate conatiner
          <div className='content-main-container' >
            <div className='navto-login' onClick={handleLeftClick}>
          <AccountCircleOutlinedIcon className='logo-nav'/>
          </div>
          <div className='signup-part'>
           <h1>Create New Account !!</h1>
           <div className='login-container'>
           <div className='input'>
           <h2>Username : </h2>
           <Input
                type="text"
                className="signup-input"
                placeholder="Enter Username"
                value={inputData.name}
                onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              />
           </div>
           <div className='input'>
           <h2>Password : </h2>
           <Input
               type="password"
                className="signup-input"
                placeholder="Enter Password"
                value={inputData.password}
                onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
              />
           </div>
        
           <div className='input'>
           <Button className="button-signup" type="primary" onClick={handleSignUp}>
                Sign Up
                </Button>
           
           </div>


              </div>
          </div>
          
          </div>
          
        )}
      </div>
    </div>
  )
}

export default Login;
