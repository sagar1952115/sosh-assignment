const request = require("supertest");
const expect = require("expect.js");
const app = "http://localhost:5000";

describe("Blog APIs", () => {
  let blogId;
  let accessToken;
  console.log("blog test starting");

  // Logging in the User

  it("logging in first", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "vivek@gmail.com",
      password: "vivek",
    });
    expect(res.statusCode).to.be(200);
    accessToken = res.body.accessToken;
    console.log("user logged in", accessToken);
  });
  // Logged in user creating the blog

  it("creates a blog", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test Blog",
        description: "This is a test blog",
      });
    expect(res.statusCode).to.be(200);
    // console.log("this is blog", res);
    blogId = res._body.blog._id;
    console.log("blog created");
  });

  // Logged in user creating the blog

  it("edits a blog", async () => {
    console.log("blog id is this", blogId);
    const res = await request(app)
      .put(`/blogs`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        blogId,
        title: "Updated Test Blog Title",
        description: "Updated Test Blog Description",
      });
    expect(res.statusCode).to.be(200);
  });

  // Logged in user deleting the blog

  it("deletes a blog", async () => {
    const res = await request(app)
      .delete(`/blogs`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        blogId,
      });
    expect(res.statusCode).to.be(200);
  });

  // User is logging out

  it("logout the user", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(res.statusCode).to.be(200);
    accessToken = "";
  });
  // Logout user will not be able to create a blog

  it("creates a blog: This request will fail because user is not authorized", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test Blog",
        description: "This is a test blog",
      });
    expect(res.statusCode).to.be(401);
    console.log("blog is not created");
  });
  // Logout user will not be able to delete the existing blog

  it("deletes a blog: This will also fail", async () => {
    const res = await request(app)
      .delete(`/blogs`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        blogId,
      });
    expect(res.statusCode).to.be(401);
  });
  // Logout user will not be able to edit a blog

  it("edits a blog: This will fail as user is not authorized", async () => {
    console.log("blog id is this", blogId);
    const res = await request(app)
      .put(`/blogs`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        blogId,
        title: "Updated Test Blog Title",
        description: "Updated Test Blog Description",
      });
    expect(res.statusCode).to.be(401);
  });
});
