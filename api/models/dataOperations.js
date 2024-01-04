const { userCollection, googleUserModel, postsModel } = require("./user.mongo");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return { message: "Done", result: hashedPassword };
  } catch (error) {
    return { message: error };
  }
}
async function comparePassword(enteredPassword, hashedPasswordFromDatabase) {
  try {
    const response = await bcrypt.compare(
      enteredPassword,
      hashedPasswordFromDatabase
    );
    if (response) return { message: "Done" };
    else return { message: "Password did not match" };
  } catch (error) {
    return { message: error.message };
  }
}
async function saveDataInRegisteredAccounts(username, password) {
  try {
    const response = await hashPassword(password);
    if (response.message === "Done") {
      const hashedPassword = response.result;
      await userCollection.create({ username, password: hashedPassword });
      const user = await findUserInRegisteredAccounts(username, password);
      const { result } = user;
      const payloadForJwtToken = result;
      return { message: "Done", result: payloadForJwtToken };
    }
  } catch (error) {
    return { message: error.message };
  }
}
async function saveDataInGoogleAuthAccounts(username, googleAccountId, email) {
  try {
    await googleUserModel.create({
      username,
      googleAccountId,
      email,
    });
    return { message: "Done" };
  } catch (error) {
    return { message: error.message };
  }
}
async function findUserInRegisteredAccounts(username, password) {
  try {
    const user = await userCollection.findOne({ username });
    if (user) {
      const response = await comparePassword(password, user.password);
      if (response.message === "Done") {
        const payloadForJwtToken = { username: user.username, id: user._id };
        return { message: "Done", result: payloadForJwtToken };
      } else {
        return { message: "Invalid password." };
      }
    } else {
      return { message: "No user found" };
    }
  } catch (error) {
    return { message: error.message };
  }
}
async function findUserInGoogleAuthAccounts(username, googleAccountId, email) {
  try {
    const user = await googleUserModel.findOne({
      googleAccountId: googleAccountId,
    });
    if (user) {
      return { message: "Done" };
    } else {
      const response = await saveDataInGoogleAuthAccounts(
        username,
        googleAccountId,
        email
      );
      if (response.message === "Done") {
        return { message: response.message };
      } else {
        return { message: response.message };
      }
    }
  } catch (error) {
    return { message: error.message };
  }
}
async function addBlogPost(
  title,
  summary,
  content,
  imageLocation,
  authorId,
  authorType
) {
  try {
    await postsModel.create({
      title: title,
      summary: summary,
      content: content,
      imageLocation: imageLocation,
      author: authorId,
      authorType: authorType,
    });
    return { message: "Done" };
  } catch (error) {
    return { message: error.message };
  }
}
async function getAllPosts() {
  try {
    const posts = await postsModel
      .find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    return { message: "Done", result: posts };
  } catch (error) {
    return { message: error.message };
  }
}

async function findPost(id) {
  try {
    const post = await postsModel.findById(id).populate("author", ["username"]);
    if (post != null) {
      return { message: "Done", result: post };
    } else {
      return { message: "No post found" };
    }
  } catch (error) {
    return { message: error.message };
  }
}

async function updateUserPost(title, summary, content, postId, newPath) {
    try {
      const post = await postsModel.findById(postId);
  
      await post.updateOne({
        title,
        summary,
        content,
        imageLocation: newPath !== '' ? newPath : post.imageLocation
      });
  
      return { message: 'Done' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

module.exports = {
  saveDataInRegisteredAccounts,
  findUserInRegisteredAccounts,
  findUserInGoogleAuthAccounts,
  saveDataInGoogleAuthAccounts,
  addBlogPost,
  getAllPosts,
  findPost,
  updateUserPost,
};
