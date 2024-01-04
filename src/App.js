import { Header } from "./components/header/header.component";
import {Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/indexPage";
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { CreatePost } from "./pages/createPostPage";
import { PostDetails } from "./pages/postDetailsPage";
import { EditPost } from "./pages/editPostPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element = {<IndexPage/>}/>
      </Route>
      <Route path="/create" element = {<CreatePost/>}/>
      <Route path="login" element = {<LoginPage/>}/>
      <Route path="register" element = {<RegisterPage/>}/>
      <Route path="/postDetails/:id" element = {<PostDetails/>}/>
      <Route path="/edit/:id" element = {<EditPost/>}/>
    </Routes>);
};
export default App;
