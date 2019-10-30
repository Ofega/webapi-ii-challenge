const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

// server.get('/api/posts', getAllPosts);
// server.get('/api/posts/:id', getPost);
server.post('/api/posts', createNewPost);
// server.get('/api/posts/:id/comments', getAllComments);
// server.post('/api/posts/:id/comments', createNewComment);
// server.delete('/api/posts/:id', deletePost);
// server.put('/api/posts/:id', updatePost);


function createNewPost(req, res) {
    const { title, contents } = req.body;

    if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        db.insert(req.body)
            .then((post) => {
                res.status(201).json(post);
            })
            .catch(() => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            })
    }
}


server.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${process.env.PORT || 3000}`)
})