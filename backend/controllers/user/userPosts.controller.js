const getDataUri = require("../../dataUri");
const { addBlogPost, getAllPosts, findPost, updateUserPost } = require("../../models/dataOperations");
const cloudinary = require('cloudinary').v2;

async function createPost(req, res) {
  try {
    const { title, summary, content } = req.body;
    const { userId, authorType } = req;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.uploader.upload(fileUri.content);
    const newPath = { public_id: myCloud.public_id, secure_url: myCloud.secure_url };

    const response = await addBlogPost(title, summary, content, newPath, userId, authorType);

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
      res.status(200).json({ result });
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
      res.status(200).json({ result });
    } else {
      res.status(502).json({ message: response.message });
    }
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
}

async function updatePost(req, res) {
  try {
    let newPath = null;
    const { title, summary, content, postId } = req.body;

    if (req.file) {
      const file = req.file;
      const fileUri = getDataUri(file);
      const myCloud = await cloudinary.uploader.upload(fileUri.content);
      newPath = { public_id: myCloud.public_id, secure_url: myCloud.secure_url };
    }

    const response = await updateUserPost(title, summary, content, postId, newPath);
    
    if (response.message === "Done") {
      res.status(200).json({ message: "Post updated successfully", data: response });
    } else {
      res.status(500).json({ message: "Error updating post", error: response.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
}

module.exports = {
  createPost,
  showAllPosts,
  showPostDetails,
  updatePost,
};
