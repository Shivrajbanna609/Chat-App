import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets.js'
import { signup, login } from '../../config/firebase.js'

const Login = () => {

  const [currstate, setcurrentstate] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");

  const onSubmitHandler = (event)=>{
    event.preventDefault();
    if (currstate ==="Sign Up") {
      signup(userName, email, password)
    }
    else{
      login(email, password)
    }
  }


  return (
    <div className='login'>
       <img src={assets.logo_big} alt="" className="logo" />
       <form onSubmit={onSubmitHandler} className="login-form">
          <h2>{currstate}</h2>
          {currstate === "Sign Up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} className='form-input' placeholder='username' type="text" required />:null}
          <input onChange={(e)=>setUserEmail(e.target.value)} value={email} className='form-input' placeholder='Email address' type="email" required/>
          <input onChange={(e)=>setUserPassword(e.target.value)} value={password} className='form-input' placeholder='password' type="password" required/>
          <button type='submit'>{currstate === "Sign Up"?"Create Account":"Login now"}</button>

          <div className="login-term">
            <input type="checkbox"/>
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className="login-forgot">
            {
              currstate === "Sign Up"
              ?<p className='login-toggle'>Already have an account <span onClick={()=>setcurrentstate("Login")}>Login here</span></p>
              :<p className='login-toggle'>Create an account <span onClick={()=>setcurrentstate("Sign Up")}>click here</span></p>
            }
          </div>
       </form>
    </div>
  )
}

export default Login
