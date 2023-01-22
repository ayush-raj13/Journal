require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

const uri = "mongodb+srv://admin-ayush:" + process.env.password + "@cluster0.4d2gkcj.mongodb.net/tjournalDB";

mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true });

//mongoDB Schema
const journalSchema = new mongoose.Schema({
  title: String,
  body: String,
  _id: String
});

//mongoDB model
const journal = mongoose.model('Journal', journalSchema);

// Load the full build.
var _ = require('lodash');
// Load the core build.
// var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');

// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');


const app = express();
const PORT = process.env.PORT || 3000;

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Suscipit tellus mauris a diam maecenas sed enim ut. Rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Augue mauris augue neque gravida in fermentum. Enim neque volutpat ac tincidunt vitae. Dolor sit amet consectetur adipiscing elit ut aliquam purus. Tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius. Curabitur vitae nunc sed velit dignissim sodales ut. Risus commodo viverra maecenas accumsan. Risus pretium quam vulputate dignissim. Sed faucibus turpis in eu mi. Vulputate sapien nec sagittis aliquam malesuada bibendum. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Nulla pellentesque dignissim enim sit amet venenatis urna cursus.";
const aboutContent = "Sit amet luctus venenatis lectus magna fringilla urna porttitor. Ut porttitor leo a diam sollicitudin tempor id eu nisl. Libero justo laoreet sit amet cursus sit amet dictum. Feugiat sed lectus vestibulum mattis ullamcorper velit. Tellus in metus vulputate eu scelerisque felis. Quam viverra orci sagittis eu volutpat. Eget duis at tellus at urna condimentum mattis pellentesque. In pellentesque massa placerat duis ultricies lacus sed. Tortor aliquam nulla facilisi cras fermentum odio. In hac habitasse platea dictumst. Lobortis scelerisque fermentum dui faucibus. Tincidunt id aliquet risus feugiat in ante metus dictum at. Faucibus et molestie ac feugiat sed. Pellentesque elit ullamcorper dignissim cras. Egestas diam in arcu cursus euismod.";
const contactContent = "Ac felis donec et odio pellentesque diam. Dui ut ornare lectus sit. Tortor id aliquet lectus proin nibh nisl. At urna condimentum mattis pellentesque id nibh. In fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Ornare arcu odio ut sem nulla pharetra diam sit amet. Eleifend donec pretium vulputate sapien nec. Ipsum faucibus vitae aliquet nec ullamcorper sit amet. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Felis imperdiet proin fermentum leo vel. Feugiat in fermentum posuere urna nec tincidunt praesent semper feugiat. Lacinia quis vel eros donec ac odio tempor orci dapibus. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Est ullamcorper eget nulla facilisi etiam dignissim diam. Gravida neque convallis a cras semper auctor neque vitae. Egestas pretium aenean pharetra magna ac placerat. Tristique senectus et netus et. Nisl vel pretium lectus quam id leo in vitae.";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// design file
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// routers
app.get("/", (req, res) => {
  journal.find({}, (err, docs) => {
    if (err){
      console.log(err);
    }else{
      res.render("home", {homeStartingContent:homeStartingContent, posts: docs});
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent:aboutContent});
});

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent:contactContent});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postTitle", (req, res) => {
  const requestedTitle = req.params.postTitle;
  journal.find({}, (err, docs) => {
    if (err){
      console.log(err);
    }else{
      docs.forEach(i => {
        if (requestedTitle === _.kebabCase(i.title)){
          res.render("post", {obj:i});
          return;
        }
      });
    }
  });
});

//Post Request
app.post("/compose", (req, res) => {
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;
  const kebabTitle = _.kebabCase(req.body.postTitle);

  const post = new journal({
    title: postTitle,
    body: postBody,
    _id: "/posts/"+kebabTitle
  });

  post.save();

  res.redirect("/");
  
});



// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});
