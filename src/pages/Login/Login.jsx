import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets.js'

const login = () => {

  const [currstate, setcurrentstate] = useState("Sign Up")

  return (
    <div className='login'>
       <img src={assets.logo_big} alt="" className="logo" />
       <form className="login-form">
          <h2>{currstate}</h2>
          {currstate === "Sign Up"?<input className='form-input' placeholder='username' type="text" required />:null}
          <input className='form-input' placeholder='Email address' type="text" required/>
          <input className='form-input' placeholder='password' type="text" required/>
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

export default login
