import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState('');
  const navigate = useNavigate();

const updateTitle = (event)=>{
    const {value} = event.target;
    setTitle(value);
}
const updateSummary = (event)=>{
  const {value} = event.target;
  setSummary(value);
}
const updateContent = (newValue)=>{
  setContent(newValue);
}
const updateImageFile = (event)=>{
  const{files} = event.target;
  setImageFile(files[0]);
}

const createNewPost = async(e)=>{
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('summary', summary);
  formData.append('content', content);
  formData.append('imageFile', imageFile);
  const response = await fetch('https://localhost:8000/posts/post', {
    method:'POST',
    body: formData,
    credentials:'include'
  });
  if(response.ok)
  {
    navigate('/');
  }
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
      <form onSubmit={createNewPost} className="mt-5 pt-0 p-3 flex gap-3 flex-col">
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
        </div>
        <div className="w-fit p-2 rounded-xl">
          <label for="fileInput" className="block text-gray-600">
            Add image
          </label>
          <input onChange={updateImageFile} className="border-2 p-2 rounded-lg" type="file" id="fileInput" name="fileInput" />
        </div>

        <ReactQuill
          onChange={updateContent}
          value={content}
          modules={modules}
          formats={formats}
          className=""
        />
        <div className=" text-center">
          <button type="submit" className="mt-5 bg-green-300 w-[35%] hover:bg-green-800 text-black font-semibold py-2 px-4">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};
