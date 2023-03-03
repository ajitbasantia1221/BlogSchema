const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Connect mongoDB with nodejs

mongoose.connect('mongodb://localhost:27017/BlogDB', { useNewUrlParser: true });

//Schema Design

const blogSchema = new mongoose.Schema({
  articleName: String,
  authorName: String,
  description: String,
  createdBy: String,
  timestamp: { type: Date, default: Date.now }
});

const BlogModel = mongoose.model('BlogModel', blogSchema);

// For Create

app.post('/articles', async (req, res) => {
  try {
    const { articleName, authorName, description, createdBy } = req.body;
    const data = new BlogModel({ articleName, authorName, description, createdBy });
    await data.save();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// For Read

app.get('/articles', async (req, res) => {
  try {
    const data = await BlogModel.find();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// For Updating the documents:

app.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { articleName, authorName, description, createdBy } = req.body;

    // Check that ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID' });
    }

    // Check that all required fields are present in the request payload
    if (!articleName || !authorName || !description || !createdBy) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    // Update the document in MongoDB
    const updatedDoc = await BlogModel.findByIdAndUpdate(
      id,
      { articleName, authorName, description, createdBy },
      { new: true }
    );

    // Check that the document was updated
    if (!updatedDoc) {
      return res.status(404).send({ message: 'Document not found' });
    }

    // Send the updated document as the response
    res.send(updatedDoc);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error!!!!!!!!' });
  }
});


// For Delete

  app.delete('/articles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BlogModel.findByIdAndDelete(id);
      res.send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  });





app.listen(3000, () => {
  console.log('Server listening on port 3000');
});