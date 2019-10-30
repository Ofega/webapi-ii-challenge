const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.get('/api/posts', getAllPosts);
server.get('/api/posts/:id', getPost);
server.post('/api/posts', createNewPost);
server.get('/api/posts/:id/comments', getAllComments);
server.post('/api/posts/:id/comments', createNewComment);
server.delete('/api/posts/:id', deletePost);
server.put('/api/posts/:id', updatePost);

function getAllPosts(req, res) {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
}

function getPost(req, res) {
    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ error: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
}

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

function getAllComments(req, res) {
    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post) {
                db.findPostComments(id)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
                    .catch(() => {
                        res.status(500).json({ error: "The comments information could not be retrieved." });
                    })
            } else {
                res.status(404).json({ error: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
}

function createNewComment(req, res) {
    const { text } = req.body;
    const { id } = req.params;

    if(!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        db.findById(id)
            .then((post) => {
                if (post) {
                    db.insertComment({text: text, post_id: id})
                        .then(({ id }) => {
                            db.findCommentById(id)
                                .then((comment) => {
                                    res.status(201).json(comment);
                                })
                        })
                        .catch(() => {
                            res.status(500).json({ error: "There was an error while saving the comment to the database" });
                        })
                } else {
                    res.status(404).json({ error: 'The post with the specified ID does not exist.' });
                }
            })
            .catch(() => {
                res.status(500).json({ error: "The post information could not be retrieved." });
            })
    }
}

function deletePost(req, res) {
    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post) {
                db.remove(id)
                    .then(() => {
                        res.status(200).json(post);
                    })
                    .catch(() => {
                        res.status(500).json({error: "The post could not be removed" });
                    })
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
        })
        .catch(() => {
            res.status(404).json({error: "The post information could not be retrieved." });
        })  
}

function updatePost(req, res) {
    const { id } = req.params;
    const { title, contents } = req.body

    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        db.update(id, req.body)
            .then(post => {
                if(post) {
                    db.findById(id)
                        .then((newPost) => {
                            res.status(200).json(newPost);
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                }
            })
            .catch(() => {
                res.status(500).json({error: 'The post information could not be modified.'});
            });
    }
}

server.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${process.env.PORT || 3000}`)
})