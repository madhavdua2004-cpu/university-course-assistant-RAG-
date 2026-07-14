const viewTitles = {
  dashboard: "Dashboard",
  onboarding: "Setup",
  courses: "Courses",
  assistant: "Ask Assistant",
  uploads: "Uploads",
  summaries: "Summaries",
  quizzes: "Quizzes",
  flashcards: "Flashcards",
  assignments: "Assignment Helper",
  planner: "Study Planner",
  papers: "Previous Papers",
  progress: "Progress",
  settings: "Settings"
};

const title = document.querySelector("#view-title");
const authScreen = document.querySelector("#auth-screen");
const accountChooser = document.querySelector("#account-chooser");
const chooserTitle = document.querySelector("#chooser-title");
const chooserProviderMark = document.querySelector("#chooser-provider-mark");
const chooserClose = document.querySelector("#chooser-close");
const accountOptions = document.querySelectorAll(".account-option[data-account-email]");
const useAnotherAccount = document.querySelector("#use-another-account");
const appShell = document.querySelector("#app-shell");
const mobileNav = document.querySelector("#mobile-nav");
const agentLauncher = document.querySelector("#agent-launcher");
const agentPopup = document.querySelector("#agent-popup");
const agentClose = document.querySelector("#agent-close");
const agentNewChat = document.querySelector("#agent-new-chat");
const authForm = document.querySelector("#auth-form");
const authAccount = document.querySelector("#auth-account");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const togglePassword = document.querySelector("#toggle-password");
const authError = document.querySelector("#auth-error");
const clerkSignIn = document.querySelector("#clerk-sign-in");
const clerkStatus = document.querySelector("#clerk-status");
const signupButton = document.querySelector("#signup-button");
const logoutButton = document.querySelector("#logout-button");
const demoLoginButtons = document.querySelectorAll("[data-demo-login]");
const navButtons = document.querySelectorAll("[data-view]");
const jumpButtons = document.querySelectorAll("[data-view-jump]");
const views = document.querySelectorAll(".view");
const simpleExplainButton = document.querySelector("[data-simple-explain]");
const simpleExplain = document.querySelector("#simple-explain");
const feedbackButtons = document.querySelectorAll("[data-feedback]");
const ragForm = document.querySelector("#rag-form");
const ragQuestion = document.querySelector("#rag-question");
const courseSelect = document.querySelector("#course-select");
const chooseFiles = document.querySelector("#choose-files");
const courseFiles = document.querySelector("#course-files");
const uploadStatus = document.querySelector("#upload-status");
const uploadCourse = document.querySelector("#upload-course");
const uploadMaterialType = document.querySelector("#upload-material-type");
const uploadUnit = document.querySelector("#upload-unit");
const uploadedFiles = document.querySelector("#uploaded-files");
const contextCourse = document.querySelector("#context-course");
const contextUnit = document.querySelector("#context-unit");
const contextExam = document.querySelector("#context-exam");
const contextWeak = document.querySelector("#context-weak");
const dashboardHeroTitle = document.querySelector("#dashboard-hero-title");
const dashboardNextTask = document.querySelector("#dashboard-next-task");
const quizAverage = document.querySelector("#quiz-average");
const quizNote = document.querySelector("#quiz-note");
const examCountdown = document.querySelector("#exam-countdown");
const examNote = document.querySelector("#exam-note");
const bestFocus = document.querySelector("#best-focus");
const needsTime = document.querySelector("#needs-time");
const studyPlanList = document.querySelector("#study-plan-list");
const weakTopicList = document.querySelector("#weak-topic-list");
const quizProgress = document.querySelector("#quiz-progress");
const quizQuestion = document.querySelector("#quiz-question");
const quizOptions = document.querySelector("#quiz-options");
const showQuizExplanation = document.querySelector("#show-quiz-explanation");
const nextQuizQuestion = document.querySelector("#next-quiz-question");
const quizExplanation = document.querySelector("#quiz-explanation");
const summaryMaterial = document.querySelector("#summary-material");
const summaryFormat = document.querySelector("#summary-format");
const generateSummary = document.querySelector("#generate-summary");
const summaryPreview = document.querySelector("#summary-preview");
const quizType = document.querySelector("#quiz-type");
const quizDifficulty = document.querySelector("#quiz-difficulty");
const createAiQuiz = document.querySelector("#create-ai-quiz");
const generateQuizFlashcards = document.querySelector("#generate-quiz-flashcards");
const submitQuiz = document.querySelector("#submit-quiz");
const quizScore = document.querySelector("#quiz-score");
const flashcardTopic = document.querySelector("#flashcard-topic");
const flashcardQuestion = document.querySelector("#flashcard-question");
const flashcardAnswer = document.querySelector("#flashcard-answer");
const flashKnown = document.querySelector("#flash-known");
const flashReview = document.querySelector("#flash-review");
const flashDifficult = document.querySelector("#flash-difficult");
const flashNext = document.querySelector("#flash-next");
const flashGenerate = document.querySelector("#flash-generate");
const flashcardFeedback = document.querySelector("#flashcard-feedback");
const regeneratePlan = document.querySelector("#regenerate-plan");
const plannerGrid = document.querySelector("#planner-grid");
let clerkClient = null;
let selectedProvider = "google";
let currentQuizIndex = 0;
let selectedQuizAnswers = {};
let currentFlashcardIndex = 0;

