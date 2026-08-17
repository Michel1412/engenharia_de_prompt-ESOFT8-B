# Campos Minados

Laboratório para gerar **o mesmo tipo de projeto com mais de uma IA** e comparar custo, tempo e volume de arquivos.

## Como rodar um experimento

1. Escreva o enunciado em [`prompts/input-padrao.md`](prompts/input-padrao.md).
2. Abra um **chat novo** e escolha o modelo (Grok, Claude, GPT, Composer, etc.).
3. Peça para a IA criar o projeto em `projetos/<nnn>-<slug>-<modelo>/` usando o prompt compartilhado.
4. Quando a geração terminar, envie **`/observable`**.

O agente grava `projetos/<pasta>/resume.md` com:

- Texto de Input
- Numero de tokens: input | output
- Numero de arquivos gerados
- Tempo de execução
- Preço do token: input | output
- Modelo usado
- Link para o usage do perfil no site do Cursor

A tabela comparativa fica em [`projetos/_indice.md`](projetos/_indice.md). Cada experimento tem o próprio `resume.md` com os dados do Observable.

## Home e GitHub Pages

Todos os jogos são gerados como site estático no **mesmo domínio**, com rotas isoladas:

`/{modelo}/{nome-do-projeto}/`

| Rota | Projeto |
| --- | --- |
| `/grok-4-6-high-fast/campo_minado_Grok_46/` | Campo Minado Google |
| `/gemini-3-7-flash/campo_minado_Gemini_VeryHigh/` | Campo Minado Pro |
| `/auto/campo_minado_trabalho_IA/` | Mina das Cartas |
| `/gemini-3-7-flash/campo_minado_web/` | Campo Minado Web |

O hub continua abrindo o jogo **em uma nova aba**, apontando para o mesmo origin.

```bash
node scripts/build-pages.mjs
python lab_server.py
```

Abra [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

Para o GitHub Pages: ative **Settings → Pages → GitHub Actions**. O workflow `.github/workflows/pages.yml` publica a pasta `site/` com `PAGES_BASE=/<nome-do-repositorio>/`.

## Tokens

O Cursor não entrega a contagem de tokens dentro do chat. O `/observable` tenta ler o [dashboard de usage](https://cursor.com/dashboard/usage). Se a página não estiver acessível, o campo fica `não disponível` — não use estimativa.

## Preços

Os preços de lista (USD / 1M tokens) vêm de [cursor.com/docs/models](https://cursor.com/docs/models) e estão em `.cursor/skills/observable/precos.json`. O valor cobrado na fatura pode ser “Included” se ainda estiver dentro do plano.

## Pasta de um experimento

```text
projetos/001-todo-grok-46/
  ...arquivos gerados...
  resume.md
```
