import { useState, createContext, useContext } from "react";
import ementaPdf from "@/imports/ementa_disciplina_simulada-1.pdf";

// ── A11y context ───────────────────────────────────────────────────────────────
type FontSize = "sm" | "md" | "lg";
interface A11y { dark: boolean; contrast: boolean; eyecare: boolean; fontSize: FontSize }
const A11yCtx = createContext<A11y>({ dark: false, contrast: false, eyecare: false, fontSize: "md" });
function useA11y() { return useContext(A11yCtx); }

// ── Theme helpers ──────────────────────────────────────────────────────────────
function useTheme() {
  const a = useA11y();
  if (a.contrast && a.dark) return {
    bg: "#000", card: "#0a0a0a", border: "#fff", text: "#fff", muted: "#ccc",
    green: "#00ff88", greenBg: "#002010", greenText: "#00ff88",
    accent: "#00ff88", chip: "#001a0c",
  };
  if (a.contrast) return {
    bg: "#000", card: "#111", border: "#fff", text: "#fff", muted: "#ccc",
    green: "#00e676", greenBg: "#003020", greenText: "#00e676",
    accent: "#00e676", chip: "#002010",
  };
  if (a.dark) return {
    bg: "#121827", card: "#1e2840", border: "#2d3a52", text: "#e2e8f0", muted: "#8896aa",
    green: "#2dd884", greenBg: "#0e2e1e", greenText: "#2dd884",
    accent: "#2dd884", chip: "#0e2e1e",
  };
  return {
    bg: "#f1f5f9", card: "#fff", border: "#e2e8f0", text: "#1e293b", muted: "#64748b",
    green: "#1a6b48", greenBg: "#e8f5ef", greenText: "#1a6b48",
    accent: "#1a6b48", chip: "#e8f5ef",
  };
}

function basePx(fs: FontSize) { return fs === "sm" ? 12 : fs === "lg" ? 16 : 14; }

// ── Types ─────────────────────────────────────────────────────────────────────
type Page = "inicio" | "portal" | "ensino" | "atividades" | "estagios" | "pesquisas" | "forum" | "duvidas" | "ajuda";

interface SavedActivity {
  id: string;
  tipo: TipoAtiv;
  titulo: string;
  categoria: string;
  instituicao: string;
  data: string;
  horas: number;
  status: "Pendente";
  fileUrl?: string;
  fileName?: string;
  registradoEm: string;
}
type AtivView = "menu" | "registro" | "consulta";
type DisTab = "disciplinas" | "notas" | "faltas";
type ConsultaTab = "extensao" | "complementares";
type TipoAtiv = "extensao" | "complementares";

// ── Data ──────────────────────────────────────────────────────────────────────
const DISCIPLINAS = [
  { id: "001", nome: "Bases Computacionais da Ciência", horario: "Ter/Qui 10h–12h", sala: "L401-2", creditos: 4, professor: "Carlos Mendes", nota: "A" },
  { id: "028", nome: "Processamento da Informação", horario: "Seg/Qua 08h–10h", sala: "L402-1", creditos: 6, professor: "Ana Ribeiro", nota: "B+" },
  { id: "006", nome: "Cálculo Diferencial e Integral I", horario: "Seg/Qua/Sex 14h–16h", sala: "S207", creditos: 6, professor: "Roberto Alves", nota: "C" },
  { id: "014", nome: "Funções de Uma Variável", horario: "Ter/Qui 16h–18h", sala: "S104", creditos: 4, professor: "Juliana Costa", nota: "B" },
];

const GRADE = [
  { dia: "Seg", aulas: ["08h – Processamento da Informação", "14h – Cálculo Diferencial I"] },
  { dia: "Ter", aulas: ["10h – Bases Computacionais", "16h – Funções de Uma Variável"] },
  { dia: "Qua", aulas: ["08h – Processamento da Informação", "14h – Cálculo Diferencial I"] },
  { dia: "Qui", aulas: ["10h – Bases Computacionais", "16h – Funções de Uma Variável"] },
  { dia: "Sex", aulas: ["14h – Cálculo Diferencial I"] },
];

const ULTIMAS_ATIV = [
  { nome: "Representação no DCE", horas: 36, data: "01/08/2024", status: "Aprovado" },
  { nome: "Curso de Python para Dados", horas: 40, data: "10/01/2025", status: "Aprovado" },
  { nome: "IC – Redes Neurais Aplicadas", horas: 80, data: "01/02/2025", status: "Reprovado" },
];

const AVISOS = [
  { titulo: "Prazo de trancamento de disciplina", data: "28/08/2025", urgente: true },
  { titulo: "Resultado do auxílio moradia — 2º ciclo", data: "25/08/2025", urgente: false },
  { titulo: "Manutenção no sistema SIGAA — dom. 01/09", data: "22/08/2025", urgente: false },
];

const ARQUIVOS = [
  { nome: "Ementa da Disciplina", tamanho: "124 KB", data: "15/02/2025" },
  { nome: "Plano de Ensino", tamanho: "340 KB", data: "15/02/2025" },
  { nome: "Cronograma de Aulas", tamanho: "89 KB", data: "20/02/2025" },
  { nome: "Lista 1 - Exercícios", tamanho: "256 KB", data: "01/03/2025" },
];

