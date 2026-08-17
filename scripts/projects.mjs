export const PROJECTS = [
  {
    id: "campo_minado_Grok_46",
    title: "Campo Minado Google",
    model: "Grok 4.6 High Fast",
    modelSlug: "grok-4-6-high-fast",
    kind: "static",
    dir: "projetos/campo_minado_Grok_46",
    files: ["index.html"],
    summary: "HTML único estilo Google, system JSON e peças customizáveis.",
    tokens: "102.956 in · 17.167 out",
  },
  {
    id: "campo_minado_Gemini_VeryHigh",
    title: "Campo Minado Pro",
    model: "Gemini 3.7 Flash",
    modelSlug: "gemini-3-7-flash",
    kind: "vite",
    dir: "projetos/campo_minado_Gemini_VeryHigh",
    summary: "React + TypeScript, chording e dificuldades clássicas.",
    tokens: "8 in · 693 out",
  },
  {
    id: "campo_minado_trabalho_IA",
    title: "Mina das Cartas",
    model: "Cursor Auto",
    modelSlug: "auto",
    kind: "vite",
    dir: "projetos/campo_minado_trabalho_IA",
    summary: "Roguelike de cartas a cada minuto de partida.",
    tokens: "76.008 in · 22.303 out",
  },
  {
    id: "campo_minado_web",
    title: "Campo Minado Web",
    model: "Gemini 3.7 Flash",
    modelSlug: "gemini-3-7-flash",
    kind: "vite",
    dir: "projetos/campo_minado_web",
    summary: "Dificuldades clássicas e quatro cenários visuais.",
    tokens: "1.059 in · 1.142 out",
  },
];

export function routeOf(project) {
  return `${project.modelSlug}/${project.id}`;
}
