# Mina das Cartas

Campo minado clássico com mecânica roguelike de cartas. A cada minuto de partida, uma carta de ajuda ou penalidade é sorteada e aplicada automaticamente.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4

## Como rodar

```bash
npm install
npm run dev
```

## Dificuldades

| Nível  | Grade  | Minas |
|--------|--------|-------|
| Fácil  | 9×9    | 10    |
| Médio  | 16×16  | 40    |
| Difícil| 16×30  | 99    |

## Cartas

**Ajuda:** Radar, Dica Segura (revela 3/12/18 células no Fácil/Médio/Difícil), Varredura  
**Penalidade:** Névoa, Tremores, Cegueira

Controles: clique esquerdo revela · clique direito marca bandeira.
