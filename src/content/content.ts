export const IDENTITY = {
  name: "Arvapalli Venkata Sai Akhil",
  short: "Akhil",
  location: "Hyderabad, Telangana",
  timezone: "Asia/Kolkata",
  phone: "+91 9888171118",
  positioning:
    "Full-Stack AI Developer. I build working software around AI/ML: RAG pipelines, LLM tools and voice agents.",
  roles: ["Full-Stack AI Developer", "Voice-Agent Builder", "Photographer"] as const,
} as const;

export const LINKS = {
  github: "https://github.com/akhil-arvapalli",
  linkedin: "https://www.linkedin.com/in/venkata-sai-akhil-arvapalli",
  email: "akhil.arvapallii@gmail.com",
  resume: "/akhil-resume.pdf",
  photoPortfolio: "https://photos.app.goo.gl/UPjCkmE5aNkyGZZz9",
  instagram: "https://www.instagram.com/drsyalu/",
  instagramHandle: "@drsyalu",
  leetcode: "https://leetcode.com/u/akhil_arvapalli/",
  photoBlurb:
    "Away from the keyboard I'm behind a camera, chasing light, motion and the one frame that makes you look twice.",
} as const;

export const EDUCATION = {
  degree: "B.Tech CSE (AI/ML)",
  college: "CMR College of Engineering and Technology",
  period: "Sept 2023 – June 2027",
  grad: "2027",
  cgpa: "8.27",
  coursework: [
    "Data Structures & Algorithms",
    "Machine Learning",
    "Artificial Intelligence",
    "NLP",
    "Computer Vision & Robotics",
    "Image Processing",
    "DBMS",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Data Analytics",
    "Nature Inspired Computing",
    "Knowledge Representation & Reasoning",
    "Automata Theory",
    "Compiler Design",
    "OOP",
  ],
} as const;

export const EXPERIENCE = [
  {
    company: "DarexAI",
    role: "Full-Stack AI Intern",
    period: "Jan 2026 – Jul 2026",
    place: "Remote · startup",
    links: [{ label: "Completion certificate", href: "https://drive.google.com/file/d/1eOwau9UeU0bykPmCQrNEGEH9sI99QCuI/view?usp=sharing" }],
    points: [
      "Engineered and deployed production AI voice-calling agents for a Canada-based restaurant client with Retell AI, a complete restaurant automation system built from scratch: reservations, takeaway orders and customer interactions by voice, backed by a database for order and session tracking, wired into n8n workflows and Cloudflare",
      "Architected modular agentic AI workflows and enterprise-level automations in n8n, connecting disparate APIs to streamline operations and data sync",
      "Developed and fine-tuned specialized RAG pipelines to improve retrieval, response accuracy and production performance for domain-specific use cases",
    ],
  },
  {
    company: "Throttle Theory",
    role: "Full-Stack Developer · Freelance",
    period: "2026",
    place: "Hyderabad",
    links: [
      { label: "Live site", href: "https://throttle-theory-theta.vercel.app/" },
      { label: "GitHub", href: "https://github.com/akhil-arvapalli/throttle_theory" },
    ],
    points: [
      "Designed and built a cinematic, scroll-driven marketing website for a premium automotive garage brand with Vite, React 18, TypeScript, Three.js (React Three Fiber) and GSAP ScrollTrigger for immersive 3D, motion-based storytelling",
      "Deployed and maintained the production site on Vercel, handling end-to-end delivery from architecture to live hosting",
    ],
  },
] as const;

export const FLAGSHIP = {
  title: "CascadeGuard",
  tagline: "Real-time hallucination detection for multi-step agentic RAG",
  status: "In active development",
  detail: "Under active development; not yet published or released.",
  repo: "https://github.com/akhil-arvapalli/Cascade-Guard",
  pipeline: ["Query", "Retriever", "LLM step", "Verifier", "Answer"],
} as const;

