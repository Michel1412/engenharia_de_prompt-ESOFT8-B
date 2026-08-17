const PROJECTS = [
  {
    id: "campo_minado_Grok_46",
    title: "Campo Minado Google",
    model: "Grok 4.6 High Fast",
    modelSlug: "grok-4-6-high-fast",
    summary: "HTML único estilo Google, system JSON e peças customizáveis.",
    tokens: "102.956 in · 17.167 out",
  },
  {
    id: "campo_minado_Gemini_VeryHigh",
    title: "Campo Minado Pro",
    model: "Gemini 3.7 Flash",
    modelSlug: "gemini-3-7-flash",
    summary: "React + TypeScript, chording e dificuldades clássicas.",
    tokens: "8 in · 693 out",
  },
  {
    id: "campo_minado_trabalho_IA",
    title: "Mina das Cartas",
    model: "Cursor Auto",
    modelSlug: "auto",
    summary: "Roguelike de cartas a cada minuto de partida.",
    tokens: "76.008 in · 22.303 out",
  },
  {
    id: "campo_minado_web",
    title: "Campo Minado Web",
    model: "Gemini 3.7 Flash",
    modelSlug: "gemini-3-7-flash",
    summary: "Dificuldades clássicas e quatro cenários visuais.",
    tokens: "1.059 in · 1.142 out",
  },
];

const cardsEl = document.getElementById("cards");
const openBtn = document.getElementById("open-btn");
const statusEl = document.getElementById("status");

let selectedId = PROJECTS[0].id;

function hubBase() {
  const path = window.location.pathname;
  if (path.endsWith("/index.html")) {
    return path.slice(0, path.lastIndexOf("/") + 1);
  }
  if (path.endsWith("/")) return path;
  return `${path}/`;
}

function projectUrl(project) {
  return new URL(`${project.modelSlug}/${project.id}/`, `${window.location.origin}${hubBase()}`).href;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function render() {
  cardsEl.innerHTML = "";
  PROJECTS.forEach((project) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `card${project.id === selectedId ? " is-selected" : ""}`;
    button.setAttribute("aria-pressed", project.id === selectedId ? "true" : "false");
    button.setAttribute("role", "listitem");
    button.innerHTML = `
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <div class="meta">
        <span>${project.model}</span>
        <span>${project.tokens}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      selectedId = project.id;
      render();
      setStatus(`Selecionado: ${project.title}`);
    });
    cardsEl.appendChild(button);
  });
  openBtn.disabled = !selectedId;
}

function openSelected() {
  const project = PROJECTS.find((item) => item.id === selectedId);
  if (!project) return;

  const url = projectUrl(project);
  const tab = window.open(url, "_blank", "noopener");
  if (!tab) {
    setStatus("O navegador bloqueou a aba. Permita pop-ups e tente de novo.");
    return;
  }
  setStatus(`Nova aba: ${url}`);
}

openBtn.addEventListener("click", openSelected);
render();
setStatus("Escolha um projeto e abra em nova aba.");