const courseProfiles = {
  DBMS: {
    unit: "Unit 2: Normalization",
    exam: "14 days left",
    weak: "Dependencies, 3NF",
    hero: "Keep DBMS revision moving with cited answers and focused practice.",
    nextTask: "Next best task: revise normalization, then take a 10 question Unit 2 quiz.",
    quizAverage: "76%",
    quizNote: "DBMS needs attention",
    countdown: "14d",
    examNote: "DBMS final exam",
    bestFocus: "DBMS",
    needsTime: "Maths",
    tasks: ["Read DBMS Unit 2 summary", "Practice normalization MCQs", "Review difficult flashcards", "Analyze 2024 DBMS paper questions"],
    weakTopics: ["Normalization", "Transactions", "SQL joins", "Indexing"],
  },
  "Operating Systems": {
    unit: "Unit 4: Deadlocks",
    exam: "19 days left",
    weak: "Deadlocks, Scheduling",
    hero: "Keep OS revision moving with process, memory, and deadlock practice.",
    nextTask: "Next best task: revise deadlock prevention, then solve scheduling numericals.",
    quizAverage: "71%",
    quizNote: "OS deadlocks need practice",
    countdown: "19d",
    examNote: "OS final exam",
    bestFocus: "OS",
    needsTime: "DSA",
    tasks: ["Read OS deadlock notes", "Practice CPU scheduling sums", "Review memory management flashcards", "Analyze OS repeated paper questions"],
    weakTopics: ["Deadlocks", "CPU scheduling", "Paging", "Semaphores"],
  },
  DSA: {
    unit: "Unit 3: Trees and Graphs",
    exam: "23 days left",
    weak: "Recursion trees, Graph traversal",
    hero: "Keep DSA practice moving with solved patterns and spaced revision.",
    nextTask: "Next best task: revise recursion trees, then solve 8 graph traversal questions.",
    quizAverage: "69%",
    quizNote: "DSA practice needs attention",
    countdown: "23d",
    examNote: "DSA final exam",
    bestFocus: "DSA",
    needsTime: "Operating Systems",
    tasks: ["Solve recursion tree examples", "Practice BFS and DFS questions", "Review complexity flashcards", "Analyze 2024 DSA graph problems"],
    weakTopics: ["Recursion trees", "Graph traversal", "Dynamic programming", "Time complexity"],
  },
  Maths: {
    unit: "Unit 5: Eigen Values",
    exam: "11 days left",
    weak: "Eigen values, Matrices",
    hero: "Keep Maths revision moving with formulas, examples, and timed practice.",
    nextTask: "Next best task: revise eigen values, then solve 5 matrix problems.",
    quizAverage: "73%",
    quizNote: "Maths formulas need revision",
    countdown: "11d",
    examNote: "Maths final exam",
    bestFocus: "Maths",
    needsTime: "DBMS",
    tasks: ["Revise eigen value formulas", "Solve matrix practice set", "Review theorem flashcards", "Analyze repeated Maths questions"],
    weakTopics: ["Eigen values", "Matrices", "Differentiation", "Probability"],
  },
  "All Courses": {
    unit: "Mixed revision",
    exam: "11-23 days left",
    weak: "DSA, OS, Maths",
    hero: "Keep all course revision balanced with cited answers and focused practice.",
    nextTask: "Next best task: clear the weakest topic first, then take a mixed quiz.",
    quizAverage: "72%",
    quizNote: "Mixed revision needs attention",
    countdown: "11d",
    examNote: "Next exam across courses",
    bestFocus: "DBMS",
    needsTime: "DSA",
    tasks: ["Review one weak topic from each course", "Take a mixed 15 question quiz", "Revise due flashcards", "Check repeated questions from past papers"],
    weakTopics: ["Recursion trees", "Deadlocks", "Eigen values", "Normalization"],
  },
};

