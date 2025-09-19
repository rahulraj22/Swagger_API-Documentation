require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { fetchAllDocuments, fetchAllCollections } = require('./services/dbService');
const Student = require('./models/student');
const jsonPlaceholder = require('./routes/jsonPlaceholderRoutes');
const app = express();

// Middleware to parse json payload/body
app.use(express.json());
app.use(cors());

// swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS API Project for MongoDB',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000/'
            },
            // {
            //     url: 'https://jsonplaceholder.typicode.com/'
            // }
        ]
    },
    apis: ['./index.js', './routes/*.js'] // file name where all apis are listed
}
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // api route for swagger ui

// MongoDB connection
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
console.log(MONGODB_PASSWORD, " password");
const url = `mongodb+srv://admin-rahul:${MONGODB_PASSWORD}@cluster0.zskclen.mongodb.net/todolistDB?retryWrites=true&w=majority&appName=Cluster0`; // it will not instantly create DB (on using mongoose): MongoDB does lazy db creation
// It will create mongo db only when some operations performed on it.
const PORT = process.env.PORT || 3000;
mongoose.connect(url)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start server only after DB connection
        app.listen(PORT, () => {
            console.log(`Server listening on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error: ', err);
    });


/**
 * @swagger 
 * /:
 *  get:
 *      summary: This api is used to check if get method is working or not.
 *      description: This api is used to check if get method is working or not (description).
 *      responses:
 *          200:
 *              description: To test GET Method.
 */
app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

app.get('/createuser/:id', async (req, res) => {
    const userId = req.params.id;
    const UserSchema = new mongoose.Schema({ name: String });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    await User.create({ name: `Rahul${userId}` });
    res.status(200).json({ message: 'Table created' });
});

// GET
/**
 * @swagger
 *  components:
 *      schemas:
 *          Student:
 *              type: object
 *              properties: 
 *                  name:
 *                      type: string
 *                  age:
 *                      type: integer
 *                  scores:
 *                      type: array
 *                      items:
 *                          type: integer
 *                      example: [90, 59, 32, 88, 68]
 */

/**
 * @swagger
 *  /students:
 *  get:
 *      summary: This api is used to fetch all students
 *      description: It lists down all saved student details from `students` collection in mongodb
 *      responses:
 *          200:
 *              description: To test GET METHOD, to lists all students
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              $ref: '#components/schemas/Student'
 */
app.get('/students', async (req, res) => {
    try {
        const students = await fetchAllDocuments('students');
        return res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET by id
/**
 * @swagger
 *  /students/{id}:
 *  get:
 *      summary: This api is used to fetch all students
 *      description: It lists down all saved student details from `students` collection in mongodb
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID is required
 *          schema: 
 *              type: string
 *      responses:
 *          200:
 *              description: To test GET METHOD, to lists all students
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          type: object
 *                          items: 
 *                              $ref: '#components/schemas/Student'
 *                      example:
 *                          _id: 68c9b14bda75d81db2cebea4
 *                          name: Jhon Doe
 *                          age: 46
 *                          scores: [98, 23, 35, 89, 59]
 */
app.get('/students/:id', async (req, res) => {
    try {
    const { id } = req.params;
    console.log(id, " got id");
    const student = await Student.findById(id);
    console.log(student, " got student");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST
/**
 * @swagger
 *  /students:
 *  post:
 *      summary: This api is used to add/insert new student to students collection
 *      description: It lists down all saved student details from `students` collection in mongodb
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema: 
 *                      $ref: '#components/schemas/Student'
 *      responses:
 *          200:
 *              description: Student object(document) added Successfully.
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          type: object
 *                          items: 
 *                              $ref: '#components/schemas/Student'
 *                      example:
 *                          _id: 68c9b14bda75d81db2cebea4
 *                          name: Jhon Doe
 *                          age: 46
 *                          scores: [98, 23, 35, 89, 59]
 */
app.post('/students', async (req, res) => {
    console.log(req.body, " got body");
    const { name, age, scores } = req.body;
    try {
        const student = new Student({ name: name, age: age, scores: scores });
        const savedUser = await student.save();
        return res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE
/**
 * @swagger
 * /students/{id}:
 *  delete:
 *      summary: to delete student record/document by id from students collection
 *      description: it accepts id as dynamic parameter and delete the student document from students collection
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID is required
 *          schema: 
 *              type: string
 *      responses:
 *          200:
 *              description: data is deleted
 */
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: `Student of id: ${id} got deleted` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT
/**
 * @swagger
 *  /students/{id}:
 *  put:
 *      summary: This api is used to put the data of student by its ID
 *      description: This api takes ID as dynamic route and payload as student documents like name, age and scores and updates its value
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description:  Numeric ID is required
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Student'
 *      responses:
 *          200:
 *              description: The student details updated successfully.
 */
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body, " got by id");
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.get('/teachers', async (req, res) => {
    try {
        const students = await fetchAllDocuments('teachers');
        return res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/collections', async (req, res) => {
    try {
        const collections = await fetchAllCollections();
        return res.json(collections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api', jsonPlaceholder);