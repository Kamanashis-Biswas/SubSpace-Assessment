const express = require("express");
const axios = require("axios");
const _ = require("lodash");

const app = express();
const port = 3000;

app.get("/api/blog-stats", async (req, res) => {
  try {
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

    const totalBlogs = _.size(blogs);
    const longestBlog = _.maxBy(blogs, "title.length");
    const blogsWithPrivacy = _.filter(blogs, (blog) =>
      _.includes(_.toLower(blog.title), "privacy")
    );
    const uniqueBlogTitles = _.uniqBy(blogs, "title");

    res.json({
      totalBlogs,
      longestBlog: longestBlog ? longestBlog.title : null,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    });
  } catch (error) {
    console.error("Error fetching or analyzing blog data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blog-search", (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const filteredBlogs = blogs.filter((blog) => {
    if (blog && blog.title) {
      return _.toLower(blog.title).includes(_.toLower(query));
    }
    return false;
  });

  res.json(filteredBlogs);
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Analytics and Search Tool!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
