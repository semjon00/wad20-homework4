const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
    myparams = {
        text: request.body.text,
        media: request.body.media,
        userId: request.currentUser.id
    }

    PostModel.create(myparams, () => {
        response.status(200).json({});
    })
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post

    // Important: SECURITY
    // If getLikesByUserIdAndPostId check is removed,
    // powerusers may create unbounded number of likes for any given post by sending repeating API requests!
    PostModel.getLikesByUserIdAndPostId(request.currentUser.id, request.params.postId, (likes) => {
        if (likes.length !== 0) {
            response.status(500).json({}); // Better message?
            return;
        }

        PostModel.like(request.currentUser.id, request.params.postId, () => {
            response.status(200).json({});
        });
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

    PostModel.unlike(request.currentUser.id, request.params.postId, () => {
        response.status(200).json({});
    });
});

module.exports = router;
