/** Conteúdo do deck — só evidência dos resumes/prompts. Sem inventar tokens. */
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
        text: "System (regras HTML/CSS/JS + 4 cenários) + user de criação + few-shot.",
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
        text: "4 exemplos de bandeira, flood fill e troca de cenário no prompt de Build.",
      },
      {
        label: "XML + role (Gemini VeryHigh)",
        text: "Instruções estruturadas em tags; engine vs UI, flood fill, chording.",
      },
    ],
    note: "JSON mode da API (resposta forçada em JSON) não foi usado. O JSON do Grok é o system prompt, não o formato de saída.",
  },
  {
    id: "curadoria",
    title: "Curadoria de contexto",
    kicker: "Testes A × B — Gemini API (Web)",
    body: [
      "Mesma família de modelo; diferença só no tamanho/contexto do prompt de teste.",
    ],
    table: {
      headers: ["Chamada", "Input", "Output"],
      rows: [
        ["Teste A — contexto completo", "751", "774"],
        ["Teste B — contexto curado", "308", "368"],
        ["Soma evidenciada", "1.059", "1.142"],
      ],
    },
    note: "Chamadas Build (criação + cenários) não tiveram tokens coletados.",
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
          "—",
          "Included · sem USD unitário",
        ],
        [
          "Web A+B",
          "1.059",
          "1.142",
          "$0,75 / $3,75",
          "US$ 0,00507675 hipotético · free tier R$0",
        ],
        [
          "Gemini VeryHigh",
          "8",
          "693",
          "$0,75 / $3,75",
          "Pendente — poema, não o jogo",
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
      "Grok: (102956/1e6)×4 + (17167/1e6)×12 = US$ 0,617828 · Web: soma A+B já calculada no resume. Fonte Grok: usage-events-2026-08-17 (2).csv, 21:22:41 UTC.",
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
        text: "Engine separada da UI, flood fill, chording e dificuldades clássicas + custom.",
      },
      {
        label: "Auto",
        text: "Roguelike de cartas a cada minuto (ajuda e penalidade) sobre Campo Minado.",
      },
      {
        label: "Web",
        text: "HTML/CSS/JS sem framework; quatro temas: Clássico Verde, Noite, Neve, Deserto.",
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
        text: "promptTokenCount / candidates + thoughts (VeryHigh tokens.txt; Web testes A/B).",
      },
      {
        label: "AI Studio Build",
        text: "Criação do Web — tokens das chamadas Build não coletados.",
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
    kicker: "Placeholders — colar depois",
    placeholders: [
      { label: "Integrante 1", value: "Nome · RA" },
      { label: "Integrante 2", value: "Nome · RA" },
      { label: "Integrante 3", value: "Nome · RA" },
      { label: "URL publicada", value: "https://…" },
    ],
    pendencias: [
      "Prints de evidência (PNG/JPG) — enunciado exige; não há imagens no repo.",
      "Gemini VeryHigh: tokens.txt é um poema, não a geração do jogo.",
      "Web Build (criação + cenários): tokens não coletados.",
      "Auto: custo unitário USD ausente (Included).",
      "Grok: fatura Included; US$ 0,617828 é só preço de lista.",
      "README ainda no formato do laboratório (não na ordem do item 8 do enunciado).",
      "Entrega GitHub + @pedrosatin + URL no ar — fora deste recorte de UI.",
    ],
  },
];
