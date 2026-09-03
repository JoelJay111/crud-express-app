require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getSupabase } = require('./supabaseClient');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/todos', async (req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/todos/:id', async (req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('todos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.post('/api/todos', async (req, res, next) => {
  try {
    const { title, description = '' } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const { data, error } = await getSupabase()
      .from('todos')
      .insert({
        title: title.trim(),
        description: description.trim()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.put('/api/todos/:id', async (req, res, next) => {
  try {
    const { title, description, is_complete } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty.' });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (is_complete !== undefined) {
      updates.is_complete = Boolean(is_complete);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided.' });
    }

    const { data, error } = await getSupabase()
      .from('todos')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const { error } = await getSupabase()
      .from('todos')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  const status = error.code === 'PGRST116' ? 404 : 500;
  const message = status === 404 ? 'Todo not found.' : error.message || 'Something went wrong.';

  res.status(status).json({ error: message });
});

module.exports = app;