export const PROJECTS = [
  {
    slug: "physicslens",
    name: "PhysicsLens",
    kind: "AI",
    blurb: "Fine-tuned LLM plus a rule-based Newtonian engine that solves mechanics problems and draws labeled free-body diagrams.",
    github: "https://github.com/Programeowr/PhysicsLens",
    demo: "https://physics-lens.vercel.app/",
    tags: ["Ollama", "FastAPI", "SymPy", "Pydantic", "Node.js"],
    points: [
      "Fine-tuned open-source LLM (Ollama, Llama/Qwen) converts natural-language physics questions into structured representations for automated analysis",
      "Hybrid AI + deterministic pipeline: LLM parsing feeds a rule-based Newtonian engine covering inclined planes, friction, Atwood pulleys and projectile motion, generating labeled SVG free-body diagrams",
      "Modular backend in Python, FastAPI and SymPy with Pydantic schema validation, exposing REST APIs for JSON/SVG output, plus a Node.js frontend for problem submission and visualization",
    ],
  },
  {
    slug: "silent-link",
    name: "Silent Link",
    kind: "Mobile · DL",
    blurb: "Offline sign-language app for Android: gestures to text and text or speech to sign animations, all on-device.",
    github: "https://github.com/akhil-arvapalli/silent_link",
    tags: ["TensorFlow Lite", "MediaPipe", "LSTM", "Android"],
    points: [
      "Real-time two-way communication for deaf and speech-impaired users with no internet dependency: gesture to text, and text/speech to sign-language GIF animations",
      "Gesture recognition with an LSTM over MediaPipe hand-landmark tracking, running locally through optimized TensorFlow Lite models, under 100 ms latency",
      "Second place at CONVERGENCE 2K25, VNRVJIET's national technical symposium",
    ],
  },
  {
    slug: "flood-risk",
    name: "FloodRisk AI",
    kind: "GIS",
    blurb: "3D flood and evacuation simulator plus an Earth Engine flood-susceptibility backend with A* evacuation routing.",
    github: "https://github.com/akhil-arvapalli/gis_flood_evac",
    tags: ["Next.js", "Three.js", "Flask", "Earth Engine", "Power BI"],
    points: [
      "Two engines in one platform: a Flask + Google Earth Engine backend computing multi-criteria (MCDA) flood susceptibility with A* routing, and a Next.js + Three.js frontend simulating flood dynamics in 3D",
      "Draw an area of interest on a Leaflet map, pull real elevation (Open-Meteo SRTM 90 m) and OpenStreetMap building footprints, then watch the flood advance over 3D terrain",
      "Scalable ETL on Google Earth Engine for geospatial ingestion and Power BI dashboards of flood-risk zones and severity to support evacuation planning",
    ],
  },
  {
    slug: "anchor",
    name: "Anchor",
    kind: "AI · Health",
    blurb: "A memory-powered health navigator for caregivers of aging parents, so a family never repeats their story to a new doctor.",
    github: "https://github.com/akhil-arvapalli/devnovate-Authenticated",
    tags: ["Hindsight memory", "FastAPI", "React", "Vite"],
    points: [
      "Persistent medical memory: symptoms, medications, labs and doctor notes retained across weeks with timestamps, recalled during reasoning",
      "A \"catch\" engine that surfaces contradictions across time (new medication + existing medication + symptom) that a stateless chatbot would miss, plus temporal recall for questions like what changed since last week",
      "One-page doctor-visit brief generated from memory; safety by design: flags interactions, never gives dosage advice, cites sources, redacts PII",
    ],
  },
  {
    slug: "geomark",
    name: "GeoMark",
    kind: "Mobile · GIS",
    blurb: "A Flutter GIS annotation toolkit.",
    github: "https://github.com/akhil-arvapalli/GeoMark",
    tags: ["Flutter", "Dart", "GIS"],
    points: ["GIS annotation toolkit built as a Flutter (Dart) application"],
  },
  {
    slug: "sentinel",
    name: "SENTINEL",
    kind: "Academic",
    blurb: "Satellite terrain classification (urban, agricultural, range, forest) behind a tactical-HUD interface.",
    github: "https://github.com/akhil-arvapalli/Academic_projects/tree/HEAD/SENTINEL",
    tags: ["TensorFlow/Keras", "Flask", "React", "Recharts"],
    points: [
      "Satellite Environmental Terrain Intelligence Evaluation: a deep-learning classifier sorting imagery into 4 terrain types",
      "Enhanced CNN v2 with batch normalization, data augmentation and early stopping",
      "Military-themed dark HUD with animated React components and Recharts visualizations",
    ],
  },
  {
    slug: "depviz",
    name: "DepViz",
    kind: "Academic",
    blurb: "NLP sentence-structure visualizer: head-dependent arcs rendered in an animated interactive canvas.",
    github: "https://github.com/akhil-arvapalli/Academic_projects/tree/HEAD/nlp",
    tags: ["spaCy", "NLTK", "FastAPI", "React", "TypeScript"],
    points: [
      "Full-stack tool that parses sentences with spaCy and NLTK and draws the dependency tree as a custom SVG arc graph with sequential animation",
      "Single-parser mode and a side-by-side compare mode, plus a color-coded POS/dependency badge table",
    ],
  },
] as const;

