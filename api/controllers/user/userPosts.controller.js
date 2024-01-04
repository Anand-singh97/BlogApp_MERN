const {
  addBlogPost,
  getAllPosts,
  findPost,
  updateUserPost,
} = require("../../models/dataOperations");
const fs = require("fs");
async function createPost(req, res) {
  try {
    const { originalname, path } = req.file;
    const { title, summary, content } = req.body;
    const { userId, authorType } = req;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const response = await addBlogPost(
      title,
      summary,
      content,
      newPath,
      userId,
      authorType
    );
    if (response.message === "Done") {
      res.status(200).json({ message: "ok" });
    } else {
      res.status(503).json({ message: response.message });
    }
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
}

async function showAllPosts(req, res) {
  try {
    const response = await getAllPosts();
    if (response.message === "Done") {
      const { result } = response;
      res.status(200).json({ result: result });
    } else {
      res.status(503).json({ message: response.message });
    }
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
}

async function showPostDetails(req, res) {
  try {
    const { id } = req.params;
    const response = await findPost(id);
    if (response.message === "Done") {
      const { result } = response;
      res.status(200).json({ result: result });
    } else {
      res.status(502).json({ message: response.message });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
}

async function updatePost(req, res) {
  
  try {
    let newPath = "";
    const { title, summary, content, postId } = req.body;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    const response = await updateUserPost(title, summary, content, postId, newPath);
    res
      .status(200)
      .json({ message: "Post updated successfully", data: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
}
module.exports = {
  createPost,
  showAllPosts,
  showPostDetails,
  updatePost,
};
