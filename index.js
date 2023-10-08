const express = require("express");
const axios = require("axios");
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define your error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Analytics and Search Tool!");
});

app.get("/api/blog-stats", async (req, res, next) => {
  try {
    // Make the API request using Axios
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogs = response.data;

    // Perform data analysis using Lodash
    const totalBlogs = blogs.length;
    const longestTitleBlog = _.maxBy(blogs, (blog) => blog.title.length);
    const privacyTitleBlogs = _.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes("privacy")
    );
    const uniqueTitles = _.uniqBy(blogs, "title");

    // Respond with the JSON object containing statistics
    res.json({
      totalBlogs,
      longestBlogTitle: longestTitleBlog.title,
      privacyTitleCount: privacyTitleBlogs.length,
      uniqueBlogTitles: uniqueTitles.map((blog) => blog.title),
    });
  } catch (error) {
    // Handle errors, e.g., API request failed
    next(error);
  }
});

// Middleware for blog search
app.get("/api/blog-search", (req, res, next) => {
  const query = req.query.query.toLowerCase();

  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query parameter "query" is required' });
  }

  // Perform a search in your blog data
  const matchedBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query)
  );

  res.json({ matchedBlogs });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
