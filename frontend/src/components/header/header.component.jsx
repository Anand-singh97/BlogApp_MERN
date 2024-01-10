import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Audio } from "react-loader-spinner";
export const Header = () => {
  const backendHost = process.env.BACKEND_HOST;
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isUserValid, setIsUserValid] = useState(false);

  const logout = async () => {
    try {
      const response = await fetch(`${backendHost}/user/logout`, {
        credentials: "include",
        method: "GET",
      });
      if (response.ok) {
        setCurrentUser(null);
        navigate("/login");
      } else {
        const obj = await response.json();
        console.log(obj.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${backendHost}/user/auth`, {
          credentials: "include",
          method: "GET",
        });

        if (!response.ok) {
          navigate("/login");
        }else
        {
          setIsUserValid(true);
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, backendHost]);

  if(!isUserValid)
  {
    return (
      <div className="flex h-screen items-center justify-center">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>);
  }

  return (
    <div>
      <div className="flex flex-col z-30 justify-center items-center sticky top-0">
        <header
          className="mt-2 rounded-full w-[22rem] md:w-[45rem] lg:w-[65rem] bg-gray-200
            backdrop-blur-lg bg-opacity-30 z-10 py-4"
        >
          <nav className="flex items-center gap-5 justify-between">
            <div className="ml-[1rem]">
              <Link className=" font-semibold text-[1.1rem]" to="/">
                Ink Blaze
              </Link>
            </div>
            <div className="mr-[1rem] flex gap-2">
              <Link
                to={"/create"}
                className="text-center text-[0.9rem] font-semibold w-[7.5rem]
                py-[0.5rem] md:w-[9rem] bg-green-400"
              >
                Create New post
              </Link>
              <Link
                onClick={logout}
                className="text-center font-semibold 
                py-[0.5rem] text-[0.9rem] w-[6rem] px-5 bg-green-400"
              >
                Logout
              </Link>
            </div>
          </nav>
        </header>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
