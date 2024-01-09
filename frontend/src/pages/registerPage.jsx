import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import blurBg from '../images/blurBg.jpg'
import blogging from '../images/blogging.png'
import VisibilityIcon from "@mui/icons-material/Visibility";
import { UserContext } from "../contexts/user.context";

export const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {setCurrentUser} = useContext(UserContext);

  const recordUserName = (event) => {
    const { value } = event.target;
    setUserName(value);
  };

  const recordPassword = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const makePasswordVisible = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const validationForm = ()=>
  {
    const errorList = {};
    if(!username || !username.trim())
    {
      errorList.username = 'Username is required.';
    }
    else if(username.trim().length < 4)
    {
      errorList.username = 'Username must be at least 4 characters long.';
    }
    if(!password || !password.trim())
    {
      errorList.password = 'Password is required.'
    }
    else if(password.trim().length < 4)
    {
      errorList.password = 'Password must be at least 4 characters long.';
    }
    setErrors(errorList);
    return Object.keys(errorList).length === 0;
  }


  const submitForm = async (e) => {
    try {
      e.preventDefault();
      if(validationForm())
      {
        const response = await fetch(`https://blogappbackend-cmom.onrender.com/user/register`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: { "Content-Type": "application/json" },
          credentials:'include'
        });
  
        const obj = await response.json();
        if (response.ok)
        {
          const { username, id } = obj;
            console.log(username, id);
            setCurrentUser({ username: username, userId: id });
            navigate('/');
        } 
        else 
        {
          if(obj.message.includes('duplicate key error'))
          {
            setErrors({username:'This username already exists.'});
          }
        }
      }
      
    } catch (err) 
    {
      console.log(err.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${blurBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div>
        <img alt="gbImage" src={blurBg} style={{ display: "none" }} />
      </div>
      <form
        className="relative flex justify-center"
        onSubmit={submitForm}
        method="POST"
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
        <div className="flex justify-center items-center mt-5 h-screen">
          <div className="w-[23rem] md:w-[30rem] backdrop-blur-lg bg-opacity-30 bg-white rounded-xl p-8">
            <h1 className="text-2xl text-center font-semibold mb-4">
              Register
            </h1>

            <div className="mb-4">
              <label for="username" className="block text-gray-600">
                Username
              </label>
              <input
                onChange={recordUserName}
                type="text"
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none
                      focus:border-blue-500"
                value={username}
              />
              <span className=" text-red-500">{errors.username? errors.username : ''}</span>
            </div>

            <div class="mb-4 relative">
              <div
                onMouseDown={makePasswordVisible}
                onMouseUp={makePasswordVisible}
                className="absolute top-[1.9rem] right-2"
              >
                <VisibilityIcon />
              </div>
              <label for="password" class="block text-gray-600">
                Password
              </label>
              <input
                onChange={recordPassword}
                type={passwordVisibility ? "text" : "password"}
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={password}
              />
              <span className=" text-red-500">{errors.password? errors.password : ''}</span>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Register
            </button>

            <div className="mt-6 text-blue-500 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="underline hover:text-blue-900">
                  Log In
                </Link>{" "}
                now
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
