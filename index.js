const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer');
const sequelize = require("./config/databse.js");

const app = express();
const port = 3000;
const upload = multer();


// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Create a PostgreSQL connection pool


const userRoutes = require("./routers/userRoutes.js")
const postRoutes = require("./routers/postRouter.js");
const commentRouter = require("./routers/commentRouter.js");
const likeRouter = require("./routers/likeRouter.js");
const followerRouter = require("./routers/followerRouter.js");


app.use("/users",userRoutes)
app.use("/posts",postRoutes)
app.use("/comments",commentRouter)
app.use("/likes",likeRouter)
app.use("/followers",followerRouter)



sequelize.sync().then(()=>{console.log("Database Connected Succesfully\n")}).catch((err)=>console.log(err))

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Instagram Clone API!');
});

// app.get('/check', (req, res) => {
//   res.send('<h1>Heading</h1>');
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
