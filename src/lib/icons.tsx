import type { ReactNode } from "react";
import {
  SiPython, SiOpenjdk, SiTypescript, SiReact, SiNextdotjs, SiFastapi, SiFlutter, SiFirebase,
  SiPostgresql, SiSupabase, SiRedis, SiLangchain, SiHuggingface, SiN8N, SiPytorch, SiTensorflow,
  SiGooglecloud, SiCloudflare, SiMongodb, SiVercel, SiKotlin, SiCplusplus, SiFlask, SiGoogleearthengine,
} from "react-icons/si";
import { Bot, ChartColumn, Database, DatabaseZap, Mic, Workflow } from "lucide-react";

/** One icon set for the whole site: Simple Icons for brands, Lucide (1.5 stroke) for concepts. */
export const SKILL_ICONS: Record<string, ReactNode> = {
  "LangChain / LangGraph": <SiLangchain />,
  "RAG pipelines": <Database strokeWidth={1.5} />,
  "Fine-tuning (Llama / Qwen)": <SiHuggingface />,
  "Retell AI voice agents": <Mic strokeWidth={1.5} />,
  "n8n agentic workflows": <SiN8N />,
  "TensorFlow / PyTorch": <SiPytorch />,
  "AI coding agents": <Bot strokeWidth={1.5} />,
  Kotlin: <SiKotlin />,
  "C / C++": <SiCplusplus />,
  SQL: <DatabaseZap strokeWidth={1.5} />,
  Flask: <SiFlask />,
  "Earth Engine": <SiGoogleearthengine />,
  Python: <SiPython />,
  Java: <SiOpenjdk />,
  "JS/TS": <SiTypescript />,
  React: <SiReact />,
  "Next.js": <SiNextdotjs />,
  FastAPI: <SiFastapi />,
  Flutter: <SiFlutter />,
  Firebase: <SiFirebase />,
  PostgreSQL: <SiPostgresql />,
  Supabase: <SiSupabase />,
  Redis: <SiRedis />,
  "Power BI": <ChartColumn strokeWidth={1.5} />,
  "ETL pipelines": <Workflow strokeWidth={1.5} />,
};

export const TICKER_ITEMS: { label: string; icon: ReactNode }[] = [
  { label: "Python", icon: <SiPython /> },
  { label: "TypeScript", icon: <SiTypescript /> },
  { label: "React", icon: <SiReact /> },
  { label: "Next.js", icon: <SiNextdotjs /> },
  { label: "FastAPI", icon: <SiFastapi /> },
  { label: "LangChain", icon: <SiLangchain /> },
  { label: "PyTorch", icon: <SiPytorch /> },
  { label: "TensorFlow", icon: <SiTensorflow /> },
  { label: "Flutter", icon: <SiFlutter /> },
  { label: "Firebase", icon: <SiFirebase /> },
  { label: "PostgreSQL", icon: <SiPostgresql /> },
  { label: "Supabase", icon: <SiSupabase /> },
  { label: "MongoDB", icon: <SiMongodb /> },
  { label: "Redis", icon: <SiRedis /> },
  { label: "n8n", icon: <SiN8N /> },
  { label: "Google Cloud", icon: <SiGooglecloud /> },
  { label: "Cloudflare", icon: <SiCloudflare /> },
  { label: "Vercel", icon: <SiVercel /> },
];