const quizBank = {
  DBMS: [
    {
      question: "Which normal form removes partial dependency?",
      options: ["1NF", "2NF", "3NF"],
      answer: "2NF",
      topic: "Normalization",
    },
    {
      question: "Which SQL command is used to remove duplicate rows from a result?",
      options: ["UNIQUE", "DISTINCT", "GROUP"],
      answer: "DISTINCT",
      topic: "SQL queries",
    },
    {
      question: "Which DBMS property keeps transactions all-or-nothing?",
      options: ["Atomicity", "Isolation", "Durability"],
      answer: "Atomicity",
      topic: "Transactions",
    },
  ],
  "Operating Systems": [
    {
      question: "Which condition means a process holds one resource while waiting for another?",
      options: ["Hold and wait", "No preemption", "Mutual exclusion"],
      answer: "Hold and wait",
      topic: "Deadlocks",
    },
    {
      question: "Which scheduler decides which ready process gets the CPU next?",
      options: ["Long-term scheduler", "Short-term scheduler", "Medium-term scheduler"],
      answer: "Short-term scheduler",
      topic: "CPU scheduling",
    },
    {
      question: "Paging mainly helps manage which OS area?",
      options: ["Memory", "Files", "Networking"],
      answer: "Memory",
      topic: "Memory management",
    },
  ],
  DSA: [
    {
      question: "Which traversal visits a node before its left and right subtrees?",
      options: ["Inorder", "Preorder", "Postorder"],
      answer: "Preorder",
      topic: "Trees",
    },
    {
      question: "Which data structure is commonly used for BFS?",
      options: ["Stack", "Queue", "Heap"],
      answer: "Queue",
      topic: "Graph traversal",
    },
    {
      question: "What is the average search time in a balanced binary search tree?",
      options: ["O(1)", "O(log n)", "O(n)"],
      answer: "O(log n)",
      topic: "Complexity",
    },
  ],
  Maths: [
    {
      question: "For a square matrix A, eigen values are found from which equation?",
      options: ["det(A - lambda I) = 0", "A + I = 0", "det(A) = 1"],
      answer: "det(A - lambda I) = 0",
      topic: "Eigen values",
    },
    {
      question: "What is the determinant of an identity matrix?",
      options: ["0", "1", "-1"],
      answer: "1",
      topic: "Matrices",
    },
    {
      question: "Probability values must lie between which range?",
      options: ["0 and 1", "-1 and 1", "1 and 100"],
      answer: "0 and 1",
      topic: "Probability",
    },
  ],
};

quizBank["All Courses"] = [quizBank.DBMS[0], quizBank["Operating Systems"][0], quizBank.DSA[1], quizBank.Maths[0]];

let flashcardDeck = [
  {
    topic: "DBMS - Normalization",
    question: "What is 3NF?",
    answer: "3NF is a normal form where non-key attributes depend only on the key, not on another non-key attribute.",
  },
];

function getCurrentQuizSet() {
  return quizBank[courseSelect?.value] || quizBank.DBMS;
}

function renderQuizQuestion() {
  const quizSet = getCurrentQuizSet();
  currentQuizIndex %= quizSet.length;
  const item = quizSet[currentQuizIndex];
  quizProgress.textContent = `Question ${currentQuizIndex + 1} of ${quizSet.length}`;
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = item.options
    .map((option) => {
      const checked = selectedQuizAnswers[currentQuizIndex] === option ? "checked" : "";
      return `<label><input type="radio" name="quiz-option" value="${escapeHtml(option)}" ${checked} /> ${escapeHtml(option)}</label>`;
    })
    .join("");
  quizExplanation.classList.add("is-hidden");
  quizExplanation.innerHTML = "";
  quizScore.classList.add("is-hidden");
  showQuizExplanation.disabled = false;
  showQuizExplanation.textContent = "Show explanation";
  nextQuizQuestion.textContent = currentQuizIndex === quizSet.length - 1 ? "Back to first" : "Next question";
  submitQuiz.classList.toggle("is-hidden", quizSet.length < 10);
}

async function explainCurrentQuizQuestion() {
  const item = getCurrentQuizSet()[currentQuizIndex];
  const selectedOption = document.querySelector('input[name="quiz-option"]:checked')?.value || "not selected";
  quizExplanation.classList.remove("is-hidden");
  quizExplanation.innerHTML = "<p>Asking AI for a simple explanation...</p>";
  showQuizExplanation.disabled = true;
  showQuizExplanation.textContent = "Explaining...";

  try {
    const prompt = `Explain this ${courseSelect.value} quiz question for a university student in simple language.\nQuestion: ${item.question}\nOptions: ${item.options.join(", ")}\nCorrect answer: ${item.answer}\nStudent selected: ${selectedOption}\nTopic: ${item.topic}\nKeep it short and exam-focused.`;
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: prompt, model: agentModel?.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI explanation failed.");
    quizExplanation.innerHTML = formatAnswer(data.answer);
  } catch (error) {
    quizExplanation.innerHTML = formatAnswer(`${error.message}\n\nCorrect answer: ${item.answer}. Try another AI model if the free model is busy.`);
  } finally {
    showQuizExplanation.disabled = false;
    showQuizExplanation.textContent = "Show explanation";
  }
}

