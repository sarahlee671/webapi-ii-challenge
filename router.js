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
        console.log(post)
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






module.exports = router;