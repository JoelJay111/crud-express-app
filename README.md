# Todo Supabase Express

An Express CRUD todo application backed by Supabase. It includes JSON API routes and a small browser UI served from the same Express server.

## Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Add your Supabase project URL and anon key to `.env`.
5. Install and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Check server status |
| GET | `/api/todos` | List todos |
| GET | `/api/todos/:id` | Get one todo |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## Request Examples

Create a todo:

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Learn Supabase\",\"description\":\"Build CRUD routes with Express\"}"
```

Update a todo:

```bash
curl -X PUT http://localhost:3000/api/todos/YOUR_TODO_ID \
  -H "Content-Type: application/json" \
  -d "{\"is_complete\":true}"
```

Delete a todo:

```bash
curl -X DELETE http://localhost:3000/api/todos/YOUR_TODO_ID
```
