const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}
// structure of posts
// {postId:{id, title, comments:[{id, content, status}]}}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log(`receiving ${type} event`);
  
  switch(type) {
    case 'PostCreated':
      handlePostCreatedEvent(data);
      break;
    case 'CommentCreated':
      handleCommentCreatedEvent(data);
      break;
    case 'CommentUpdated':
      handleCommentUpdatedEvent(data);
      break;
  }
  res.send({});
})

const handlePostCreatedEvent = (data) => {
  const {id, title} = data;
  posts[id] = {
    id, title, comments: []
  }
}
const handleCommentCreatedEvent = (data) => {
  const {id, postId, content, status} = data;
  posts[postId].comments.push({id, content, status});
}
const handleCommentUpdatedEvent = (data) => {
  const { id, postId, status } = data;
  if(!posts[postId]) {
    return
  }
  const comment = posts[postId].comments.find(comment => comment.id === id);
  comment.status = status;
}

const port = 4002
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});