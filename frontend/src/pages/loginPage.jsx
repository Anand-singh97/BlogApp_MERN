import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import blurBg from "../images/blurBg.jpg";
import blogging from "../images/blogging.png";
import { UserContext } from "../contexts/user.context";

const LoginPage = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const makePasswordVisible = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const updateUsername = (event) => {
    setUsername(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  const validationForm = () => {
    const errorList = {};

    if (!username.trim()) {
      errorList.username = 'Username is required.';
    } else if (username.trim().length < 4) {
      errorList.username = 'Username must be at least 4 characters long.';
    }

    if (!password.trim()) {
      errorList.password = 'Password is required.';
    } else if (password.trim().length < 4) {
      errorList.password = 'Password must be at least 4 characters long.';
    }

    setErrors(errorList);
    return Object.keys(errorList).length === 0;
  };

  const fillTestAccountCredentials = () => {
    setUsername('test');
    setPassword('test');
  };

  const sendForm = async (e) => {
    try {
      e.preventDefault(); // prevent default form submission

      if (validationForm()) {
        const response = await fetch(
          `https://blogappbackend-cmom.onrender.com/user/login`,
          {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
          }
        );

        const obj = await response.json();
        if (response.ok) {
          const { username, id } = obj;
          setCurrentUser({ username, userId: id });
          navigate('/');
        } else {
          if (obj.message === 'User not found') {
            setErrors({ username: 'Invalid username' });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${blurBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <img alt="gbImage" src={blurBg} style={{ display: "none" }} />
      </div>
      <form
        className="relative flex justify-center"
        onSubmit={sendForm}
        method="post"
      >
        <div className="absolute font-semibold text-center top-[3rem] pb-2 border-b-2 text-[2rem]">
          <div className="flex flex-col items-center justify-center gap-1">
            <img className=" w-[4rem]" src={blogging} alt="bloggingImage" />
            <p>Ink Blaze</p>
          </div>
          <p className="text-[1rem]">
            Unveiling Tales, Perspectives, and Wisdom
          </p>
        </div>
        <div className="flex mt-[4rem] justify-center items-center h-screen">
          <div className="sm:w-[30rem] w-[25rem] backdrop-blur-lg bg-opacity-30 bg-white rounded-xl p-8">
            <h1 className="text-2xl text-center font-semibold mb-4">Login</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Username
              </label>
              <input
                onChange={updateUsername}
                type="text"
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={username}
              />
              <span className="text-red-500">{errors.username || ''}</span>
            </div>
            <div className="mb-4 relative">
              <div
                onMouseDown={makePasswordVisible}
                onMouseUp={makePasswordVisible}
                className="absolute top-[1.9rem] right-2"
              >
                <VisibilityIcon />
              </div>
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                onChange={updatePassword}
                type={passwordVisibility ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={password}
              />
              <span className="text-red-500">{errors.password || ''}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              >
                Login
              </button>
              <p>OR</p>
              <button
                onClick={fillTestAccountCredentials}
                type="button"
                className="bg-green-800 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-[50%]"
              >
                Fill test Credentials
              </button>
            </div>
            <div className="mt-6 text-center">
              <div className="flex flex-col gap-2">
                <p>
                  Don’t have an account yet?
                  <Link to="/register" className="underline hover:text-blue-900">
                    Register
                  </Link>{' '}
                  now
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