async function callAi(prompt) {
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: prompt, model: agentModel?.value }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "AI request failed.");
  return data.answer || "";
}

function parseAiJson(text) {
  const cleaned = String(text)
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();
  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    return JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1));
  }
  const objectStart = cleaned.indexOf("{");
  const objectEnd = cleaned.lastIndexOf("}");
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
  }
  throw new Error("AI did not return valid JSON.");
}

function buildFallbackQuiz(courseName) {
  const base = quizBank[courseName] || quizBank.DBMS;
  return Array.from({ length: 10 }, (_, index) => {
    const item = base[index % base.length];
    return {
      question: `${item.question} (${index + 1})`,
      options: item.options,
      answer: item.answer,
      topic: item.topic,
    };
  });
}

function normalizeQuizItems(items, courseName) {
  const valid = Array.isArray(items)
    ? items
        .filter((item) => item?.question && Array.isArray(item.options) && item.options.length >= 3 && item.answer)
        .slice(0, 10)
        .map((item) => ({
          question: String(item.question),
          options: item.options.slice(0, 4).map(String),
          answer: item.options.map(String).includes(String(item.answer)) ? String(item.answer) : String(item.options[0]),
          topic: String(item.topic || courseName),
        }))
    : [];
  return valid.length >= 10 ? valid : buildFallbackQuiz(courseName);
}

async function generateAiSummary() {
  const courseName = courseSelect.value;
  generateSummary.disabled = true;
  generateSummary.textContent = "Generating...";
  summaryPreview.innerHTML = "<h3>Preview</h3><p>AI is generating your summary...</p>";

  try {
    const prompt = `Generate a ${summaryFormat.value} study summary for ${courseName}. Material: ${summaryMaterial.value}. Use clear university exam language. Include important points and a short source note.`;
    const answer = await callAi(prompt);
    summaryPreview.innerHTML = `
      <h3>Preview</h3>
      ${formatAnswer(answer)}
      <div class="citations"><button>${escapeHtml(courseName)} material - AI generated summary</button></div>
    `;
  } catch (error) {
    summaryPreview.innerHTML = `<h3>Preview</h3>${formatAnswer(error.message)}`;
  } finally {
    generateSummary.disabled = false;
    generateSummary.textContent = "Generate Summary";
  }
}

async function generateAiQuiz() {
  const courseName = courseSelect.value;
  createAiQuiz.disabled = true;
  createAiQuiz.textContent = "Creating...";
  quizExplanation.classList.remove("is-hidden");
  quizExplanation.innerHTML = "<p>AI is creating a 10 question quiz...</p>";

  try {
    const prompt = `Create exactly 10 ${quizDifficulty.value} ${quizType.value} quiz questions for ${courseName}. Return only a JSON array. Each item must be {"question":"...","options":["A","B","C","D"],"answer":"exact option text","topic":"..."}. Keep answers inside options.`;
    const answer = await callAi(prompt);
    quizBank[courseName] = normalizeQuizItems(parseAiJson(answer), courseName);
  } catch (error) {
    quizBank[courseName] = buildFallbackQuiz(courseName);
    quizExplanation.innerHTML = formatAnswer(`${error.message}\n\nUsing a local 10 question fallback quiz for now.`);
  } finally {
    selectedQuizAnswers = {};
    currentQuizIndex = 0;
    renderQuizQuestion();
    createAiQuiz.disabled = false;
    createAiQuiz.textContent = "Create Quiz";
  }
}

function submitCurrentQuiz() {
  const quizSet = getCurrentQuizSet();
  let score = 0;
  quizSet.forEach((item, index) => {
    if (selectedQuizAnswers[index] === item.answer) score += 1;
  });
  const marksOutOfTen = Math.round((score / quizSet.length) * 10);
  const unanswered = quizSet.length - Object.keys(selectedQuizAnswers).length;
  quizScore.classList.remove("is-hidden");
  quizScore.innerHTML = `<strong>Marks: ${marksOutOfTen}/10</strong><p>${score} correct out of ${quizSet.length}. ${unanswered ? `${unanswered} unanswered.` : "All questions attempted."}</p>`;
}

function buildFallbackFlashcards(courseName) {
  const topics = courseProfiles[courseName]?.weakTopics || courseProfiles.DBMS.weakTopics;
  return Array.from({ length: 50 }, (_, index) => {
    const topic = topics[index % topics.length];
    return {
      topic: `${courseName} - ${topic}`,
      question: `Quick revision ${index + 1}: What should you remember about ${topic}?`,
      answer: `${topic} is an important exam topic. Revise the definition, one example, and one common question pattern.`,
    };
  });
}

function normalizeFlashcards(cards, courseName) {
  const valid = Array.isArray(cards)
    ? cards
        .filter((card) => card?.question && card?.answer)
        .slice(0, 50)
        .map((card) => ({
          topic: String(card.topic || courseName),
          question: String(card.question),
          answer: String(card.answer),
        }))
    : [];
  return valid.length ? valid : buildFallbackFlashcards(courseName);
}

