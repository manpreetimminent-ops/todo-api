const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors'); 
const Todo     = require('./todo.model');

const app = express();
app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/tododb')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('Error:', err));

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — create todo
app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({ title: req.body.title });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT — mark as complete
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove todo
app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Todo API running at http://localhost:3000');
});