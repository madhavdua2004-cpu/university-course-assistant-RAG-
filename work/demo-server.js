const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { formidable } = require("formidable");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const officeParser = require("officeparser");
const { createWorker } = require("tesseract.js");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || process.env.PORT || 5173);
const envPaths = [path.join(root, ".env"), path.join(root, ".env.local")];
const modelConfigPath = path.join(root, "config", "ai-models.json");
const dataDir = path.join(root, "data");
const uploadDir = path.join(dataDir, "uploads");
const indexPath = path.join(dataDir, "index.json");
const usersPath = path.join(dataDir, "users.json");
const sessionsPath = path.join(dataDir, "sessions.json");
const modelConfig = JSON.parse(fs.readFileSync(modelConfigPath, "utf8"));
const openRouterModels = new Set(modelConfig.models.map((model) => model.id));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, JSON.stringify({ files: [], chunks: [] }, null, 2));
}
if (!fs.existsSync(usersPath)) {
  const demoSalt = crypto.randomBytes(16).toString("hex");
  const demoHash = crypto.pbkdf2Sync("student123", demoSalt, 120000, 64, "sha512").toString("hex");
  fs.writeFileSync(
    usersPath,
    JSON.stringify(
      {
        users: [
          {
            id: crypto.randomUUID(),
            name: "Demo Student",
            email: "student@example.com",
            salt: demoSalt,
            passwordHash: demoHash,
            provider: "email",
            createdAt: new Date().toISOString(),
          },
        ],
      },
      null,
      2
    )
  );
}
if (!fs.existsSync(sessionsPath)) {
  fs.writeFileSync(sessionsPath, JSON.stringify({ sessions: [] }, null, 2));
}

for (const envPath of envPaths) {
  if (!fs.existsSync(envPath)) continue;
  const envText = fs.readFileSync(envPath, "utf8");
  envText.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function loadIndex() {
  return JSON.parse(fs.readFileSync(indexPath, "utf8"));
}

function saveIndex(index) {
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

function loadUsers() {
  return JSON.parse(fs.readFileSync(usersPath, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

function loadSessions() {
  return JSON.parse(fs.readFileSync(sessionsPath, "utf8"));
}

function saveSessions(sessions) {
  fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, passwordHash };
}

function verifyPassword(password, user) {
  const hash = crypto.pbkdf2Sync(password, user.salt, 120000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function parseCookies(request) {
  const header = request.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");
        return [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))];
      })
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
  };
}

function createSession(response, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = loadSessions();
  sessions.sessions = sessions.sessions.filter((session) => new Date(session.expiresAt) > new Date());
  sessions.sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });
  saveSessions(sessions);
  response.setHeader("Set-Cookie", `uca_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`);
}

function getSessionUser(request) {
  const token = parseCookies(request).uca_session;
  if (!token) return null;
  const sessions = loadSessions();
  const session = sessions.sessions.find((item) => item.token === token && new Date(item.expiresAt) > new Date());
  if (!session) return null;
  const users = loadUsers();
  return users.users.find((user) => user.id === session.userId) || null;
}