function renderFlashcard() {
  const card = flashcardDeck[currentFlashcardIndex % flashcardDeck.length];
  flashcardTopic.textContent = card.topic;
  flashcardQuestion.textContent = card.question;
  flashcardAnswer.textContent = card.answer;
  flashcardFeedback.classList.add("is-hidden");
  flashcardFeedback.innerHTML = "";
}

async function generateAiFlashcards() {
  const courseName = courseSelect.value;
  flashGenerate.disabled = true;
  flashGenerate.textContent = "Generating...";
  flashcardFeedback.classList.remove("is-hidden");
  flashcardFeedback.innerHTML = "<p>AI is generating up to 50 flashcards...</p>";

  try {
    const prompt = `Generate up to 50 revision flashcards for ${courseName}. Return only a JSON array. Each item must be {"topic":"...","question":"...","answer":"..."}. Keep answers concise and exam useful.`;
    const answer = await callAi(prompt);
    flashcardDeck = normalizeFlashcards(parseAiJson(answer), courseName);
  } catch (error) {
    flashcardDeck = buildFallbackFlashcards(courseName);
    flashcardFeedback.innerHTML = formatAnswer(`${error.message}\n\nUsing a local 50 flashcard fallback deck for now.`);
  } finally {
    currentFlashcardIndex = 0;
    renderFlashcard();
    flashGenerate.disabled = false;
    flashGenerate.textContent = "Generate 50 with AI";
  }
}

async function reviewFlashcard(status) {
  const card = flashcardDeck[currentFlashcardIndex % flashcardDeck.length];
  flashcardFeedback.classList.remove("is-hidden");
  flashcardFeedback.innerHTML = "<p>AI is preparing review advice...</p>";

  try {
    const prompt = `A student marked this flashcard as "${status}". Course: ${courseSelect.value}. Question: ${card.question}. Answer: ${card.answer}. Give short personalized next-step advice.`;
    const answer = await callAi(prompt);
    flashcardFeedback.innerHTML = formatAnswer(answer);
  } catch (error) {
    flashcardFeedback.innerHTML = formatAnswer(`${status}: ${error.message}`);
  }
}

function normalizePlan(items) {
  const valid = Array.isArray(items)
    ? items
        .filter((item) => item?.day && item?.task)
        .slice(0, 7)
        .map((item) => ({ day: String(item.day), task: String(item.task) }))
    : [];
  return valid.length
    ? valid
    : [
        { day: "Day 1", task: "Revise weak topics and make short notes" },
        { day: "Day 2", task: "Practice MCQs and review mistakes" },
        { day: "Day 3", task: "Solve previous paper questions" },
        { day: "Day 4", task: "Revise flashcards and attempt a mini test" },
      ];
}

async function regenerateStudyPlan() {
  const courseName = courseSelect.value;
  regeneratePlan.disabled = true;
  regeneratePlan.textContent = "Regenerating...";

  try {
    const profile = courseProfiles[courseName] || courseProfiles.DBMS;
    const prompt = `Create a practical study plan for ${courseName}. Exam context: ${profile.exam}. Weak focus: ${profile.weak}. Available time: 2 hours/day. Return only a JSON array of 4 to 7 items like {"day":"Day 1","task":"..."}.`;
    const answer = await callAi(prompt);
    const plan = normalizePlan(parseAiJson(answer));
    plannerGrid.innerHTML = plan.map((item) => `<article class="day-card"><strong>${escapeHtml(item.day)}</strong><p>${escapeHtml(item.task)}</p></article>`).join("");
  } catch (error) {
    const plan = normalizePlan([]);
    plannerGrid.innerHTML =
      plan.map((item) => `<article class="day-card"><strong>${escapeHtml(item.day)}</strong><p>${escapeHtml(item.task)}</p></article>`).join("") +
      `<article class="day-card"><strong>AI note</strong><p>${escapeHtml(error.message)}</p></article>`;
  } finally {
    regeneratePlan.disabled = false;
    regeneratePlan.textContent = "Regenerate Plan";
  }
}

