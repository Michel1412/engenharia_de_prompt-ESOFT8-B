# Campos Minados

**Trabalho Prático 1 — Engenharia de Prompt e Contexto na Prática**  
Opção do enunciado: **laboratório comparativo** — o mesmo tipo de jogo (Campo Minado), quatro IAs.

## 1. Descrição do Projeto

Laboratório para gerar **o mesmo tipo de projeto com mais de uma IA** e comparar custo, tempo, tokens e volume de arquivos.

Cada experimento vive isolado em `projetos/<slug>/`. O hub em `home/` seleciona e abre cada jogo em rota própria no mesmo domínio.

| Experimento | Agente | Projeto |
| --- | --- | --- |
| Grok 4.6 High Fast | Cursor | [campo_minado_Grok_46](projetos/campo_minado_Grok_46/) |
| Gemini VeryHigh | Gemini 3.7 Flash | [campo_minado_Gemini_VeryHigh](projetos/campo_minado_Gemini_VeryHigh/) |
| Cursor Auto | Cursor Auto | [campo_minado_trabalho_IA](projetos/campo_minado_trabalho_IA/) |
| Gemini Web | Google AI Studio Build | [campo_minado_web](projetos/campo_minado_web/) |

Índice comparativo: [`projetos/_indice.md`](projetos/_indice.md).

## 2. Ferramentas e Modelos Utilizados

| Experimento | Ferramenta | Modelo |
| --- | --- | --- |
| Grok Fast | Cursor IDE | `cursor-grok-4.6-high-fast` |
| Auto | Cursor IDE + `/create-rule` | `auto` |
| Gemini VeryHigh | Gemini API | `gemini-3.7-flash` (Very High) |
| Gemini Web | Google AI Studio Build + Gemini API | `gemini-3.7-flash` (service tier standard) |