function clearSession(request, response) {
  const token = parseCookies(request).uca_session;
  if (token) {
    const sessions = loadSessions();
    sessions.sessions = sessions.sessions.filter((session) => session.token !== token);
    saveSessions(sessions);
  }
  response.setHeader("Set-Cookie", "uca_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

async function handleSignup(request, response) {
  const payload = JSON.parse(await readBody(request));
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const name = String(payload.name || "Student").trim();
  if (!email || !password || password.length < 6) {
    sendJson(response, 400, { error: "Use a valid email and a password with at least 6 characters." });
    return;
  }
  const users = loadUsers();
  if (users.users.some((user) => user.email === email)) {
    sendJson(response, 409, { error: "An account already exists for this email." });
    return;
  }
  const passwordData = hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    ...passwordData,
    provider: "email",
    createdAt: new Date().toISOString(),
  };
  users.users.push(user);
  saveUsers(users);
  createSession(response, user.id);
  sendJson(response, 200, { user: publicUser(user) });
}

async function handleLogin(request, response) {
  const payload = JSON.parse(await readBody(request));
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const users = loadUsers();
  const user = users.users.find((item) => item.email === email);
  if (!user || !verifyPassword(password, user)) {
    sendJson(response, 401, { error: "Invalid email or password." });
    return;
  }
  createSession(response, user.id);
  sendJson(response, 200, { user: publicUser(user) });
}

async function handleProviderLogin(request, response) {
  const payload = JSON.parse(await readBody(request));
  const provider = String(payload.provider || "demo").toLowerCase();
  const requestedEmail = String(payload.email || "").trim().toLowerCase();
  const email = requestedEmail && requestedEmail.includes("@") ? requestedEmail : `${provider}.student@example.com`;
  const users = loadUsers();
  let user = users.users.find((item) => item.email === email);
  if (!user) {
    const passwordData = hashPassword(crypto.randomBytes(18).toString("hex"));
    user = {
      id: crypto.randomUUID(),
      name: `${provider[0].toUpperCase()}${provider.slice(1)} Student`,
      email,
      ...passwordData,
      provider,
      createdAt: new Date().toISOString(),
    };
    users.users.push(user);
    saveUsers(users);
  }
  createSession(response, user.id);
  sendJson(response, 200, { user: publicUser(user) });
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function embedText(text) {
  const vector = new Array(128).fill(0);
  tokenize(text).forEach((token) => {
    const hash = crypto.createHash("md5").update(token).digest();
    const index = hash[0] % vector.length;
    vector[index] += 1;
  });
  const norm = Math.hypot(...vector) || 1;
  return vector.map((value) => value / norm);
}

function cosineSimilarity(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function keywordScore(queryTokens, text) {
  const tokens = new Set(tokenize(text));
  if (!queryTokens.length) return 0;
  const hits = queryTokens.filter((token) => tokens.has(token)).length;
  return hits / queryTokens.length;
}

function chunkText(text, metadata) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  const size = 900;
  const overlap = 160;
  for (let start = 0; start < cleanText.length; start += size - overlap) {
    const content = cleanText.slice(start, start + size).trim();
    if (content.length < 80) continue;
    const chunkIndex = chunks.length;
    chunks.push({
      id: crypto.randomUUID(),
      content,
      embedding: embedText(content),
      metadata: {
        ...metadata,
        chunk: chunkIndex + 1,
        page: metadata.page || Math.floor(start / 2500) + 1,
      },
    });
  }
  return chunks;
}

async function extractPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(buffer);
  return {
    text: parsed.text || "",
    note: parsed.text ? "PDF text extracted" : "No embedded PDF text found; OCR may be needed for scanned pages.",
  };
}

async function extractDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return { text: result.value || "", note: "DOCX text extracted" };
}

async function extractOffice(filePath) {
  const text = await officeParser.parseOfficeAsync(filePath);
  return { text: text || "", note: "Office document text extracted" };
}

async function extractImage(filePath) {
  const worker = await createWorker("eng");
  try {
    const result = await worker.recognize(filePath);
    return { text: result.data.text || "", note: "Image OCR extracted" };
  } finally {
    await worker.terminate();
  }
}

async function extractText(filePath, originalName) {
  const extension = path.extname(originalName).toLowerCase();
  if (extension === ".pdf") return extractPdf(filePath);
  if (extension === ".docx") return extractDocx(filePath);
  if ([".pptx", ".ppt", ".doc"].includes(extension)) return extractOffice(filePath);
  if ([".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"].includes(extension)) return extractImage(filePath);
  if ([".txt", ".md", ".csv"].includes(extension)) {
    return { text: fs.readFileSync(filePath, "utf8"), note: "Plain text extracted" };
  }
  return { text: "", note: `Unsupported file type: ${extension}` };
}

