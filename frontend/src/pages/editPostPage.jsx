import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Audio } from "react-loader-spinner";

export const EditPost = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],

      ["clean"],
    ],
  };
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "size",
    "header",
    "link",
    "image",
    "video",
    "color",
    "background",
    "clean",
  ];
  const updateTitle = (event) => {
    const { value } = event.target;
    setTitle(value);
  };
  const updateSummary = (event) => {
    const { value } = event.target;
    setSummary(value);
  };
  const updateContent = (newValue) => {
    setContent(newValue);
  };
  const updateImageFile = (event) => {
    const { files } = event.target;
    setImageFile(files);
  };

  const validation = ()=>{
    const errorList = {};
    if(!title || !title.trim())
    {
      errorList.titleError = 'Title Cannot be empty';
    }
    if(!summary || !summary.trim())
    {
      errorList.summaryError = 'Summary Cannot be empty';
    }
    if(!content || !content.trim())
    {
      errorList.contentError = 'Content Cannot be empty';
    }
    setErrors(errorList);
    return Object.keys(errorList).length === 0;
  }

  const updatePost = async (e) => {
    e.preventDefault();
    if(validation())
    {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", content);
      formData.append("postId", id);
      if(imageFile?.[0])
      {
          formData.append("imageFile", imageFile?.[0]);
      }
      const response = await fetch(`https://blogappbackend-cmom.onrender.com/posts/updatePost`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        navigate(`/postDetails/${id}`);
      }
    }
    
  };
  useEffect(() => {
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
          const { title, summary, content } = result;
          setTitle(title);
          setSummary(summary);
          setContent(content);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPostData();
  }, [id]);

  if (!postData) {
    return (
      <div className="flex h-screen items-center justify-center">
        ;
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
  return (
    <div>
      <div className="text-center text-3xl mt-6">
        <h1>Create a post</h1>
      </div>
      <div>
        <Link
          to={"/"}
          className="mt-5 ml-3 bg-green-300 w-[20%] hover:bg-green-500 text-black
                font-semibold rounded-full pb-[1rem] py-[0.7rem] px-4"
        >
          <ArrowBackIcon />
        </Link>
      </div>
      <form onSubmit={updatePost} className="mt-5 pt-0 p-3 flex gap-3 flex-col">
        <div>
          <label for="title" className="block text-gray-600">
            Title
          </label>
          <input
            onChange={updateTitle}
            value={title}
            type="text"
            id="title"
            name="title"
            className="w-full border border-gray-300 bg-green-100 rounded-md 
            py-2 px-3 focus:outline-none focus:border-blue-500"
          />
          {errors.titleError ? <span className=" text-red-500">{errors.titleError}</span> : <></>}
        </div>
        <div>
          <label for="summary" className="block text-gray-600">
            Summary
          </label>
          <textarea
            onChange={updateSummary}
            value={summary}
            type="text"
            id="summary"
            name="summary"
            className="w-full border border-gray-300 bg-green-100 rounded-md py-2 px-3 focus:outline-none
                    focus:border-blue-500"
          />
          {errors.summaryError ? <span className=" text-red-500">{errors.summaryError}</span> : <></>}
        </div>
        <div className="w-fit p-2 rounded-xl">
          <label for="fileInput" className="block text-gray-600">
            Add image
          </label>
          <input
            onChange={updateImageFile}
            className="border-2 p-2 rounded-lg"
            type="file"
            id="fileInput"
            name="fileInput"
          />
        </div>

        <div>
          <ReactQuill
            onChange={updateContent}
            value={content}
            modules={modules}
            formats={formats}
            className=""
          />
          {errors.contentError ? <span className=" text-red-500">{errors.contentError}</span> : <></>}
        </div>
        
        <div className=" text-center">
          <button
            type="submit"
            className="mt-5 bg-green-300 w-[35%] hover:bg-green-800 text-black font-semibold py-2 px-4"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};
