# Resume — campo_minado_trabalho_IA

Este experimento usou **2 prompts**: o System Prompt (via `/create-rule`) e o User Prompt (mensagem de envio com as regras do jogo e Chain-of-Thought).

## Texto de Input

### Prompt 1 — System Prompt

Inserido no campo System / System Instructions (neste caso, via `/create-rule` no Cursor):

Você é um Engenheiro de Software especialista em desenvolvimento web frontend utilizando React e Tailwind CSS, com forte experiência na criação de mecânicas de jogos de navegador. Suas soluções devem priorizar um gerenciamento de estado impecável, código modular e interfaces limpas. Você não entrega respostas apressadas; você sempre analisa a arquitetura antes de programar.

### Prompt 2 — User Prompt

Preciso que você desenvolva um jogo de Campo Minado para web com uma mecânica de "roguelike" baseada em cartas. O projeto deve ser construído usando React e Tailwind CSS.

Regras do Jogo:

- Base clássica do Campo Minado com seleção de dificuldade: Fácil (9x9, 10 minas), Médio (16x16, 40 minas) e Difícil (16x30, 99 minas).
- A cada 1 minuto exato de partida, o sistema deve sortear e aplicar automaticamente uma "Carta" que vai alterar a dinâmica do jogo.
- Implemente 3 Cartas de Ajuda (Exemplo: "Radar" que revela a posição de uma mina, "Visão Limpa" ou "Dica Segura").
- Implemente 3 Cartas de Penalidade (Exemplo: "Névoa" que oculta os números por alguns segundos, "Tremores" ou "Cegueira"). Fique à vontade para definir o efeito exato das cartas, desde que modifiquem o estado do jogo.

Instruções de Raciocínio (Chain-of-Thought):
Para evitar erros no gerenciamento do relógio e da grade, pense passo a passo e documente seu raciocínio antes de gerar qualquer código:

- Passo 1: Descreva como você vai estruturar o estado (State) da aplicação para suportar a matriz do tabuleiro, as regras de vitória/derrota e o loop contínuo do temporizador de cartas.
- Passo 2: Detalhe a lógica matemática e os efeitos visuais das 6 cartas criadas, explicando como cada uma vai injetar alterações no estado principal sem quebrar o jogo.
- Passo 3: Liste a divisão de componentes React que você utilizará (ex: Board, Cell, CardAlert).
- Passo 4: Somente após detalhar os três passos acima, escreva o código funcional e completo da aplicação.

## Numero de tokens

Sessão (soma das 5 linhas do CSV `usage-events-2026-08-17.csv`):

- input: 76008 (sem cache write)
- output: 22303
- cache read: 796416
- total: 894727

Os 2 prompts geraram 5 eventos de usage no Cursor (loops do agente), todos com modelo `auto` e custo `Included`:

| Horário (UTC) | Input (w/o cache) | Cache read | Output | Total |
| --- | ---: | ---: | ---: | ---: |
| 2026-08-16 23:28:24 | 24599 | 12928 | 483 | 38010 |
| 2026-08-16 23:30:04 | 1283 | 79360 | 791 | 81434 |
| 2026-08-16 23:30:51 | 43781 | 475904 | 18610 | 538295 |
| 2026-08-16 23:36:21 | 867 | 43520 | 151 | 44538 |
| 2026-08-16 23:48:29 | 5478 | 184704 | 2268 | 192450 |

## Numero de arquivos gerados

29

## Tempo de execução

20m 5s

(primeiro evento 23:28:24 → último 23:48:29, UTC)

## Preço do token

- input: Included
- output: Included

O export marca `Cost = Included` em todas as chamadas. Não há preço unitário (USD / 1M) no CSV para o modelo Auto.

## Modelo usado

Cursor Auto (`auto`)

## Link para o usage do perfil no site do Cursor

https://cursor.com/dashboard/usage
