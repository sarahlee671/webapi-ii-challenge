const db = require('./data/db.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
    db
        .find()
        .then(posts => {
            res.status(200).json({ posts });
        })
        .catch(error => {
            res.status(500).json({ error: "The posts information could not be retrieved."})
        })
});

router.get('/:id', async (req, res) => {
    try {
        const post = await db.findById(req.params.id);
        if (post.length) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retrieved."});
    }
});


router.get('/:id/comments', (req, res) => {
    db
        .findCommentById(req.params.id)
        .then(comments => {
            if (comments.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved."})
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } 
    db
        .insert({
            title,
            contents
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database"})
        })
})

router.post('/:id/comments', (req, res) => {
    // const { id } = req.params;
    db
        .findById(req.params.id)
        .then(posts => {
            if (posts.length) {
                const post = posts[0]
                const { text } = req.body;
                if (!text) {
                    res.status(404).json({ errorMessage: "Please provide text for the comment" })
                }
                const commentAttributes = {text: text, post_id: post.id}
                db
                    .insertComment(commentAttributes)
                    .then(commentId => {
                        res.status(201).json(commentAttributes)
                    })
                    .catch(error => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
})


module.exports = router;