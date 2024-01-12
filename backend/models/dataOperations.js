const bcrypt = require("bcrypt");
const { userCollection, googleUserModel, postsModel } = require("./user.mongo");

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return { message: "Done", result: hashedPassword };
  } catch (error) {
    return { message: error.message };
  }
}

async function comparePassword(enteredPassword, hashedPasswordFromDatabase) {
  try {
    const response = await bcrypt.compare(enteredPassword, hashedPasswordFromDatabase);
    return response
      ? { message: "Done" }
      : { message: "Password did not match" };
  } catch (error) {
    return { message: error.message };
  }
}

async function saveDataInRegisteredAccounts(username, password) {
  try {
    const hashedPasswordResponse = await hashPassword(password);

    if (hashedPasswordResponse.message === "Done") {
      const hashedPassword = hashedPasswordResponse.result;
      await userCollection.create({ username, password: hashedPassword });

      const user = await findUserInRegisteredAccounts(username, password);
      const { result } = user;
      const payloadForJwtToken = result;
      return { message: "Done", result: payloadForJwtToken };
    } else {
      return { message: hashedPasswordResponse.message };
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
      const passwordComparison = await comparePassword(password, user.password);

      if (passwordComparison.message === "Done") {
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
    const user = await googleUserModel.findOne({ googleAccountId });

    if (user) {
      return { message: "Done", result: { username: user.username, id: user._id } };
    } else {
      const response = await saveDataInGoogleAuthAccounts(username, googleAccountId, email);

      if (response.message === "Done") {
        const newUser = await googleUserModel.findOne({ username });
        return { message: "Done", result: { username: newUser.username, id: newUser._id } };
      } else {
        return { message: response.message };
      }
    }
  } catch (error) {
    return { message: error.message };
  }
}

async function addBlogPost(title, summary, content, imageLocation, authorId, authorType) {
  try {
    await postsModel.create({
      title,
      summary,
      content,
      imageLocation: { id: imageLocation.public_id, url: imageLocation.secure_url },
      author: authorId,
      authorType,
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

    if (post) {
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
      imageLocation: newPath !== null ? { id: newPath.public_id, url: newPath.secure_url } : post.imageLocation,
    });

    return { message: 'Done' };
  } catch (error) {
    return { message: error.message };
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
