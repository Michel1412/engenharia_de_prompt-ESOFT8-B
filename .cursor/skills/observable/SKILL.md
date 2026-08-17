---
name: observable
description: Registra o resume.md de um experimento do laboratório Campos Minados com input, tokens, arquivos, tempo, preço, modelo e link de usage. Use when the user runs /observable or asks to gravar o resume do projeto gerado.
disable-model-invocation: true
---

# /observable

Gera ou atualiza o `resume.md` do experimento atual. Não invente tokens, tempo ou preço.

## Passos

1. Rodar a partir da raiz do workspace e ler o JSON gerado:

```bash
python .cursor/hooks/coletar_metricas.py
```

Depois abra `.observable/latest.json` (UTF-8). Não dependa só do stdout do terminal no Windows.

2. Destino do `resume.md`:
   - pasta em `projetos/<slug>/` se o JSON trouxer `projeto`
   - ou o caminho que o usuário passou depois de `/observable`
   - se não houver pasta, criar `projetos/<nnn>-<slug>-<modelo>/` e gravar lá

3. Tokens (`input | output`):
   - abrir [https://cursor.com/dashboard/usage](https://cursor.com/dashboard/usage)
   - localizar o request desta conversa (modelo + horário)
   - copiar input e output reais
   - se não conseguir ler o dashboard, gravar `não disponível` e manter o link — nunca estimar

4. Preencher o arquivo com o template em [template.md](template.md). Campos obrigatórios, nesta ordem:

- Texto de Input
- Numero de tokens: input | output
- Numero de arquivos gerados
- Tempo de execução
- Preço do token: input | output
- Modelo usado
- Link para o usage do perfil no site do Cursor

5. Regras de preenchimento:
   - **Texto de Input**: primeiro prompt da sessão que não seja `/observable`. Se o hook estiver vazio, use o prompt original desta conversa.
   - **Arquivos**: `numero_arquivos` do JSON. Não contar `resume.md`, `_indice.md`, `.cursor/` nem `.observable/`.
   - **Tempo**: `tempo_execucao` do JSON. Se o hook não rodou, calcule do primeiro ao último turno desta conversa.
   - **Preço**: valores do JSON em `USD / 1M tokens` (ex.: `$2.00 / 1M | $6.00 / 1M`). Fonte: [https://cursor.com/docs/models](https://cursor.com/docs/models).
   - **Modelo**: nome amigável + slug se existir (`Cursor Grok 4.6` / `grok-4.6`).
   - **Link**: sempre `https://cursor.com/dashboard/usage`

6. Atualizar `projetos/_indice.md` com uma linha do experimento (projeto, modelo, tokens, arquivos, tempo, preço, link do resume).

7. Responder em poucas linhas: caminho do `resume.md`, o que ficou pendente (em geral tokens) e o link de usage.

## Exemplo de saída

```markdown
# Resume — 001-todo-grok-46

## Texto de Input

Crie um app de lista de tarefas com HTML, CSS e JS puro.

## Numero de tokens

- input: 18420
- output: 9310

## Numero de arquivos gerados

4

## Tempo de execução

3m 12s

## Preço do token

- input: $2.00 / 1M
- output: $6.00 / 1M

## Modelo usado

Cursor Grok 4.6 (`grok-4.6`)

## Link para o usage do perfil no site do Cursor

https://cursor.com/dashboard/usage
```
