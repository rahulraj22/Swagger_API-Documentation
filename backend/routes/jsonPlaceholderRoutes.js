const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Post:
 *              type: object
 *              properties:
 *                  userId: 
 *                      type: integer
 *                  title:
 *                      type: string
 *                  body:
 *                      type: string
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (from JSONPlaceholder API)
 *     description: Fetches all posts from https://jsonplaceholder.typicode.com/posts
 *     tags:
 *       - JSONPlaceholder
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *  get:
 *      summary: to get post by id
 *      description: to get post by id desc
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: Numberic ID is required
 *            schema:
 *              type: integer
 *      tags:
 *          - JSONPlaceholder
 *      responses:
 *          200:
 *              description: Post by ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 *                      example:
 *                          userId: 1
 *                          id: 1
 *                          title: "Hello World"
 *                          body: "Hello World, Welcome to Swagger."
 */
router.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        return res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/posts:
 *  post:
 *      summary: to insert post document
 *      description: same as summary
 *      tags:
 *          - JSONPlaceholder
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Post'
 *      responses:
 *          200:
 *              description: Post added successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items: 
 *                              $ref: '#components/schemas/Post'
 *                      example:
 *                          userId: 1
 *                          title: "Hello World"
 *                          body: "Hello World, Let's learn Swagger"
 */
router.post('/posts', async (req, res) => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(req.body));
        return res.status(201).json({message: 'Post added'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *  put:
 *      summary: to update post by id
 *      description: to update post by id
 *      parameters:
 *          - in : path
 *            name: id
 *            required: true
 *            description: Numberic ID is required
 *            schema:
 *              type: integer
 *      tags:
 *          - JSONPlaceholder
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Post'
 *      responses:
 *          200:
 *              description: Post has been updated(PUT)
 */
router.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`);
        res.status(201).json({message: 'Post Updated'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *  delete:
 *      summary: to delete post by id
 *      description: to delete post by ID, description
 *      tags:
 *          - JSONPlaceholder
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID is required
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Post delete successfully (using id)
 */
router.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, " got delete id");
        const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        res.status(200).json({message: 'Post Deleted'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;