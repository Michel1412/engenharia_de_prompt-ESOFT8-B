/** Conteudo do deck — so evidencia dos resumes/prompts. Sem inventar tokens. */
window.PRESENTATION_SLIDES = [
  {
    id: "capa",
    title: "Campos Minados",
    kicker: "Trabalho 1 · Projeto de estudo",
    body: [
      "Opção do enunciado: laboratório comparativo — o mesmo tipo de jogo, quatro IAs.",
      "Não é feature da Escola de TI; é experimento de prompt, tokens, custo e resultado.",
    ],
    chips: [
      "Grok 4.6 High Fast",
      "Gemini VeryHigh",
      "Cursor Auto",
      "Gemini Web (AI Studio)",
    ],
  },
  {
    id: "intuito",
    title: "Intuito do laboratório",
    kicker: "O que comparamos",
    body: [
      "Mesma família de jogo (Campo Minado), variações de técnica de prompting e de ferramenta.",
      "Medimos: texto de input (system/user), tokens in/out, custo hipotético, tempo e arquivos gerados.",
      "Cada experimento vive isolado; o hub só seleciona e abre a rota do jogo.",
    ],
  },
  {
    id: "anatomia",
    title: "Anatomia dos prompts",
    kicker: "System × user por projeto",
    list: [
      {
        label: "Grok Fast",
        text: "System em JSON (system_instruction): role, objective, game_specifications, customization_assets e technical_requirements. O user só pede para criar no laboratório com esse prompt.",
      },
      {
        label: "Auto",
        text: "System via /create-rule (engenheiro React/Tailwind) + user com regras do roguelike e CoT.",
      },
      {
        label: "Web (AI Studio)",
        text: "System (HTML/CSS/JS + funcionalidades + 4 cenários) + user Build com few-shot; 2ª chamada para melhoria visual.",
      },
      {
        label: "Gemini VeryHigh",
        text: "Role de engenheiro sênior + seções em tags XML (<arquitetura_e_regras>, <interface_e_ux>).",
      },
    ],
  },
  {
    id: "tecnicas",
    title: "Técnicas usadas",
    kicker: "O que está evidenciado — sem inventar JSON mode",
    list: [
      {
        label: "JSON system (Grok)",
        text: "Especificação aninhada no system: dificuldades 8×10 / 14×18 / 20×24, first-click safe, flood fill, long-press e mapa de URLs para peças.",
      },
      {
        label: "Chain-of-Thought (Auto)",
        text: "Passos 1–4 obrigatórios antes do código: estado, cartas, componentes, só então implementação.",
      },
      {
        label: "Few-shot (Web)",
        text: "4 exemplos: (1) botão direito coloca bandeira; (2) direito de novo remove; (3) célula 0 → flood fill; (4) cenário Noite só muda aparência, não o estado.",
      },
      {
        label: "XML + role (Gemini VeryHigh)",
        text: "Instruções estruturadas em tags; engine vs UI, flood fill, chording.",
      },
    ],
    note: "JSON mode da API (resposta forçada em JSON) não foi usado. O JSON do Grok é o system prompt, não o formato de saída.",
  },
  {
    id: "web-projeto",
    title: "Campo Minado Web",
    kicker: "Gemini 3.7 Flash · AI Studio Build · campo_minado_web",
    list: [
      {
        label: "Ferramenta / modelo",
        text: "Google AI Studio Build + Gemini API (curadoria). gemini-3.7-flash · service tier standard · thinking level padrão (não especificado).",
      },
      {
        label: "Dificuldades",
        text: "Fácil 9×9 (10 minas) · Médio 16×16 (40) · Difícil 16×30 (99).",
      },
      {
        label: "Cenários",
        text: "Clássico Verde, Noite, Neve, Deserto — troca só aparência; não reinicia partida nem move minas.",
      },
      {
        label: "Build 1 — criação",
        text: "Primeira versão funcional + few-shot · sucesso · tokens não coletados.",
      },
      {
        label: "Build 2 — cenários",
        text: "Melhoria visual dos 4 temas sem alterar lógica · sucesso · tokens não coletados.",
      },
    ],
    note: "22 arquivos gerados · app AI Studio: ai.studio/apps/6da0ac09-9b9e-409f-8c75-aec7fa93e646",
  },
  {
    id: "curadoria",
    title: "Curadoria de contexto",
    kicker: "Testes A × B — Gemini API (Web)",
    body: [
      "Mesma pergunta nos dois testes: adicionar descrição da dificuldade (ex.: «9 × 9 — 10 minas») abaixo do seletor, sem alterar outras funções.",
      "Teste A: DifficultySelector.tsx completo · Teste B: só o trecho relevante.",
    ],
    table: {
      headers: ["Chamada", "In", "Out", "Thinking", "Total"],
      rows: [
        ["Teste A — contexto completo", "751", "774", "—", "2.808"],
        ["Teste B — contexto curado", "308", "368", "651", "1.327"],
        ["Redução A → B", "−59,0%", "−52,5%", "—", "—"],
      ],
    },
    formula:
      "Custo A: US$ 0,00346575 · Custo B: US$ 0,00161100 · Redução de custo ~53,5%.",
    note: "Conclusão: contexto curado reduz tokens e custo sem perder informação necessária. Chamadas Build (criação + cenários): tokens não coletados.",
  },
  {
    id: "numeros",
    title: "Números e custo",
    kicker: "CSV 17/08 · resumes — sem estimativa inventada",
    table: {
      headers: ["Experimento", "In", "Out", "Preço / 1M", "Custo"],
      rows: [
        [
          "Grok Fast",
          "102.956",
          "17.167",
          "$4 / $12",
          "≈ US$ 0,618 (fórmula; CSV Included)",
        ],
        [
          "Auto",
          "76.008",
          "22.303",
          "$1,25 / $6",
          "≈ US$ 0,229 (Auto Cost; CSV Included)",
        ],
        [
          "Web A",
          "751",
          "774",
          "$0,75 / $3,75",
          "US$ 0,00346575",
        ],
        [
          "Web B",
          "308",
          "368",
          "$0,75 / $3,75",
          "US$ 0,00161100",
        ],
        [
          "Web A+B",
          "1.059",
          "1.142",
          "$0,75 / $3,75",
          "US$ 0,00507675 · −53,5% vs A",
        ],
        [
          "Gemini VeryHigh",
          "245",
          "34.223",
          "$0,75 / $3,75",
          "US$ 0,12852000",
        ],
      ],
    },
    countUp: [
      { label: "Grok in", value: 102956 },
      { label: "Grok out", value: 17167 },
      { label: "Auto in", value: 76008 },
      { label: "Auto out", value: 22303 },
    ],
    formula:
      "Auto: (76008/1e6)×1,25 + (22303/1e6)×6 ≈ US$ 0,229 · Grok: (102956/1e6)×4 + (17167/1e6)×12 ≈ US$ 0,618 · VeryHigh: (245/1e6)×0,75 + (34223/1e6)×3,75 = US$ 0,12852000 · Web B: US$ 0,001611 · Web A: US$ 0,00346575.",
    note: "VeryHigh: usageMetadata do projeto completo (gemini-3.7-flash) — 31 arquivos, 4.897 linhas. CSV marca Cost = Included nos dois (Pro). Tarifas são preço de lista; Auto Cost não aparece no export.",
  },
  {
    id: "evidencias",
    title: "Prints de evidência",
    kicker: "Pasta imagens/ no repositório — uma subpasta por agente",
    body: [
      "Capturas em imagens/{agente}/ no repositório (enunciado §4). JSON da API nos testes A/B.",
      "Gemini Web: 11 prints — system, Build 1 e 2, jogo, código, tokens e comparação A×B.",
      "Gemini VeryHigh: usageMetadata do projeto completo (245 in · 34.223 out).",
    ],
    links: [
      { label: "Abrir pasta imagens/", href: "imagens/" },
      { label: "Cursor Auto (pasta)", href: "imagens/Cursor Auto/" },
      { label: "Cursor Auto — create-rule-system.png", href: "imagens/Cursor Auto/create-rule-system.png" },
      { label: "Cursor Auto — user-prompt-cot.png", href: "imagens/Cursor Auto/user-prompt-cot.png" },
      { label: "Cursor Auto — agente-concluido.png", href: "imagens/Cursor Auto/agente-concluido.png" },
      { label: "Grok 4.6 High Fast (pasta)", href: "imagens/Grok 4.6 High Fast/" },
      { label: "Grok — agente-concluido.png", href: "imagens/Grok 4.6 High Fast/agente-concluido.png" },
      { label: "Gemini Web — campo_minado_web (11 prints)", href: "imagens/Gemini Web/" },
      { label: "Gemini Web — 05 chamada 02 (cenários)", href: "imagens/Gemini Web/05-chamada-02-prompt.png" },
      { label: "Gemini Web — 06 resultado chamada 02", href: "imagens/Gemini Web/06-chamada-02-resultado.png" },
      { label: "Gemini Web — 13 comparação A×B", href: "imagens/Gemini Web/13-comparacao-contexto.png" },
      { label: "Gemini VeryHigh (pasta)", href: "imagens/Gemini VeryHigh/" },
      { label: "Gemini VeryHigh — tokens projeto completo", href: "imagens/Gemini VeryHigh/tokens-projeto-completo.png" },
    ],
  },
  {
    id: "leitura-grok",
    title: "Leitura do Grok no CSV",
    kicker: "Uma chamada · 17/08 18:22 (UTC-3)",
    body: [
      "O experimento campo_minado_Grok_46 bate com a linha cursor-grok-4.6-high-fast às 21:22:41 UTC.",
    ],
    table: {
      headers: ["Campo do CSV", "Valor"],
      rows: [
        ["Input (w/o Cache Write)", "102.956"],
        ["Cache Read", "375.168"],
        ["Output Tokens", "17.167"],
        ["Total Tokens", "495.291"],
        ["Cost", "Included"],
      ],
    },
    note: "Arquivo gerado: 1 (index.html). Tempo: 3m 5s. Cache read não entra na coluna In da tabela comparativa — o laboratório usa input sem cache write, como nos outros resumes.",
  },
  {
    id: "fortes",
    title: "Pontos fortes de cada jogo",
    kicker: "O que cada experimento entregou",
    list: [
      {
        label: "Grok",
        text: "HTML único estilo Google; first-click safe, flood fill, long-press no mobile e objeto ASSETS para trocar peças por URL.",
      },
      {
        label: "Gemini VeryHigh",
        text: "Engine separada da UI, flood fill, chording e dificuldades clássicas + custom. 31 arquivos · 4.897 linhas · gemini-3.7-flash.",
      },
      {
        label: "Auto",
        text: "Roguelike de cartas a cada minuto (ajuda e penalidade) sobre Campo Minado.",
      },
      {
        label: "Web",
        text: "HTML/CSS/JS; Fácil/Médio/Difícil (9×9/16×16/16×30); 4 temas; bandeiras, flood fill, timer, contador e reinício.",
      },
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas de medição",
    kicker: "Enunciado §5 — onde os números vieram",
    list: [
      {
        label: "Cursor CSV",
        text: "Export usage-events-2026-08-17 (2).csv — Grok 21:22:41 UTC; Auto nas 5 linhas do resume. Dashboard cursor.com/dashboard/usage.",
      },
      {
        label: "Gemini usageMetadata",
        text: "promptTokenCount, candidatesTokenCount, totalTokenCount — VeryHigh projeto completo (245 / 34.223; tokens-projeto-completo.png) · Web testes A/B (JSON + prints 11–13).",
      },
      {
        label: "AI Studio Build",
        text: "Web: 2 chamadas (criação + cenários visuais) — tokens não coletados; thinking level padrão.",
      },
    ],
  },
  {
    id: "deploy",
    title: "Deploy no mesmo domínio",
    kicker: "Hub + rotas isoladas",
    body: [
      "Preview local: lab_server serve home/ em / e cada jogo em /{modelo}/{projeto}/.",
      "GitHub Pages: workflow pages.yml → scripts/build-pages.mjs gera site/ a partir de home/ + builds Vite.",
    ],
    chips: [
      "/grok-4-6-high-fast/campo_minado_Grok_46/",
      "/gemini-3-7-flash/campo_minado_Gemini_VeryHigh/",
      "/auto/campo_minado_trabalho_IA/",
      "/gemini-3-7-flash/campo_minado_web/",
    ],
  },
  {
    id: "equipe",
    title: "Equipe e URL",
    kicker: "Entrega formal — enunciado §18–20",
    placeholders: [
      {
        label: "Joao Pedro Souza Peixoto Saraiva",
        value: "23034350-2",
      },
      { label: "Michel Bocchi Junior", value: "23220783-2" },
      {
        label: "Luiz Henrique Peschieira Romano",
        value: "25363238-2",
      },
      {
        label: "André Felipe Ferrari de Azevedo",
        value: "22120196-2",
      },
      {
        label: "URL publicada",
        value: "https://michel1412.github.io/engenharia_de_prompt-ESOFT8-B/",
      },
      {
        label: "Repositório GitHub",
        value: "https://github.com/Michel1412/engenharia_de_prompt-ESOFT8-B",
      },
    ],
    pendencias: [
      "Adicionar @pedrosatin como collaborator no GitHub.",
    ],
  },
];