const ATIV_EXTENSAO = [
  { nome: "Monitoria de Cálculo I", cat: "Monitoria e Tutoria", periodo: "01/03/2025 – 30/06/2025", horas: 60, status: "Aprovado" },
  { nome: "Semana da Computação UFABC", cat: "Evento Cultural ou Científico", periodo: "10/05/2025 – 14/05/2025", horas: 20, status: "Aprovado" },
  { nome: "Oficina de Robótica Educacional", cat: "Projeto Social / Voluntariado", periodo: "05/07/2025 – 05/07/2025", horas: 8, status: "Pendente" },
];

const ATIV_COMP = [
  { nome: "Representação no DCE", cat: "Representação Estudantil", periodo: "01/06/2024 – 01/08/2024", horas: 36, status: "Aprovado" },
  { nome: "Curso de Python para Dados", cat: "Curso de Extensão", periodo: "01/12/2024 – 10/01/2025", horas: 40, status: "Aprovado" },
];

const CATEGORIAS = [
  "Monitoria e Tutoria", "Evento Cultural ou Científico", "Projeto Social / Voluntariado",
  "Iniciação Científica", "Representação Estudantil", "Curso de Extensão", "Estágio", "Outros",
];

const ACESSO_RAPIDO = [
  { label: "Atestado", color: "#6366f1", bg: "#eef2ff" },
  { label: "Histórico", color: "#f59e0b", bg: "#fefce8" },
  { label: "Calendário", color: "#ef4444", bg: "#fef2f2" },
  { label: "Biblioteca", color: "#1a6b48", bg: "#e8f5ef" },
  { label: "Bolsas", color: "#f59e0b", bg: "#fefce8" },
  { label: "Ouvidoria", color: "#6366f1", bg: "#eef2ff" },
];

