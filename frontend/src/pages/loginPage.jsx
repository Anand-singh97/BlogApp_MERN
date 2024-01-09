import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useContext } from "react";
import blurBg from "../images/blurBg.jpg";
import blogging from "../images/blogging.png";
import { UserContext } from "../contexts/user.context";

export const LoginPage = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate(); // Hook for navigation

  const openGoogleSignIn = () => {
    window.open(`https://blogappbackend-cmom.onrender.com/auth/google`, "_self");
  };
  const makePasswordVisible = () => {
    setPasswordVisibility(!passwordVisibility);
  };
  const updateUsername = (event) => {
    const { value } = event.target;
    setUsername(value);
  };
  const updatePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
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

  const sendForm = async (e) => {
    try {
      e.preventDefault(); // prevent default form submission
  
      if (validationForm()) {
        const response = await fetch(`https://blogappbackend-cmom.onrender.com/user/login`, {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: { "Content-Type": "application/json" },
          credentials: 'include'
        });
        
        const obj = await response.json();
        if (response.ok) {
          const { username, id } = obj;
          setCurrentUser({ username: username, userId: id });
          navigate('/');
        } else {
          console.log(obj.message);
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
        backgroundPosition: "center"
      }}>
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
          <div className=" sm:w-[30rem] w-[25rem] backdrop-blur-lg bg-opacity-30 bg-white rounded-xl p-8">
            <h1 className="text-2xl text-center font-semibold mb-4">Login</h1>
            <div className="mb-4">
              <label for="username" className="block text-gray-600">
                Username
              </label>
              <input
                onChange={updateUsername}
                type="text"
                id="username"
                name="username"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none
                      focus:border-blue-500"
                value={username}
              />
              <span className=" text-red-500">{errors.username ? errors.username : ''}</span>
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
                onChange={updatePassword}
                type={passwordVisibility ? "text" : "password"}
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                value={password}
              />
              <span className=" text-red-500">{errors.password ? errors.password : ''}</span>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Login
            </button>

            <div class="mt-6 text-center">
              <div className="flex flex-col  gap-2">
                <p>
                  Don’t have an account yet?
                  <Link to="/register" class="underline hover:text-blue-900">
                    {" "}
                    Register
                  </Link>{" "}
                  now
                </p>
                <div>
                  <p className="text-black">OR</p>
                </div>
                <Link
                  onClick={openGoogleSignIn}
                  className=" text-white font-semibold px-5 py-2
                bg-blue-500 rounded-lg"
                  type="button"
                >
                  Sign In With Google
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