function updateCourseContext(courseName = courseSelect?.value || "DBMS") {
  const profile = courseProfiles[courseName] || courseProfiles.DBMS;
  contextCourse.textContent = courseName;
  contextUnit.textContent = profile.unit;
  contextExam.textContent = profile.exam;
  contextWeak.textContent = profile.weak;
  dashboardHeroTitle.textContent = profile.hero;
  dashboardNextTask.textContent = profile.nextTask;
  quizAverage.textContent = profile.quizAverage;
  quizNote.textContent = profile.quizNote;
  examCountdown.textContent = profile.countdown;
  examNote.textContent = profile.examNote;
  bestFocus.textContent = profile.bestFocus;
  needsTime.textContent = profile.needsTime;
  studyPlanList.innerHTML = profile.tasks
    .map((task, index) => `<label><input type="checkbox" ${index === 0 ? "checked" : ""} /> ${task}</label>`)
    .join("");
  weakTopicList.innerHTML = profile.weakTopics.map((topic) => `<span>${topic}</span>`).join("");

  if (uploadCourse && Array.from(uploadCourse.options).some((option) => option.value === courseName)) {
    uploadCourse.value = courseName;
  }
  currentQuizIndex = 0;
  selectedQuizAnswers = {};
  renderQuizQuestion();
}

function enterDemo(user) {
  authScreen.classList.add("is-hidden");
  appShell.classList.remove("is-hidden");
  mobileNav.classList.remove("is-hidden");
  agentLauncher.classList.remove("is-hidden");
  if (user?.name) {
    document.querySelectorAll(".brand-subtitle").forEach((item) => {
      if (item.textContent.includes("study")) return;
      item.textContent = user.name;
    });
  }
  showView("dashboard");
}

function showView(viewId) {
  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  title.textContent = viewTitles[viewId] || "Course Assistant";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function authRequest(url, payload = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Authentication failed.");
  return data;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", resolve);
    script.addEventListener("error", () => reject(new Error("Could not load Clerk.")));
    document.head.append(script);
  });
}

async function initClerk() {
  try {
    const response = await fetch("/api/config");
    const config = await response.json();
    if (!config.clerkPublishableKey) {
      clerkStatus.textContent = "Add CLERK_PUBLISHABLE_KEY in .env to enable Clerk sign in.";
      return;
    }

    await loadScript("https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js");
    clerkClient = new window.Clerk(config.clerkPublishableKey);
    await clerkClient.load();

    if (clerkClient.user) {
      const clerkEmail = clerkClient.user.primaryEmailAddress?.emailAddress || "";
      clerkStatus.textContent = `Clerk is signed in as ${clerkEmail}. Choose what to do next.`;
      clerkSignIn.innerHTML = "";
      const controls = document.createElement("div");
      controls.className = "clerk-actions";
      controls.innerHTML = `
        <button class="primary-action" type="button" id="clerk-continue">Continue with this account</button>
        <button class="ghost-button" type="button" id="clerk-switch">Use different account</button>
      `;
      clerkSignIn.append(controls);
      document.querySelector("#clerk-continue").addEventListener("click", () => {
        enterDemo({
          name: clerkClient.user.fullName || clerkEmail || "Clerk User",
          email: clerkEmail,
          provider: "clerk",
        });
      });
      document.querySelector("#clerk-switch").addEventListener("click", async () => {
        await clerkClient.signOut();
        clerkStatus.textContent = "";
        clerkSignIn.innerHTML = "";
        clerkClient.mountSignIn(clerkSignIn, {
          afterSignInUrl: window.location.href,
          afterSignUpUrl: window.location.href,
        });
      });
      return;
    }

    clerkStatus.textContent = "";
    clerkClient.mountSignIn(clerkSignIn, {
      afterSignInUrl: window.location.href,
      afterSignUpUrl: window.location.href,
    });
  } catch (error) {
    clerkStatus.textContent = `${error.message} Local fallback is still available.`;
  }
}

async function loginWithEmail() {
  authError.textContent = "";
  try {
    const data = await authRequest("/api/auth/login", {
      email: authEmail.value,
      password: authPassword.value,
    });
    enterDemo(data.user);
  } catch (error) {
    authError.textContent = error.message;
  }
}

async function signupWithEmail() {
  authError.textContent = "";
  try {
    const data = await authRequest("/api/auth/signup", {
      email: authEmail.value,
      password: authPassword.value,
      name: authEmail.value.split("@")[0] || "Student",
    });
    enterDemo(data.user);
  } catch (error) {
    authError.textContent = error.message;
  }
}

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginWithEmail();
});

signupButton.addEventListener("click", signupWithEmail);

togglePassword.addEventListener("click", () => {
  const shouldShow = authPassword.type === "password";
  authPassword.type = shouldShow ? "text" : "password";
  togglePassword.textContent = shouldShow ? "Hide" : "Show";
});

authAccount.addEventListener("change", () => {
  if (authAccount.value !== "custom") {
    authEmail.value = authAccount.value;
  } else {
    authEmail.value = "";
    authEmail.focus();
  }
});

demoLoginButtons.forEach((button) => {
  button.addEventListener("click", () => {
    authError.textContent = "";
    const provider = button.textContent.replace("Use", "").replace("mail", "").trim().toLowerCase();
    selectedProvider = provider;
    chooserTitle.textContent = `Sign in with ${provider[0].toUpperCase()}${provider.slice(1)}`;
    chooserProviderMark.textContent = provider === "github" ? "GH" : provider[0].toUpperCase();
    accountChooser.classList.remove("is-hidden");
  });
});