Medição de tokens Cursor: [dashboard de usage](https://cursor.com/dashboard/usage). Medição Gemini: `usageMetadata` da API.

## 3. Técnicas de Prompt Engineering Utilizadas

| Agente | Técnica | Resumo |
| --- | --- | --- |
| Grok Fast | JSON system | Especificação aninhada no system prompt (role, game_specifications, ASSETS) |
| Auto | Chain-of-Thought + rule | System via `/create-rule`; user com passos 1–4 antes do código |
| Gemini VeryHigh | XML + role | Instruções em tags (`<arquitetura_e_regras>`, `<interface_e_ux>`) |
| Gemini Web | Few-shot | 4 exemplos de bandeira, flood fill e troca de cenário |

Detalhes nos `resume.md` de cada pasta e nas capturas em [`imagens/`](imagens/).

## 4. System Prompts

Resumo por agente (texto completo nos resumes e em `projetos/*/observable/`):

- **Grok Fast** — JSON com `system_instruction`, dificuldades, first-click safe, flood fill e mapa de URLs para peças.
- **Auto** — Regra de engenheiro React/Tailwind + user com regras do roguelike e CoT.
- **Gemini VeryHigh** — Role de engenheiro sênior + seções XML para engine vs UI.
- **Gemini Web** — Desenvolvedor front-end HTML/CSS/JS; funcionalidades obrigatórias e 4 cenários visuais.

Prompt compartilhado do laboratório: [`prompts/input-padrao.md`](prompts/input-padrao.md).

## 5. Primeira Chamada — Criação

Cada agente recebeu o prompt de criação do Campo Minado no chat ou Build correspondente.

| Experimento | Resultado | Tokens |
| --- | --- | --- |
| Grok Fast | 1 arquivo (`index.html`) · 3m 5s | 102.956 in · 17.167 out |
| Auto | 29 arquivos · 20m 5s | 76.008 in · 22.303 out |
| Gemini VeryHigh | 31 arquivos · 4.897 linhas | 245 in · 34.223 out (projeto completo) |
| Gemini Web (Build 1) | 22 arquivos · funcional | não coletados |

## 6. Segunda Chamada — Melhoria

| Experimento | Objetivo |
| --- | --- |
| Gemini Web (Build 2) | Melhoria visual dos 4 cenários sem alterar lógica |
| Auto | Segundo prompt (roguelike de cartas) — ver [resume](projetos/campo_minado_trabalho_IA/resume.md) |
| Grok / VeryHigh | Uma chamada principal cada |

Tokens das Builds do AI Studio não foram coletados no momento da execução.

## 7. Teste de Curadoria de Contexto

Experimento no **Gemini Web** (`campo_minado_web`): mesma pergunta enviada duas vezes com contextos diferentes.

**Pergunta:** adicionar descrição da dificuldade (ex.: «9 × 9 — 10 minas») abaixo do seletor, sem alterar outras funções.

- **Teste A** — `DifficultySelector.tsx` completo
- **Teste B** — só o trecho relevante

## 8. Teste A — Contexto Completo

| Campo | Valor |
| --- | --- |
| Modelo | Gemini 3.7 Flash |
| Tokens de entrada | 751 |
| Tokens de saída | 774 |
| Total (API) | 2.808 |
| Custo estimado | US$ 0,00346575 |

## 9. Teste B — Contexto Curado

| Campo | Valor |
| --- | --- |
| Modelo | Gemini 3.7 Flash |
| Tokens de entrada | 308 |
| Tokens de saída | 368 |
| Thinking (`thoughtsTokenCount`) | 651 |
| Total | 1.327 |
| Custo estimado | US$ 0,00161100 |

## 10. Thinking Level

Nas chamadas pela Gemini API não foi enviado `thinkingLevel` explicitamente — comportamento padrão do modelo. No Teste B a API registrou `thoughtsTokenCount: 651`.

## 11. Comparação de Tokens (curadoria A × B)

| Teste | Input | Output | Thinking |
| --- | --- | --- | --- |
| Contexto completo (A) | 751 | 774 | — |
| Contexto curado (B) | 308 | 368 | 651 |
| Redução A → B | −59,0% | −52,5% | — |

## 12. Preços do Modelo

Preços de lista (USD / 1M tokens) em [cursor.com/docs/models](https://cursor.com/docs/models) e `.cursor/skills/observable/precos.json`:

| Modelo | Input | Output |
| --- | --- | --- |
| Grok 4.6 High Fast | $4,00 | $12,00 |
| Cursor Auto | $1,25 | $6,00 |
| Gemini 3.7 Flash | $0,75 | $3,75 |

Valores Cursor podem aparecer como **Included** na fatura.

## 13–15. Custos

Tabela completa: [`projetos/_indice.md`](projetos/_indice.md).

| Experimento | Custo (preço de lista) |
| --- | --- |
| Grok Fast | ≈ US$ 0,618 |
| Auto | ≈ US$ 0,229 |
| Gemini Web A+B | US$ 0,00507675 |
| Gemini VeryHigh | US$ 0,12852000 |

Redução de custo na curadoria Web (A → B): **≈ 53,5%**.

## 16. Conclusão do Teste de Curadoria

Fornecer só o contexto necessário reduz tokens de entrada (~59%) e custo (~53,5%) sem perder informação para a tarefa.

## 17. Evidências

Capturas em [`imagens/{agente}/`](imagens/) — enunciado §4:

- [Cursor Auto](imagens/Cursor%20Auto/) — create-rule, user CoT, agente concluído
- [Grok 4.6 High Fast](imagens/Grok%204.6%20High%20Fast/) — agente concluído
- [Gemini Web](imagens/Gemini%20Web/) — 11 prints (system, builds, tokens, comparação A×B)
- [Gemini VeryHigh](imagens/Gemini%20VeryHigh/) — tokens do projeto completo

Apresentação interativa: [`home/index.html`](home/index.html) (slides + hub).

## 18. URL Publicada

https://michel1412.github.io/engenharia_de_prompt-ESOFT8-B/

Rotas dos jogos no mesmo domínio:

| Rota | Jogo |
| --- | --- |
| `/grok-4-6-high-fast/campo_minado_Grok_46/` | Campo Minado Google |
| `/gemini-3-7-flash/campo_minado_Gemini_VeryHigh/` | Campo Minado Pro |
| `/auto/campo_minado_trabalho_IA/` | Mina das Cartas |
| `/gemini-3-7-flash/campo_minado_web/` | Campo Minado Web |

## 19. Repositório GitHub

https://github.com/Michel1412/engenharia_de_prompt-ESOFT8-B

O usuário **@pedrosatin** deve estar adicionado como collaborator.

## 20. Integrantes

| Nome | RA |
| --- | --- |
| Joao Pedro Souza Peixoto Saraiva | 23034350-2 |
| Michel Bocchi Junior | 23220783-2 |
| Luiz Henrique Peschieira Romano | 25363238-2 |
| André Felipe Ferrari de Azevedo | 22120196-2 |

---

## Como rodar localmente

```bash
node scripts/build-pages.mjs
python lab_server.py
```

Abra [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

Para publicar no GitHub Pages: ative **Settings → Pages → GitHub Actions**. O workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publica a pasta `site/`.

## Como rodar um novo experimento

1. Escreva o enunciado em [`prompts/input-padrao.md`](prompts/input-padrao.md).
2. Abra um **chat novo** e escolha o modelo.
3. Peça para a IA criar o projeto em `projetos/<nnn>-<slug>-<modelo>/`.
4. Quando a geração terminar, envie **`/observable`**.

O agente grava `projetos/<pasta>/resume.md` com input, tokens, arquivos, tempo, preço, modelo e link de usage. Não invente tokens — se o dashboard não estiver acessível, grave `não disponível`.
