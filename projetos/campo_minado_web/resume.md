# Resume — campo_minado_web

Fonte: `CAMPO MINADO.docx` (Google AI Studio — Build). Chamadas de criação no modo Build **não tiveram tokens coletados**; os números abaixo são só dos testes A e B evidenciados na API.

## Texto de Input

### System Prompt

Você é um desenvolvedor de software especializado em desenvolvimento web front-end, com foco em HTML, CSS e JavaScript.
Sua função é auxiliar no desenvolvimento de um jogo Campo Minado Web completo, funcional, responsivo e organizado.
Durante o desenvolvimento, siga estas regras:
Utilize HTML, CSS e JavaScript de forma clara e organizada.
Priorize código simples, legível e fácil de manter.
Não utilize bibliotecas ou frameworks externos sem necessidade.
Separe adequadamente estrutura, estilo e lógica da aplicação.
Preserve funcionalidades já implementadas ao realizar alterações.
Não remova funcionalidades existentes sem solicitação explícita.
Explique de forma objetiva mudanças importantes realizadas no projeto.
Evite adicionar funcionalidades que não tenham sido solicitadas.
O jogo deve funcionar diretamente no navegador.
O Campo Minado deverá possuir como funcionalidades principais:
geração aleatória de minas; revelação de células; indicação numérica da quantidade de minas próximas; colocação e remoção de bandeiras; contador de minas/bandeiras; cronômetro da partida; condição de vitória; condição de derrota; possibilidade de reiniciar a partida; níveis de dificuldade Fácil, Médio e Difícil; seleção de diferentes cenários visuais pelo jogador.
Os cenários visuais iniciais serão: Clássico Verde; Noite; Neve; Deserto.
A escolha do cenário deve modificar apenas a aparência visual da aplicação, sem alterar as regras, a distribuição das minas ou a dificuldade da partida.

### User Prompt (primeira chamada — criação)

Crie a primeira versão funcional do projeto Campo Minado Web.
Nesta primeira versão, implemente:
interface principal do jogo; tabuleiro funcional; geração aleatória de minas; revelação de células; números indicando minas adjacentes; colocação e  remoção de bandeiras com o botão direito; contador de minas; cronômetro; condição de vitória e derrota; botão para reiniciar; seletor de dificuldade com Fácil, Médio e Difícil; seletor de cenário com Clássico Verde, Noite, Neve e Deserto.
O visual inicial pode utilizar o cenário Clássico Verde como padrão.

Técnica: Few-shot Prompting (4 exemplos de bandeira, flood fill e troca de cenário). Houve uma segunda chamada de melhoria visual dos cenários, também sem tokens coletados.

## Numero de tokens

Chamadas Build (criação + cenários): não coletados — sem estimativa.

Testes de curadoria evidenciados (Gemini API):

| Chamada | input | output |
| --- | ---: | ---: |
| Teste A — contexto completo | 751 | 774 |
| Teste B — contexto curado | 308 | 368 |
| **Soma evidenciada** | **1059** | **1142** |

- input: 1059
- output: 1142

Teste B também registrou thoughtsTokenCount 651. Teste A: totalTokenCount 2808 (thinking não comprovado).

## Numero de arquivos gerados

22

## Tempo de execução

não disponível

## Preço do token

- input: $0.75 / 1M
- output: $3.75 / 1M

Custo estimado só dos testes A+B: US$ 0,00346575 + US$ 0,00161100 = US$ 0,00507675.

## Modelo usado

Gemini 3.7 Flash (`gemini-3.7-flash`) · Google AI Studio Build · thinking level padrão (não especificado)

## Link para o usage do perfil no site do Cursor

https://cursor.com/dashboard/usage

App no AI Studio: https://ai.studio/apps/6da0ac09-9b9e-409f-8c75-aec7fa93e646