chooserClose.addEventListener("click", () => {
  accountChooser.classList.add("is-hidden");
});

accountOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const email = button.dataset.accountEmail;
    authAccount.value = "custom";
    authEmail.value = email;
    authPassword.value = "";
    accountChooser.classList.add("is-hidden");
    authPassword.focus();
    authError.textContent = `Selected ${email}. Enter password and click Sign In, or Create Account.`;
  });
});

useAnotherAccount.addEventListener("click", () => {
  authAccount.value = "custom";
  authEmail.value = "";
  authPassword.value = "";
  accountChooser.classList.add("is-hidden");
  authEmail.focus();
  authError.textContent = `Enter the ${selectedProvider} email ID you want to use.`;
});

logoutButton.addEventListener("click", async () => {
  if (clerkClient?.user) {
    await clerkClient.signOut();
  }
  await fetch("/api/auth/logout", { method: "POST" });
  appShell.classList.add("is-hidden");
  mobileNav.classList.add("is-hidden");
  agentLauncher.classList.add("is-hidden");
  agentPopup.classList.add("is-hidden");
  authScreen.classList.remove("is-hidden");
});

async function restoreSession() {
  try {
    const response = await fetch("/api/auth/me");
    if (!response.ok) return;
    const data = await response.json();
    if (data.user) enterDemo(data.user);
  } catch {
    // Stay on sign-in screen when offline or unauthenticated.
  }
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.viewJump));
});

simpleExplainButton?.addEventListener("click", () => {
  simpleExplain?.classList.toggle("is-hidden");
});

feedbackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    feedbackButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    button.textContent = button.dataset.feedback === "up" ? "Thanks for the feedback" : "Marked for improvement";
  });
});

function renderCitations(citations) {
  if (!citations?.length) return "";
  return `
    <div class="citations">
      ${citations
        .map(
          (citation) =>
            `<button title="${escapeHtml(citation.excerpt)}">${escapeHtml(citation.fileName)} - page ${citation.page}, chunk ${citation.chunk}</button>`
        )
        .join("")}
    </div>
  `;
}

function renderRagAnswer(data) {
  const confidenceLabel = data.confidence > 0.22 ? "High confidence" : data.confidence > 0.12 ? "Medium confidence" : "Low confidence";
  return `
    <div class="answer-meta">
      <span class="confidence ${data.confidence > 0.22 ? "high" : ""}">${confidenceLabel}</span>
      <span>${data.metrics?.searchedChunks || 0} chunks searched</span>
      <span>${escapeHtml(data.metrics?.retrieval || "hybrid search")}</span>
    </div>
    ${formatAnswer(data.answer)}
    ${renderCitations(data.citations)}
    <div class="answer-actions">
      <button data-simple-explain>Explain like I'm confused</button>
      <button data-feedback="up">Thumbs up</button>
      <button data-feedback="down">Thumbs down</button>
    </div>
  `;
}

ragForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = ragQuestion.value.trim();
  if (!question) return;

  const studentMessage = document.createElement("div");
  studentMessage.className = "message student";
  studentMessage.textContent = question;

  const assistantMessage = document.createElement("div");
  assistantMessage.className = "message assistant";
  assistantMessage.innerHTML = "<p>Searching uploaded course material...</p>";

  const form = event.currentTarget;
  form.before(studentMessage, assistantMessage);
  ragQuestion.value = "";

  try {
    const response = await fetch("/api/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, course: courseSelect.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Course search failed.");
    assistantMessage.innerHTML = renderRagAnswer(data);
  } catch (error) {
    assistantMessage.innerHTML = formatAnswer(error.message);
  }
});

async function refreshUploadedFiles() {
  try {
    const response = await fetch("/api/files");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load files.");
    if (!data.files.length) return;
    uploadedFiles.innerHTML = data.files
      .slice()
      .reverse()
      .map(
        (file) => `
          <div class="file-row">
            <span>${escapeHtml(file.originalName)} <small>${escapeHtml(file.course)} · ${escapeHtml(file.materialType)} · ${file.chunkCount} chunks</small></span>
            <span class="status ${file.ready ? "ready" : "indexing"}">${file.ready ? "Ready" : "Needs text"}</span>
          </div>
        `
      )
      .join("");
  } catch {
    // Keep the placeholder row if file loading fails.
  }
}

chooseFiles.addEventListener("click", () => courseFiles.click());

