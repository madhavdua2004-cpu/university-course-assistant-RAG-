# University Course Assistant UI

This is a static frontend prototype for a citation-first University Course Assistant RAG app.

## What is included

- Dashboard
- Onboarding/setup flow
- Course organization
- Course detail workspace
- Upload flow
- Upload metadata and processing stages
- Ask Assistant chat UI
- Multi-source retrieval UI for slides, textbooks, past papers, professor notes, and diagrams
- Citation highlighting with page, slide, question, and OCR source attribution
- Conversation memory controls for follow-up questions
- Confidence indicators and "I'm not sure" fallback behavior
- Feedback buttons for answer quality iteration
- Hybrid search, re-ranking, and evaluation metrics dashboard
- Analytics dashboard for most-asked questions and weak topics
- Right-side AI Agent popup for open-topic questions
- Citation/source preview panel
- Summarizer
- Quiz generator
- Flashcards
- Assignment helper
- Study planner
- Previous paper analyzer
- Progress tracking
- Settings and privacy
- Desktop sidebar navigation
- Mobile bottom navigation

## How to open

Open `index.html` in your browser.

No install step is required.

## Demo sign in

Use any platform button on the sign-in page:

- Google
- Facebook
- Microsoft
- GitHub

Or use the demo email:

- Email: `student@example.com`
- Password: `student123`

This is UI-only authentication for the prototype. Real login should be connected to a backend auth provider later.

## How to connect to a RAG backend later

The demo now includes a local RAG backend in `work/demo-server.js`.

Working endpoints:

- `POST /api/auth/signup` creates a local account with hashed password.
- `POST /api/auth/login` signs in with email and password.
- `POST /api/auth/provider` creates a demo social-provider session.
- `GET /api/auth/me` restores the current session from a cookie.
- `POST /api/auth/logout` clears the session.
- `GET /api/config` exposes safe frontend config such as Clerk publishable key.
- `POST /api/upload` saves files, extracts text/OCR, chunks content, creates local embeddings, and stores citations.
- `GET /api/files` lists uploaded/indexed course files.
- `POST /api/rag` searches uploaded course material and returns an answer with citations.
- `POST /api/agent` calls the general AI Agent API.
- `GET /api/models` returns selectable AI models.

Local storage:

- Users: `data/users.json`
- Sessions: `data/sessions.json`
- Uploaded files: `data/uploads/`
- Search index: `data/index.json`

## Clerk Authentication

The sign-in page supports Clerk as the primary authentication UI. Add your Clerk publishable key to `.env`:

```text
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

Restart the demo server after saving `.env`.

The local email/password login remains available as a fallback for offline demos.

Supported extraction:

- PDF text extraction
- DOCX text extraction
- PPT/PPTX and Office text extraction
- TXT/MD text extraction
- OCR for image files such as PNG/JPG/WebP/TIFF

Scanned PDFs may need a full PDF-to-image OCR pipeline later; the current backend detects PDFs with no embedded text and reports that OCR may be needed.

Required citation format:

```json
{
  "fileName": "DBMS Unit 2.pdf",
  "course": "DBMS",
  "page": 14,
  "slide": null,
  "excerpt": "Normalization is used to minimize redundancy..."
}
```

Important assistant rule:

```text
If the answer is not found in uploaded material, say:
"I couldn't find this in your course material."
```

## General AI Agent Popup

The AI Agent popup is for questions from any topic. It is intentionally separate from the citation-first course assistant.

- Ask Assistant: uses uploaded course material and citations.
- AI Agent popup: answers general questions from any topic.

The popup now calls a local backend route:

```text
POST /api/agent
```

## Add an AI API

Create a `.env` file in this project folder. Choose one provider.

OpenAI:

```text
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6
```

Gemini:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

OpenRouter free model selector:

```text
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=nvidia/nemotron-3-nano-30b-a3b:free
```

The AI popup includes these selectable OpenRouter models:

- `google/gemma-4-31b-it:free`
- `nvidia/nemotron-3-nano-30b-a3b:free`
- `nvidia/nemotron-3-ultra-550b-a55b:free`
- `poolside/laguna-m.1:free`
- `openai/gpt-oss-20b:free`

To edit the AI popup model list, update:

```text
config/ai-models.json
```

Then restart the demo server:

```powershell
node work\demo-server.js 5182
```

Keep `.env` private. Never paste your API key into frontend JavaScript.

You do not need `gemini-antigravity-cli` for this web app. That is a CLI tool; this app calls Gemini or OpenAI directly from the local backend route.
