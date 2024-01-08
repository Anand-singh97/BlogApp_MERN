import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import { formatISO9075 } from "date-fns";
import { Audio } from "react-loader-spinner";

export const PostDetails = () => {
  const [postData, setPostData] = useState(null);
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.userId) {
      alert('Session Ended');
      navigate('/login');
      return;
    }

    const getPostData = async () => {
      try {
        const response = await fetch(
          `https://blogappbackend-cmom.onrender.com/posts/details/${id}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const obj = await response.json();
          const { result } = obj;
          setPostData(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPostData();
  }, [id, currentUser, navigate]);

  if (!postData) {
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
      </div>
    );
  }
  const { imageLocation, title, content, author, createdAt, _id } = postData;

  return (
    <div>
      <div className="mt-5 flex flex-col items-center">
        <div className="rounded-full p-2 bg-green-400">
          <Link to={"/"} className="flex">
            <ArrowBackIcon />
          </Link>
        </div>
        <div className="text-center">
          <div className="font-semibold mx-5 mt-5 mb-2 text-2xl flex gap-5 justify-center items-center md:text-3xl lg:text-4xl">
            <h1>{title}</h1>
          </div>
        </div>
        {currentUser.userId === author._id ? (
          <Link to={`/edit/${_id}`} className="py-2 px-4 mb-5 bg-green-400">
            Edit This Post
          </Link>
        ) : (
          <div className="py-2 px-4 mb-5"></div>
        )}
        <div className="flex w-[79%] font-semibold justify-between">
          <p>by: @{author.username}</p>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <div className="mx-5 w-[80%]">
          {imageLocation && (
            <div
              className="image-container"
              style={{ height: "300px", overflow: "hidden" }}
            >
              <img
                src={imageLocation.url}
                alt="blog images"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <div className="mx-[2rem] mt-5 text-[1rem] lg:mx-[5rem] lg:text-[1.3rem]">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </div>
  );
};
