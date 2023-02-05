const Post = require("../models/Post");

const createBlogController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdBy = req._id;

    if (!title || !description) {
      res.status(400).send("Title and Description is required");
    }

    const blog = await Post.create({
      title,
      description,
      createdBy,
    });

    return res.status(200).send({ blog });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

const getBlogsController = async (req, res) => {
  try {
    const blogs = await Post.find();

    if (!blogs) {
      return res.status(404).send("No blogs available");
    }

    return res.status(200).send({ blogs });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};

const updateBlogController = async (req, res) => {
  try {
    const { blogId, title, description } = req.body;
    const curUserId = req._id;

    const blog = await Post.findById(blogId);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    if (blog.createdBy.toString() !== curUserId) {
      return res.status(403).send("Only owners can update their post");
    }

    if (title) {
      blog.title = title;
    }
    if (description) {
      blog.description = description;
    }

    await blog.save();
    return res.status(200).send({ blog });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const deleteBlogController = async (req, res) => {
  try {
    const { blogId } = req.body;
    const curUserId = req._id;
    const blog = await Post.findById(blogId);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    if (blog.createdBy.toString() !== curUserId) {
      return res.status(403).send("Only owners can delete their blogs");
    }

    //removing post from everywhere
    await blog.remove();

    return res.status(200).send("Blog deleted successfully");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = {
  createBlogController,
  getBlogsController,
  updateBlogController,
  deleteBlogController,
};
