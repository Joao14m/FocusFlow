import React from 'react';

function Login() {
  return (
    <div className="wrapper">
      <form action="#">
        <h2>Login</h2>
        <div className="input-field">
          <input type="text" required />
          <label>Enter your email</label>
        </div>
        <div className="input-field">
          <input type="password" required />
          <label>Enter your password</label>
        </div>
        <div className="forget">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />
            Remember me
          </label>
        </div>
        <a href="#">Forgot password?</a>
        <button type="submit">Log In</button>
        <div className="register">
          <p>
            Don't have an account? <a href="/signup">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