export const HACKATHONS = [
  {
    title: "CONVERGENCE 2K25",
    result: "2nd place",
    period: "Feb 2025",
    detail: "VNRVJIET's national technical symposium. Built Silent Link, an offline DL-based assistive communication system with gesture recognition.",
    href: "https://drive.google.com/file/d/1WjdM23EQQloWkWFwMR2JGyAoDRRikJmv/view",
  },
  {
    title: "Build With India",
    result: "Top 5,000 / 25,000",
    period: "2025",
    detail: "Ranked among the top 5,000 of 25,000 teams at the Google Office Finale for innovation and problem-solving.",
    href: "https://drive.google.com/file/d/1n8pAaTAG01s_ihdOlK-jdldG_N5OAwXo/view",
  },
  {
    title: "PromptWars",
    result: "Participant",
    period: "Mar 2026 · Hyderabad",
    detail: "Google for Developers × Hack2Skill. Took part in an AI-assisted rapid prototyping challenge, using Google Antigravity to develop a solution under time constraints.",
    href: "",
  },
] as const;

export const CERTIFICATIONS = [
  { name: "Gen AI Leader", issuer: "Google", href: "https://drive.google.com/file/d/1FXSkuXKEAjNQuV9f6fw3iwPEZl8u1rxA/view?usp=sharing" },
  { name: "Associate Cloud Engineer", issuer: "Google Cloud", href: "https://drive.google.com/file/d/117pNhF9dUThAqlzccjB7OztwMvXlZmMf/view?usp=sharing" },
  { name: "Programming, Data Structures & Algorithms Using Python", issuer: "NPTEL · Jan–Mar 2024", href: "https://drive.google.com/file/d/1nQYYa83yJoA2E26J9HfMFbtz3KVWYwyA/view" },
  { name: "IBM Certifications", issuer: "Cognitive Class", href: "https://drive.google.com/drive/folders/1O-YV3eJ6HeIbomjNr8mdRWE5FPAvNBGX?usp=drive_link" },
  { name: "Networking Certifications", issuer: "Cisco Networking Academy", href: "https://drive.google.com/drive/folders/1E-SPC0LU0F5pDwaZWT0KqsgKVSFZ6UXg?usp=sharing" },
  { name: "Aerial Drone Technology Workshop", issuer: "Mahindra University × TiHAN IITH", href: "" },
] as const;

export const SKILLS_AI = [
  "LangChain / LangGraph",
  "RAG pipelines",
  "Fine-tuning (Llama / Qwen)",
  "Retell AI voice agents",
  "n8n agentic workflows",
  "TensorFlow / PyTorch",
  "AI coding agents",
] as const;

export const SKILLS_FULLSTACK = [
  "Python",
  "Java",
  "Kotlin",
  "C / C++",
  "JS/TS",
  "SQL",
  "React",
  "Next.js",
  "Flutter",
  "FastAPI",
  "Flask",
  "Firebase",
  "PostgreSQL",
  "Supabase",
  "Redis",
  "Power BI",
  "ETL pipelines",
  "Earth Engine",
] as const;

export const MARQUEE_PHRASES = [
  "Full-Stack AI Developer · Voice-Agent Builder · RAG Pipelines · Photographer",
] as const;


export const CONTACT = {
  headline: "Let's build something smart.",
  copyEmail: true,
} as const;

export const STATS = [
  { to: PROJECTS.length, label: "projects built" },
  { to: HACKATHONS.length, label: "hackathons" },
  { to: 8.27, label: "CGPA" },
  { to: 2027, label: "graduating", plain: true },
] as const;


export const SKILL_NOTES: Record<string, string> = {
  "LangChain / LangGraph": "orchestration for CascadeGuard",
  "RAG pipelines": "built + fine-tuned in production",
  "Fine-tuning (Llama / Qwen)": "PhysicsLens parser, domain RAG",
  "Retell AI voice agents": "live restaurant calls at DarexAI",
  "n8n agentic workflows": "enterprise automations, API glue",
  "TensorFlow / PyTorch": "CNNs, ANN classification, inference",
  Python: "the glue for everything AI",
  Java: "OOP + coursework",
  "JS/TS": "daily driver",
  React: "this site, FloodRisk AI front-end",
  "Next.js": "SSR + app router",
  FastAPI: "APIs for every model",
  Flutter: "when it needs to be an app",
  Firebase: "auth + firestore, done",
  PostgreSQL: "boring, reliable, loved",
  Supabase: "postgres with superpowers",
  Redis: "caching + queues",
  "Power BI": "dashboards people actually open",
  Kotlin: "native Android work",
  "C / C++": "DSA + systems coursework",
  SQL: "queries that behave",
  Flask: "lightweight Python services",
  "Earth Engine": "satellite ETL for flood risk",
  "AI coding agents": "Gemini + Claude in the workflow",
  "ETL pipelines": "data in, sense out",
};