function parseUpload(request) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 50 * 1024 * 1024,
  });
  return new Promise((resolve, reject) => {
    form.parse(request, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

function fieldValue(fields, name, fallback = "") {
  const value = fields[name];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

async function handleUpload(request, response) {
  const { fields, files } = await parseUpload(request);
  const uploadedFiles = Object.values(files).flat();
  const index = loadIndex();
  const results = [];

  for (const file of uploadedFiles) {
    const originalName = file.originalFilename || file.newFilename;
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
    const savedPath = path.join(uploadDir, safeName);
    fs.renameSync(file.filepath, savedPath);

    const course = fieldValue(fields, "course", "DBMS");
    const materialType = fieldValue(fields, "materialType", "Lecture notes");
    const unit = fieldValue(fields, "unit", "");
    const extracted = await extractText(savedPath, originalName);
    const fileRecord = {
      id: crypto.randomUUID(),
      originalName,
      storedName: safeName,
      path: savedPath,
      course,
      materialType,
      unit,
      note: extracted.note,
      uploadedAt: new Date().toISOString(),
    };
    const chunks = chunkText(extracted.text, {
      fileId: fileRecord.id,
      fileName: originalName,
      course,
      materialType,
      unit,
      sourceType: path.extname(originalName).toLowerCase(),
    });

    index.files.push({
      ...fileRecord,
      chunkCount: chunks.length,
      textLength: extracted.text.length,
      ready: chunks.length > 0,
    });
    index.chunks.push(...chunks);
    results.push({
      fileName: originalName,
      course,
      chunks: chunks.length,
      textLength: extracted.text.length,
      note: extracted.note,
      ready: chunks.length > 0,
    });
  }

  saveIndex(index);
  sendJson(response, 200, { uploaded: results });
}

function buildRagAnswer(question, matches) {
  if (!matches.length) {
    return "I couldn't find this in your course material.";
  }

  const top = matches[0];
  const points = matches.slice(0, 3).map((match) => {
    const sentence = match.content.split(/[.!?]/).find((item) => item.trim().length > 40) || match.content;
    return sentence.trim();
  });
  return `Based on your uploaded material, ${points.join(" ")}${top.score < 0.18 ? "\n\nI'm not fully sure because the retrieval confidence is low." : ""}`;
}

function handleRagSearch(payload) {
  const question = String(payload.question || "").trim();
  const course = String(payload.course || "").trim();
  const index = loadIndex();
  const queryEmbedding = embedText(question);
  const queryTokens = tokenize(question);
  const candidateChunks = index.chunks.filter((chunk) => !course || course === "All Courses" || chunk.metadata.course === course);

  const matches = candidateChunks
    .map((chunk) => {
      const semantic = cosineSimilarity(queryEmbedding, chunk.embedding);
      const keyword = keywordScore(queryTokens, chunk.content);
      const score = semantic * 0.65 + keyword * 0.35;
      return { ...chunk, score, semantic, keyword };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const confidentMatches = matches.filter((match) => match.score > 0.08);
  return {
    answer: buildRagAnswer(question, confidentMatches),
    confidence: confidentMatches[0]?.score || 0,
    citations: confidentMatches.map((match) => ({
      fileName: match.metadata.fileName,
      course: match.metadata.course,
      page: match.metadata.page,
      chunk: match.metadata.chunk,
      materialType: match.metadata.materialType,
      excerpt: match.content.slice(0, 220),
      score: Number(match.score.toFixed(3)),
    })),
    metrics: {
      searchedChunks: candidateChunks.length,
      returnedChunks: confidentMatches.length,
      retrieval: "hybrid keyword + local embeddings",
      reranking: "score sort by semantic and keyword match",
    },
  };
}

http
  .createServer(async (request, response) => {
    let urlPath = decodeURIComponent(request.url.split("?")[0]);

    if (request.method === "POST" && urlPath === "/api/auth/signup") {
      try {
        await handleSignup(request, response);
      } catch (error) {
        sendJson(response, 500, { error: error.message || "Signup failed." });
      }
      return;
    }

    if (request.method === "POST" && urlPath === "/api/auth/login") {
      try {
        await handleLogin(request, response);
      } catch (error) {
        sendJson(response, 500, { error: error.message || "Login failed." });
      }
      return;
    }

    if (request.method === "POST" && urlPath === "/api/auth/provider") {
      try {
        await handleProviderLogin(request, response);
      } catch (error) {
        sendJson(response, 500, { error: error.message || "Provider login failed." });
      }
      return;
    }

    if (request.method === "GET" && urlPath === "/api/auth/me") {
      const user = getSessionUser(request);
      if (!user) {
        sendJson(response, 401, { user: null });
        return;
      }
      sendJson(response, 200, { user: publicUser(user) });
      return;
    }

    if (request.method === "POST" && urlPath === "/api/auth/logout") {
      clearSession(request, response);
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "POST" && urlPath === "/api/agent") {
      try {
        const payload = JSON.parse(await readBody(request));
        const question = String(payload.question || "").trim();
        const requestedModel = String(payload.model || "").trim();
        const modelIsOpenRouter = openRouterModels.has(requestedModel);
        const provider = modelIsOpenRouter ? "openrouter" : (process.env.AI_PROVIDER || "openai").toLowerCase();

        if (!question) {
          sendJson(response, 400, { error: "Question is required." });
          return;
        }

        if (provider === "openrouter" && !process.env.OPENROUTER_API_KEY) {
          sendJson(response, 503, {
            error: "Missing OPENROUTER_API_KEY. Add it to a local .env file, then restart the demo server.",
          });
          return;
        }

        if (requestedModel && !modelIsOpenRouter && provider === "openrouter") {
          sendJson(response, 400, { error: "That model is not in the allowed OpenRouter model list." });
          return;
        }

        if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
          sendJson(response, 503, {
            error: "Missing GEMINI_API_KEY. Add it to a local .env file, then restart the demo server.",
          });
          return;
        }

        if (provider === "openai" && !process.env.OPENAI_API_KEY) {
          sendJson(response, 503, {
            error: "Missing OPENAI_API_KEY. Add it to a local .env file, then restart the demo server.",
          });
          return;
        }

        const instructions =
          "You are a helpful general AI agent inside a university study app. Answer open-topic questions clearly. If the user asks about uploaded course material, tell them to use the citation-first Ask Assistant.";

        if (provider === "openrouter") {
          const model = modelIsOpenRouter
            ? requestedModel
            : process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free";
          const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://127.0.0.1",
              "X-Title": "University Course Assistant",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: instructions },
                { role: "user", content: question },
              ],
            }),
          });

          const data = await aiResponse.json();
          if (!aiResponse.ok) {
            const isRateLimited = aiResponse.status === 429;
            sendJson(response, aiResponse.status, {
              error: isRateLimited
                ? `The selected OpenRouter model is rate-limited or temporarily unavailable: ${model}.`
                : data.error?.message || `The OpenRouter API request failed for ${model}.`,
            });
            return;
          }

          sendJson(response, 200, {
            answer:
              data.choices?.[0]?.message?.content ||
              "I received an OpenRouter response, but could not read its text output.",
            model,
          });
          return;
        }

        if (provider === "gemini") {
          const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
          const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${instructions}\n\nUser question: ${question}` }],
                  },
                ],
              }),
            }
          );

          const data = await aiResponse.json();
          if (!aiResponse.ok) {
            sendJson(response, aiResponse.status, {
              error: data.error?.message || "The Gemini API request failed.",
            });
            return;
          }

          sendJson(response, 200, {
            answer:
              data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() ||
              "I received a Gemini response, but could not read its text output.",
          });
          return;
        }

        const aiResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-5.6",
            instructions,
            input: question,
          }),
        });

        const data = await aiResponse.json();
        if (!aiResponse.ok) {
          sendJson(response, aiResponse.status, {
            error: data.error?.message || "The OpenAI API request failed.",
          });
          return;
        }

        sendJson(response, 200, {
          answer:
            data.output_text ||
            data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text ||
            "I received an OpenAI response, but could not read its text output.",
        });
      } catch (error) {
        sendJson(response, 500, { error: error.message || "AI agent failed." });
      }
      return;
    }

    if (request.method === "GET" && urlPath === "/api/models") {
      sendJson(response, 200, modelConfig);
      return;
    }

    if (request.method === "GET" && urlPath === "/api/config") {
      sendJson(response, 200, {
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
      });
      return;
    }

    if (request.method === "POST" && urlPath === "/api/upload") {
      try {
        await handleUpload(request, response);
      } catch (error) {
        sendJson(response, 500, { error: error.message || "Upload failed." });
      }
      return;
    }

    if (request.method === "GET" && urlPath === "/api/files") {
      const index = loadIndex();
      sendJson(response, 200, { files: index.files });
      return;
    }

    if (request.method === "POST" && urlPath === "/api/rag") {
      try {
        const payload = JSON.parse(await readBody(request));
        const result = handleRagSearch(payload);
        sendJson(response, 200, result);
      } catch (error) {
        sendJson(response, 500, { error: error.message || "RAG search failed." });
      }
      return;
    }

    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.resolve(root, `.${urlPath}`);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8",
      });
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1");