// ── Icon ──────────────────────────────────────────────────────────────────────
function Icon({ d, size = 18, sw = 1.8 }: { d: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const P = {
  home: "m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6",
  grid: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  book: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  clip: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z",
  bell: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  dl: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
  folder: "M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z",
  task: "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75",
  plus: "M12 4.5v15m7.5-7.5h-15",
  search: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
  edit: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125",
  chevD: "m19.5 8.25-7.5 7.5-7.5-7.5",
  chevU: "m4.5 15.75 7.5-7.5 7.5 7.5",
  back: "M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18",
  doc: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  logout: "M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15",
  info: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
  check: "m4.5 12.75 6 6 9-13.5",
  clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  briefcase: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006-3.75 1.5m-10.5-1.5-3.75-1.5m18 0-3.75 1.5m-10.5 0 3.75 1.5m-3.75-1.5V8.706c0-.978.704-1.807 1.672-1.963A47.678 47.678 0 0 1 12 6.75c2.291 0 4.545.16 6.75.487 1.037.164 1.75.995 1.75 2.007v3.4m-17.25 0 3.75 1.5",
  question: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
  help: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  forum: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  sun: "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
  eye: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  moon: "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z",
};

// ── Toggle switch ──────────────────────────────────────────────────────────────
function Toggle({ on, onChange, accent }: { on: boolean; onChange: () => void; accent?: string }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={on}
      style={{ background: on ? (accent ?? "#1a6b48") : "#cbd5e1", transition: "background 0.2s" }}
      className="relative w-9 h-5 rounded-full shrink-0">
      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
        style={{ left: on ? "calc(100% - 1rem - 2px)" : "2px" }} />
    </button>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function Donut({ faltam, total, color, label }: { faltam: number; total: number; color: string; label: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const progress = ((total - faltam) / total) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${progress} ${circ - progress}`}
            strokeLinecap="round" transform="rotate(-90 44 44)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold leading-none" style={{ color }}>{faltam}h</span>
          <span className="text-xs text-slate-400 mt-0.5">faltam</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({ icon, title, badge, defaultOpen, children }: { icon: string; title: string; badge?: number; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const t = useTheme();
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", background: t.card }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "transparent", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: t.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.green }}>
            <Icon d={icon} size={15} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{title}</span>
            {badge !== undefined && (
              <span style={{ fontSize: "0.75em", background: t.bg, color: t.muted, padding: "1px 8px", borderRadius: 99 }}>{badge}</span>
            )}
          </div>
        </div>
        <span style={{ color: t.muted }}><Icon d={open ? P.chevU : P.chevD} size={15} /></span>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${t.border}`, background: t.dark ? t.card : "#f8fafc", padding: "12px 16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function Badge({ s }: { s: string }) {
  const map: Record<string, [string, string]> = {
    Aprovado: ["#e8f5ef", "#1a6b48"],
    Reprovado: ["#fef2f2", "#ef4444"],
    Pendente: ["#fefce8", "#d97706"],
    Entregue: ["#e8f5ef", "#1a6b48"],
  };
  const [bg, color] = map[s] ?? ["#f1f5f9", "#64748b"];
  return <span style={{ fontSize: "0.75em", fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: bg, color }}>{s}</span>;
}

// ── Nota color ────────────────────────────────────────────────────────────────
function notaColors(n: string): [string, string] {
  if (n === "A") return ["#ecfdf5", "#065f46"];
  if (n === "B+") return ["#e8f5ef", "#1a6b48"];
  if (n === "B") return ["#eff6ff", "#1d4ed8"];
  if (n === "C+") return ["#fffbeb", "#92400e"];
  if (n === "C") return ["#fff7ed", "#c2410c"];
  return ["#fef2f2", "#b91c1c"];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: INÍCIO
// ═══════════════════════════════════════════════════════════════════════════════
function PageInicio({ onGotoAtiv }: { onGotoAtiv: () => void }) {
  const [disTab, setDisTab] = useState<DisTab>("disciplinas");
  const [selected, setSelected] = useState<typeof DISCIPLINAS[0] | null>(null);
  const t = useTheme();

  if (selected) return <DisciplinaDetail d={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Welcome banner */}
      <div style={{ background: "#1a6b48", borderRadius: 12, padding: "20px 24px", color: "#fff" }}>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", opacity: 0.6, textTransform: "uppercase", marginBottom: 4 }}>Bem-vindo(a)</p>
        <p style={{ fontSize: "1.3em", fontWeight: 700 }}>Aluno X</p>
        <p style={{ fontSize: "0.85em", opacity: 0.7, marginTop: 2 }}>Ciência da Computação · 5º período</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { h: "76h", label: "Horas Complementares", color: "#1a6b48", bg: "#e8f5ef", icon: P.check },
          { h: "80h", label: "Horas de Extensão", color: "#ef4444", bg: "#fef2f2", icon: P.clock },
        ].map(({ h, label, color, bg, icon }) => (
          <div key={label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
              <Icon d={icon} size={18} sw={2} />
            </div>
            <div>
              <p style={{ fontSize: "1.5em", fontWeight: 700, color }}>{h}</p>
              <p style={{ fontSize: "0.75em", color: t.muted }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Atividades banner */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: t.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.green, flexShrink: 0 }}>
          <Icon d={P.doc} size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.875em", fontWeight: 600, color: t.text }}>Atividades Complementares e de Extensão</p>
          <p style={{ fontSize: "0.75em", color: t.muted, marginTop: 2 }}>
            Cadastre e acompanhe suas <span style={{ color: t.green }}>horas complementares</span> e <span style={{ color: t.green }}>atividades de extensão</span>.
          </p>
          <button onClick={onGotoAtiv} style={{ fontSize: "0.75em", color: t.green, fontWeight: 700, marginTop: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Acessar ›
          </button>
        </div>
      </div>

      {/* Últimas atividades */}
      <div>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 12 }}>Últimas Atividades</p>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          {ULTIMAS_ATIV.map((a, i) => (
            <div key={a.nome} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: i ? `1px solid ${t.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "Reprovado" ? "#ef4444" : "#1a6b48", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{a.nome}</p>
                  <p style={{ fontSize: "0.75em", color: t.muted }}>{a.horas}h · {a.data}</p>
                </div>
              </div>
              <Badge s={a.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Minhas disciplinas */}
      <div>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 12 }}>Minhas Disciplinas</p>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, padding: "0 16px" }}>
            {(["disciplinas", "notas", "faltas"] as DisTab[]).map((tab) => (
              <button key={tab} onClick={() => setDisTab(tab)}
                style={{ padding: "12px 16px", fontSize: "0.875em", fontWeight: 500, borderBottom: disTab === tab ? `2px solid ${t.green}` : "2px solid transparent", color: disTab === tab ? t.green : t.muted, background: "none", cursor: "pointer", textTransform: "capitalize" }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {DISCIPLINAS.map((d, i) => {
            const [nbg, nc] = notaColors(d.nota);
            return (
              <button key={d.id} onClick={() => setSelected(d)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: i ? `1px solid ${t.border}` : "none", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.75em", fontFamily: "monospace", color: t.muted, width: 32 }}>{d.id}</span>
                  <div>
                    <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{d.nome}</p>
                    <p style={{ fontSize: "0.75em", color: t.muted }}>{d.horario} · {d.sala}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {disTab === "notas" && <span style={{ fontSize: "0.75em", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: nbg, color: nc }}>{d.nota}</span>}
                  {disTab === "faltas" && <span style={{ fontSize: "0.75em", color: t.muted }}>0/{d.creditos * 12}</span>}
                  <span style={{ fontSize: "0.75em", color: t.muted }}>{d.creditos}cr</span>
                  <span style={{ color: t.muted }}><Icon d={P.chevD} size={13} sw={2} /></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: PORTAL
// ═══════════════════════════════════════════════════════════════════════════════
function PagePortal() {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#1a6b48", borderRadius: 12, padding: "20px 24px", color: "#fff" }}>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", opacity: 0.6, textTransform: "uppercase", marginBottom: 4 }}>Portal do Aluno</p>
        <p style={{ fontSize: "1.1em", fontWeight: 700 }}>Bem-vindo, Aluno X</p>
        <p style={{ fontSize: "0.8em", opacity: 0.7, marginTop: 2 }}>RA 11202300000 · Ciência da Computação</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
          {[{ v: "3,2", l: "CR Geral" }, { v: "26", l: "Créditos" }, { v: "4º", l: "Quadrimestre" }].map(({ v, l }) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
              <p style={{ fontSize: "1.2em", fontWeight: 700 }}>{v}</p>
              <p style={{ fontSize: "0.75em", opacity: 0.7 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${t.border}` }}>
          <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase" }}>Avisos Recentes</p>
          <button style={{ fontSize: "0.75em", color: t.green, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Ver todos</button>
        </div>
        {AVISOS.map((a, i) => (
          <div key={a.titulo} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderTop: i ? `1px solid ${t.border}` : "none" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.urgente ? "#ef4444" : t.border, marginTop: 6, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.875em", color: t.text }}>{a.titulo}</p>
              <p style={{ fontSize: "0.75em", color: t.muted, marginTop: 2 }}>{a.data}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 12 }}>Acesso Rápido</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {ACESSO_RAPIDO.map((item) => (
            <button key={item.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2em", fontWeight: 700, color: item.color }}>
                {item.label[0]}
              </div>
              <p style={{ fontSize: "0.75em", fontWeight: 500, color: t.text }}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISCIPLINE DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function DisciplinaDetail({ d, onBack }: { d: typeof DISCIPLINAS[0]; onBack: () => void }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#1a6b48", borderRadius: 12, padding: "16px 20px", color: "#fff" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: "0.75em", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>
          <Icon d={P.back} size={14} /> Voltar
        </button>
        <p style={{ fontWeight: 700, fontSize: "1em" }}>{d.nome}</p>
        <p style={{ fontSize: "0.75em", opacity: 0.6, fontFamily: "monospace", marginTop: 2 }}>MCTA{d.id}-13</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: t.border, borderRadius: 12, overflow: "hidden", border: `1px solid ${t.border}` }}>
        {[["PROFESSOR", d.professor], ["HORÁRIO", d.horario], ["SALA", d.sala], ["CRÉDITOS", `${d.creditos} créditos`]].map(([l, v]) => (
          <div key={l} style={{ background: t.card, padding: "12px 16px" }}>
            <p style={{ fontSize: "0.65em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 2 }}>{l}</p>
            <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{v}</p>
          </div>
        ))}
      </div>

      <Accordion icon={P.folder} title="Arquivos da Disciplina" badge={ARQUIVOS.length} defaultOpen>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.75em", color: "#64748b" }}>{ARQUIVOS.length} arquivo(s)</span>
          </div>
          {ARQUIVOS.map((arq) => (
            <div key={arq.nome} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${useTheme().border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#ef4444" }}><Icon d={P.doc} size={16} /></span>
                <div>
                  <p style={{ fontSize: "0.875em", color: useTheme().text }}>{arq.nome}</p>
                  <p style={{ fontSize: "0.7em", color: "#64748b" }}>PDF · {arq.tamanho} · {arq.data}</p>
                </div>
              </div>
              <a href={ementaPdf} download={`${arq.nome}.pdf`} onClick={(e) => e.stopPropagation()}
                style={{ width: 32, height: 32, borderRadius: 8, background: useTheme().greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: useTheme().green, textDecoration: "none", flexShrink: 0 }}>
                <Icon d={P.dl} size={14} />
              </a>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 12, background: useTheme().greenBg, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ color: useTheme().green, flexShrink: 0 }}><Icon d={P.info} size={14} /></span>
            <p style={{ fontSize: "0.75em", color: useTheme().green }}>
              Clique no ícone de download para salvar qualquer arquivo da disciplina.
            </p>
          </div>
        </div>
      </Accordion>

      <Accordion icon={P.task} title="Tarefas" badge={3}>
        {[
          { titulo: `Lista 3 — ${d.nome}`, prazo: "12/09/2025", status: "Pendente" },
          { titulo: `Lista 2 — ${d.nome}`, prazo: "25/08/2025", status: "Entregue" },
          { titulo: "Exercício 1", prazo: "10/08/2025", status: "Entregue" },
        ].map((task) => (
          <div key={task.titulo} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${useTheme().border}` }}>
            <div>
              <p style={{ fontSize: "0.875em", color: useTheme().text }}>{task.titulo}</p>
              <p style={{ fontSize: "0.75em", color: "#64748b", marginTop: 2 }}>Prazo: {task.prazo}</p>
            </div>
            <Badge s={task.status} />
          </div>
        ))}
      </Accordion>

      <Accordion icon={P.book} title="Conteúdo Programático">
        <ol>
          {["Fundamentos e conceitos básicos", "Métodos e técnicas principais", "Aplicações práticas", "Avaliação e exercícios", "Projeto final integrador"].map((c, i) => (
            <li key={i} style={{ fontSize: "0.875em", color: useTheme().text, padding: "6px 0", borderBottom: `1px solid ${useTheme().border}` }}>
              {i + 1}. {c}
            </li>
          ))}
        </ol>
      </Accordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ENSINO
// ═══════════════════════════════════════════════════════════════════════════════
function PageEnsino() {
  const [selected, setSelected] = useState<typeof DISCIPLINAS[0] | null>(null);
  const t = useTheme();
  if (selected) return <DisciplinaDetail d={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#1a6b48", borderRadius: 12, padding: "20px 24px", color: "#fff" }}>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", opacity: 0.6, textTransform: "uppercase", marginBottom: 4 }}>Quadrimestre Atual</p>
        <p style={{ fontSize: "1.3em", fontWeight: 700 }}>2025.2 · Ago – Dez</p>
        <p style={{ fontSize: "0.85em", opacity: 0.7, marginTop: 2 }}>4 disciplinas · 26 créditos</p>
      </div>

      <div>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 12 }}>Minhas Disciplinas</p>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          {DISCIPLINAS.map((d, i) => (
            <button key={d.id} onClick={() => setSelected(d)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderTop: i ? `1px solid ${t.border}` : "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: t.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.green, fontSize: "0.75em", fontWeight: 700, flexShrink: 0 }}>
                {d.id}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{d.nome}</p>
                <p style={{ fontSize: "0.75em", color: t.muted, marginTop: 2 }}>{d.horario} · {d.sala}</p>
              </div>
              <span style={{ fontSize: "0.75em", color: t.muted }}>{d.creditos}cr</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 12 }}>Grade da Semana</p>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
          {GRADE.map((g, i) => (
            <div key={g.dia} style={{ display: "flex", gap: 16, padding: "12px 16px", borderTop: i ? `1px solid ${t.border}` : "none" }}>
              <span style={{ fontSize: "0.75em", fontWeight: 700, color: t.muted, width: 32, paddingTop: 2, flexShrink: 0 }}>{g.dia}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {g.aulas.map((a) => (
                  <span key={a} style={{ fontSize: "0.75em", background: t.greenBg, color: t.green, padding: "6px 12px", borderRadius: 8, fontWeight: 500 }}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ATIVIDADES
// ═══════════════════════════════════════════════════════════════════════════════
function RegistroForm({ onBack, onSave }: { onBack: () => void; onSave: (a: SavedActivity) => void }) {
  const [tipo, setTipo] = useState<TipoAtiv>("extensao");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ titulo: "", categoria: "", instituicao: "", data: "", horas: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const t = useTheme();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleSubmit() {
    const fileUrl = file ? URL.createObjectURL(file) : undefined;
    onSave({
      id: Date.now().toString(),
      tipo,
      titulo: form.titulo || "Sem título",
      categoria: form.categoria || "Outros",
      instituicao: form.instituicao || "—",
      data: form.data || "—",
      horas: Number(form.horas) || 0,
      status: "Pendente",
      fileUrl,
      fileName: file?.name,
      registradoEm: new Date().toLocaleDateString("pt-BR"),
    });
    setSubmitted(true);
  }

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "64px 0" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.green }}>
        <Icon d={P.check} size={32} sw={2} />
      </div>
      <p style={{ fontSize: "1.1em", fontWeight: 700, color: t.text }}>Atividade registrada!</p>
      <p style={{ fontSize: "0.875em", color: t.muted }}>Enviada para análise. Acompanhe em "Consulta de Horas".</p>
      <button onClick={onBack} style={{ marginTop: 8, padding: "10px 24px", background: "#1a6b48", color: "#fff", fontSize: "0.875em", fontWeight: 600, borderRadius: 8, border: "none", cursor: "pointer" }}>
        Voltar às Atividades
      </button>
    </div>
  );

  const inputStyle: React.CSSProperties = { width: "100%", border: `1px solid ${t.border}`, borderRadius: 8, padding: "10px 12px", fontSize: "0.875em", color: t.text, background: t.card, outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.08em", color: t.muted, textTransform: "uppercase" as const, display: "block", marginBottom: 6 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ color: t.muted, background: "none", border: "none", cursor: "pointer" }}><Icon d={P.back} size={18} /></button>
        <p style={{ fontWeight: 700, color: t.text, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.875em" }}>Registro de Horas</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {[1, 2].map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#1a6b48" : t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75em", fontWeight: 700, color: step >= s ? "#fff" : t.muted }}>{s}</div>
            {s === 1 && <div style={{ width: 48, height: 2, background: step >= 2 ? "#1a6b48" : t.border }} />}
          </div>
        ))}
        <span style={{ fontSize: "0.75em", color: t.muted, marginLeft: 8 }}>Passo {step}/2</span>
      </div>

      {step === 1 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Tipo */}
          <div>
            <label style={labelStyle}>Tipo de Atividade *</label>
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}` }}>
              <button onClick={() => setTipo("extensao")} style={{ flex: 1, padding: "10px", fontSize: "0.875em", fontWeight: 600, background: tipo === "extensao" ? "#c0392b" : t.card, color: tipo === "extensao" ? "#fff" : t.muted, border: "none", cursor: "pointer" }}>Extensão</button>
              <button onClick={() => setTipo("complementares")} style={{ flex: 1, padding: "10px", fontSize: "0.875em", fontWeight: 600, background: tipo === "complementares" ? "#1a6b48" : t.card, color: tipo === "complementares" ? "#fff" : t.muted, border: "none", cursor: "pointer" }}>Complementares</button>
            </div>
          </div>

          <div><label style={labelStyle}>Título *</label><input style={inputStyle} value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Monitoria de Física" /></div>

          <div><label style={labelStyle}>Categoria *</label>
            <select style={{ ...inputStyle, appearance: "auto" }} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
              <option value="">Selecione...</option>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div><label style={labelStyle}>Instituição *</label><input style={inputStyle} value={form.instituicao} onChange={e => setForm({ ...form, instituicao: e.target.value })} placeholder="Ex: UFABC, ONG..." /></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label style={labelStyle}>Data *</label><input type="date" style={inputStyle} value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} /></div>
            <div><label style={labelStyle}>Qtd. Horas *</label><input type="number" min="1" style={inputStyle} value={form.horas} onChange={e => setForm({ ...form, horas: e.target.value })} placeholder="0" /></div>
          </div>

          {/* File upload */}
          <div>
            <label style={labelStyle}>Comprovante (PDF, imagem)</label>
            <label style={{ display: "flex", alignItems: "center", gap: 12, border: `1px dashed ${file ? t.green : t.border}`, borderRadius: 8, padding: "12px 16px", cursor: "pointer", background: file ? t.greenBg : "transparent", transition: "all 0.2s" }}>
              <span style={{ color: file ? t.green : t.muted }}><Icon d={P.dl} size={18} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {file
                  ? <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.green, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                  : <p style={{ fontSize: "0.875em", color: t.muted }}>Clique para anexar um arquivo</p>}
                {file && <p style={{ fontSize: "0.7em", color: t.muted, marginTop: 2 }}>{(file.size / 1024).toFixed(0)} KB</p>}
              </div>
              {file && (
                <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }}
                  style={{ color: t.muted, background: "none", border: "none", cursor: "pointer", fontSize: "1em", lineHeight: 1, padding: 4 }}>✕</button>
              )}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFile} style={{ display: "none" }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
            <button onClick={onBack} style={{ flex: 1, padding: "10px", border: `1px solid ${t.border}`, borderRadius: 8, fontSize: "0.875em", fontWeight: 600, color: t.muted, background: t.card, cursor: "pointer" }}>Cancelar</button>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: "10px", background: "#1a6b48", color: "#fff", borderRadius: 8, fontSize: "0.875em", fontWeight: 600, border: "none", cursor: "pointer" }}>Próximo passo →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: "0.875em", fontWeight: 600, color: t.text }}>Confirmação dos dados</p>
          <div style={{ background: t.bg, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Tipo", tipo === "extensao" ? "Extensão" : "Complementares"],
              ["Título", form.titulo || "—"],
              ["Categoria", form.categoria || "—"],
              ["Instituição", form.instituicao || "—"],
              ["Data", form.data || "—"],
              ["Horas", form.horas ? `${form.horas}h` : "—"],
              ["Comprovante", file ? file.name : "Não anexado"],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: "0.75em", color: t.muted, flexShrink: 0 }}>{l}</span>
                <span style={{ fontSize: "0.875em", fontWeight: 500, color: t.text, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "10px", border: `1px solid ${t.border}`, borderRadius: 8, fontSize: "0.875em", fontWeight: 600, color: t.muted, background: t.card, cursor: "pointer" }}>Voltar</button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: "10px", background: "#1a6b48", color: "#fff", borderRadius: 8, fontSize: "0.875em", fontWeight: 600, border: "none", cursor: "pointer" }}>Confirmar envio</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultaHoras({ onBack, saved }: { onBack: () => void; saved: SavedActivity[] }) {
  const [tab, setTab] = useState<ConsultaTab>("extensao");
  const t = useTheme();

  const savedExt = saved.filter(a => a.tipo === "extensao");
  const savedComp = saved.filter(a => a.tipo === "complementares");

  const staticList = tab === "extensao" ? ATIV_EXTENSAO : ATIV_COMP;
  const savedList = tab === "extensao" ? savedExt : savedComp;

  // Compute totals including saved
  const baseExt = 80; const baseComp = 76; const META = 200;
  const totalExt = baseExt + savedExt.filter(a => a.status === "Pendente").reduce((s, a) => s + a.horas, 0);
  const totalComp = baseComp + savedComp.filter(a => a.status === "Pendente").reduce((s, a) => s + a.horas, 0);
  const pctExt = Math.min(Math.round((totalExt / META) * 100), 100);
  const pctComp = Math.min(Math.round((totalComp / META) * 100), 100);
  const faltamExt = Math.max(META - totalExt, 0);
  const faltamComp = Math.max(META - totalComp, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ color: t.muted, background: "none", border: "none", cursor: "pointer" }}><Icon d={P.back} size={18} /></button>
        <p style={{ fontWeight: 700, color: t.text, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.875em" }}>Consulta de Horas</p>
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
        <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 16 }}>Horas que faltam para a meta</p>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          <Donut faltam={faltamExt} total={META} color="#ef4444" label="Extensão" />
          <Donut faltam={faltamComp} total={META} color="#1a6b48" label="Complementares" />
        </div>
        {[
          { label: "Extensão", color: "#ef4444", pct: pctExt, done: `${totalExt}h` },
          { label: "Complementares", color: "#1a6b48", pct: pctComp, done: `${totalComp}h` },
        ].map((item) => (
          <div key={item.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.75em", fontWeight: 700, color: item.color }}>{item.label}</span>
              <span style={{ fontSize: "0.75em", color: t.muted }}>{item.done} de {META}h · {item.pct}%</span>
            </div>
            <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", borderRadius: 99, background: item.color, width: `${item.pct}%`, transition: "width 0.4s" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: `1px solid ${t.border}` }}>
        {(["extensao", "complementares"] as ConsultaTab[]).map((key) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "10px", fontSize: "0.875em", fontWeight: 600, background: tab === key ? "#1a6b48" : t.card, color: tab === key ? "#fff" : t.muted, border: "none", cursor: "pointer" }}>
            {key === "extensao" ? "Extensão" : "Complementares"}
          </button>
        ))}
      </div>

      {savedList.length > 0 && (
        <div>
          <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 8 }}>Registros enviados por você</p>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            {savedList.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderTop: i ? `1px solid ${t.border}` : "none" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d97706", marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{a.titulo}</p>
                  <p style={{ fontSize: "0.75em", color: t.muted }}>{a.categoria} · {a.instituicao}</p>
                  <p style={{ fontSize: "0.75em", color: t.muted }}>Enviado em {a.registradoEm}</p>
                  {a.fileUrl && (
                    <a href={a.fileUrl} download={a.fileName}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: "0.75em", color: t.green, fontWeight: 600, textDecoration: "none" }}>
                      <Icon d={P.dl} size={12} /> {a.fileName}
                    </a>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: "0.875em", fontWeight: 700, color: t.text }}>{a.horas}h</span>
                  <Badge s={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 8 }}>Histórico anterior</p>
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        {staticList.map((a, i) => (
          <div key={a.nome} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderTop: i ? `1px solid ${t.border}` : "none" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "Pendente" ? "#d97706" : "#1a6b48", marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.875em", fontWeight: 500, color: t.text }}>{a.nome}</p>
              <p style={{ fontSize: "0.75em", color: t.muted }}>{a.cat}</p>
              <p style={{ fontSize: "0.75em", color: t.muted }}>{a.periodo}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontSize: "0.875em", fontWeight: 700, color: t.text }}>{a.horas}h</span>
              <Badge s={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageAtividades() {
  const [view, setView] = useState<AtivView>("menu");
  const [saved, setSaved] = useState<SavedActivity[]>([]);
  const t = useTheme();

  function handleSave(a: SavedActivity) {
    setSaved(prev => [a, ...prev]);
  }

  if (view === "registro") return <RegistroForm onBack={() => setView("menu")} onSave={handleSave} />;
  if (view === "consulta") return <ConsultaHoras onBack={() => setView("menu")} saved={saved} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: "0.7em", fontWeight: 700, letterSpacing: "0.1em", color: t.muted, textTransform: "uppercase", marginBottom: 4 }}>O que deseja fazer?</p>
      {[
        { label: "Registro de Horas", desc: "Cadastrar nova atividade", color: "#c0392b", icon: P.plus, action: () => setView("registro") },
        { label: "Consulta de Horas", desc: "Ver horas cadastradas", color: "#1a6b48", icon: P.search, action: () => setView("consulta") },
        { label: "Alteração de Registro", desc: "Editar atividade existente", color: "#c9a227", icon: P.edit, action: () => setView("consulta") },
      ].map((item) => (
        <button key={item.label} onClick={item.action}
          style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, borderRadius: 12, background: item.color, color: "#fff", border: "none", cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={item.icon} size={20} sw={2} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1em" }}>{item.label}</p>
            <p style={{ fontSize: "0.85em", opacity: 0.8 }}>{item.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Simple placeholder pages ──────────────────────────────────────────────────
function PlaceholderPage({ title, icon, desc }: { title: string; icon: string; desc: string }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: t.greenBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.green }}>
        <Icon d={icon} size={28} />
      </div>
      <p style={{ fontSize: "1.1em", fontWeight: 700, color: t.text }}>{title}</p>
      <p style={{ fontSize: "0.875em", color: t.muted, maxWidth: 320 }}>{desc}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const NAV: { id: Page; label: string; icon: string }[] = [
  { id: "inicio", label: "Início", icon: P.home },
  { id: "atividades", label: "Registro de Horas", icon: P.clip },
  { id: "portal", label: "Minhas Atividades", icon: P.chart },
  { id: "ensino", label: "Ensino", icon: P.book },
  { id: "estagios", label: "Estágios", icon: P.briefcase },
  { id: "pesquisas", label: "Pesquisas", icon: P.search },
  { id: "forum", label: "Fórum", icon: P.forum },
  { id: "duvidas", label: "Dúvidas", icon: P.question },
  { id: "ajuda", label: "Ajuda", icon: P.help },
];

const PAGE_TITLES: Record<Page, string> = {
  inicio: "Início", portal: "Minhas Atividades", ensino: "Ensino", atividades: "Registro de Horas",
  estagios: "Estágios", pesquisas: "Pesquisas", forum: "Fórum", duvidas: "Dúvidas", ajuda: "Ajuda",
};

export default function App() {
  const [page, setPage] = useState<Page>("inicio");
  const [a11y, setA11y] = useState<A11y>({ dark: false, contrast: false, eyecare: false, fontSize: "md" });

  function setToggle(key: "dark" | "contrast" | "eyecare") {
    setA11y(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const sidebarBg = a11y.contrast ? "#000" : a11y.dark ? "#0e1624" : "#1a6b48";
  const sidebarBorder = a11y.contrast ? "#fff" : a11y.dark ? "#1e2840" : "transparent";
  const sidebarText = "#fff";
  const sidebarMuted = a11y.contrast ? "#bbb" : "rgba(255,255,255,0.6)";
  const navActiveBg = a11y.contrast ? "#00e676" : a11y.dark ? "#2dd884" : "#fff";
  const navActiveText = a11y.contrast ? "#000" : a11y.dark ? "#0e1624" : "#1a6b48";
  const navHoverBg = a11y.contrast ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)";
  const baseFontPx = basePx(a11y.fontSize);

  // Eyecare warm overlay
  const eyecareFilter = a11y.eyecare ? "sepia(0.25) saturate(0.85)" : undefined;

  return (
    <A11yCtx.Provider value={a11y}>
      <div style={{ height: "100%", display: "flex", fontFamily: "Inter, system-ui, sans-serif", fontSize: baseFontPx, filter: eyecareFilter }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 224, background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          {/* Brand + user */}
          <div style={{ padding: "20px 16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.65em", fontWeight: 700 }}>UF</div>
              <span style={{ color: sidebarText, fontWeight: 700, fontSize: "0.9em", letterSpacing: "0.05em" }}>SIGAA</span>
            </div>
            <p style={{ color: sidebarText, fontWeight: 700, fontSize: "0.95em" }}>Aluno X</p>
            <p style={{ color: sidebarMuted, fontSize: "0.75em", marginTop: 2 }}>Ciência da Computação · 5º período</p>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, fontSize: "0.875em", fontWeight: 500,
                  background: page === item.id ? navActiveBg : "transparent",
                  color: page === item.id ? navActiveText : sidebarText,
                  border: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s",
                }}>
                <span style={{ opacity: page === item.id ? 1 : 0.7 }}><Icon d={item.icon} size={16} /></span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Accessibility settings */}
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Toggles */}
            {[
              { label: "Modo escuro", key: "dark" as const, on: a11y.dark, icon: P.moon, accent: "#6366f1" },
              { label: "Alto contraste", key: "contrast" as const, on: a11y.contrast, icon: P.eye, accent: "#f59e0b" },
              { label: "Proteção ocular", key: "eyecare" as const, on: a11y.eyecare, icon: P.sun, accent: "#d97706" },
            ].map(({ label, key, on, icon, accent }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: sidebarText, opacity: 0.85 }}>
                  <Icon d={icon} size={15} />
                  <span style={{ fontSize: "0.8em" }}>{label}</span>
                </div>
                <Toggle on={on} onChange={() => setToggle(key)} accent={accent} />
              </div>
            ))}

            {/* Font size */}
            <div style={{ marginTop: 4 }}>
              <p style={{ fontSize: "0.65em", fontWeight: 700, letterSpacing: "0.1em", color: sidebarMuted, textTransform: "uppercase", marginBottom: 8 }}>Tamanho da fonte</p>
              <div style={{ display: "flex", gap: 6 }}>
                {([["sm", "A", 12], ["md", "A", 14], ["lg", "A", 17]] as [FontSize, string, number][]).map(([fs, lbl, px]) => (
                  <button key={fs} onClick={() => setA11y(prev => ({ ...prev, fontSize: fs }))}
                    style={{ flex: 1, padding: "6px", borderRadius: 6, fontSize: px, fontWeight: 700, border: `1px solid ${a11y.fontSize === fs ? "#fff" : "rgba(255,255,255,0.25)"}`, background: a11y.fontSize === fs ? "#fff" : "transparent", color: a11y.fontSize === fs ? sidebarBg : sidebarText, cursor: "pointer" }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sair */}
            <button style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff6b6b", fontSize: "0.85em", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginTop: 4 }}>
              <Icon d={P.logout} size={15} /> Sair
            </button>
            <p style={{ fontSize: "0.65em", color: sidebarMuted }}>SIGAA · v2.4.1 · UFABC</p>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: a11y.contrast ? "#000" : a11y.dark ? "#121827" : "#f1f5f9" }}>
          {/* Top bar */}
          <header style={{ background: a11y.contrast ? "#000" : a11y.dark ? "#0e1624" : "#1a6b48", borderBottom: `1px solid ${a11y.contrast ? "#fff" : "transparent"}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 12, height: 52, flexShrink: 0 }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.8em", letterSpacing: "0.12em", textTransform: "uppercase", flex: 1 }}>{PAGE_TITLES[page]}</p>
            <button style={{ position: "relative", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.75)", background: "transparent", border: "none", cursor: "pointer" }}>
              <Icon d={P.bell} size={18} />
              <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>2</span>
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7em", fontWeight: 700 }}>AX</div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              {page === "inicio" && <PageInicio onGotoAtiv={() => setPage("atividades")} />}
              {page === "portal" && <PagePortal />}
              {page === "ensino" && <PageEnsino />}
              {page === "atividades" && <PageAtividades />}
              {page === "estagios" && <PlaceholderPage title="Estágios" icon={P.briefcase} desc="Gerencie seus estágios curriculares e não-obrigatórios cadastrados no SIGAA." />}
              {page === "pesquisas" && <PlaceholderPage title="Pesquisas" icon={P.search} desc="Acompanhe projetos de iniciação científica e pesquisas vinculadas." />}
              {page === "forum" && <PlaceholderPage title="Fórum" icon={P.forum} desc="Participe dos fóruns das suas disciplinas e da comunidade UFABC." />}
              {page === "duvidas" && <PlaceholderPage title="Dúvidas" icon={P.question} desc="Envie e acompanhe suas dúvidas encaminhadas à secretaria acadêmica." />}
              {page === "ajuda" && <PlaceholderPage title="Ajuda" icon={P.help} desc="Central de ajuda e tutoriais do SIGAA UFABC." />}
            </div>
          </main>
        </div>
      </div>
    </A11yCtx.Provider>
  );
}
