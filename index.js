const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.REACT_APP_User}:${process.env.REACT_APP_Password}@cluster0.fvw3ibm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const blogCollection = client.db("Online-it-ghor").collection("blogs");
    // const blog = {
    //   img: "example.com",
    //   title: "this is try",
    //   description: "this is try.this is try.this is try.this is try.",
    // };

    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    app.get("/blogs/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await blogCollection.findOne(query);
      res.send(result)
    })

    app.get("/update/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await blogCollection.findOne(query);
      res.send(result);
    })

    app.post("/blogs", async (req, res) => {
      const blogs = req.body;
      console.log(blogs);
      const result = await blogCollection.insertOne(blogs);
      res.send(blogs);
      // if (result?.acknowledged){
      //   alert("Blog added successfully!")
      // }
    });

    app.delete("/blogs/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await blogCollection.deleteOne(query);
      res.send(result);   
      // console.log("delete",id);
    })

    // update blog
    app.put("/update/:id", async(req, res) =>{
      const id = req.params.id;
      const blog = req.body;
      const option = {upsert:true}
      const filter = {_id: ObjectId(id)};
      const updatedBlog = {
        $set:{
          title: blog.title,
          img: blog.img,
          blogText: blog.blogText
        }
      }
      const result = await blogCollection.updateOne(filter, updatedBlog, option)
      res.send(result);
    })


  } catch {}
};

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(port, "listening");
});