courseFiles.addEventListener("change", async () => {
  if (!courseFiles.files.length) return;
  const formData = new FormData();
  [...courseFiles.files].forEach((file) => formData.append("files", file));
  formData.append("course", uploadCourse.value);
  formData.append("materialType", uploadMaterialType.value);
  formData.append("unit", uploadUnit.value);

  uploadStatus.textContent = `Uploading and indexing ${courseFiles.files.length} file(s)...`;
  chooseFiles.disabled = true;
  try {
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed.");
    const chunks = data.uploaded.reduce((sum, file) => sum + file.chunks, 0);
    uploadStatus.textContent = `Indexed ${data.uploaded.length} file(s), ${chunks} chunks ready for citations.`;
    await refreshUploadedFiles();
  } catch (error) {
    uploadStatus.textContent = error.message;
  } finally {
    chooseFiles.disabled = false;
    courseFiles.value = "";
  }
});

const agentForm = document.querySelector("#agent-form");
const agentQuestion = document.querySelector("#agent-question");
const agentModel = document.querySelector("#agent-model");
const agentChat = document.querySelector("#agent-chat");
const quickPrompts = document.querySelectorAll("[data-agent-prompt]");

async function loadAgentModels() {
  try {
    const response = await fetch("/api/models");
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.models)) return;

    agentModel.innerHTML = "";
    data.models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.label;
      option.selected = model.id === data.defaultModel;
      agentModel.append(option);
    });
  } catch {
    // Keep the built-in fallback option if config loading fails.
  }
}

function toggleAgent(open) {
  const shouldOpen = typeof open === "boolean" ? open : agentPopup.classList.contains("is-hidden");
  agentPopup.classList.toggle("is-hidden", !shouldOpen);
  agentLauncher.setAttribute("aria-expanded", String(shouldOpen));
}

function addAgentMessage(text, role) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.innerHTML = text;
  agentChat.append(message);
  agentChat.scrollTop = agentChat.scrollHeight;
}

function startNewAgentChat() {
  agentChat.innerHTML = `
    <div class="message assistant">
      <p>New chat started. Ask me anything from any topic.</p>
    </div>
  `;
  agentQuestion.value = "";
  agentQuestion.focus();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAnswer(text) {
  return `<p>${escapeHtml(text).replace(/\n/g, "<br />")}</p>`;
}

async function answerGeneralQuestion(question) {
  addAgentMessage(escapeHtml(question), "student");
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message assistant";
  loadingMessage.innerHTML = "<p>Thinking...</p>";
  agentChat.append(loadingMessage);
  agentChat.scrollTop = agentChat.scrollHeight;

  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, model: agentModel.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI request failed.");
    loadingMessage.innerHTML = formatAnswer(data.answer);
  } catch (error) {
    const needsKey = /Missing .*API_KEY/i.test(error.message);
    const hint = needsKey
      ? "\n\nAdd the matching provider key in .env, then restart the demo server. For the selected free models, use OPENROUTER_API_KEY."
      : "\n\nTry another model from the dropdown. Free models can be rate-limited or temporarily unavailable.";
    loadingMessage.innerHTML = formatAnswer(`${error.message}${hint}`);
  }
}

agentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = agentQuestion.value.trim();
  if (!question) return;
  answerGeneralQuestion(question);
  agentQuestion.value = "";
});

quickPrompts.forEach((button) => {
  button.addEventListener("click", () => {
    toggleAgent(true);
    agentQuestion.value = button.dataset.agentPrompt;
    answerGeneralQuestion(button.dataset.agentPrompt);
    agentQuestion.value = "";
  });
});

agentLauncher.addEventListener("click", () => toggleAgent());
agentClose.addEventListener("click", () => toggleAgent(false));
agentNewChat.addEventListener("click", startNewAgentChat);
courseSelect.addEventListener("change", () => updateCourseContext());
quizOptions.addEventListener("change", () => {
  selectedQuizAnswers[currentQuizIndex] = document.querySelector('input[name="quiz-option"]:checked')?.value;
});
showQuizExplanation.addEventListener("click", explainCurrentQuizQuestion);
nextQuizQuestion.addEventListener("click", () => {
  currentQuizIndex += 1;
  renderQuizQuestion();
});
submitQuiz.addEventListener("click", submitCurrentQuiz);
generateSummary.addEventListener("click", generateAiSummary);
createAiQuiz.addEventListener("click", generateAiQuiz);
generateQuizFlashcards.addEventListener("click", () => {
  generateAiFlashcards();
  showView("flashcards");
});
flashGenerate.addEventListener("click", generateAiFlashcards);
flashKnown.addEventListener("click", () => reviewFlashcard("Known"));
flashReview.addEventListener("click", () => reviewFlashcard("Needs Review"));
flashDifficult.addEventListener("click", () => reviewFlashcard("Difficult"));
flashNext.addEventListener("click", () => {
  currentFlashcardIndex += 1;
  renderFlashcard();
});
regeneratePlan.addEventListener("click", regenerateStudyPlan);
updateCourseContext();
renderFlashcard();
loadAgentModels();
refreshUploadedFiles();
initClerk();
