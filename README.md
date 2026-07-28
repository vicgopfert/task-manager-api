# Task Manager API

API REST simples baseada em [json-server](https://github.com/typicode/json-server), criada para servir de backend ao frontend do Task Manager (https://github.com/vicgopfert/task-manager).

> **Os dados não são persistidos.** A API roda em memória: cada reinício (ou cold start na Vercel) recarrega o estado inicial do `db.json`. Isso é intencional — o foco do projeto é a apresentação do frontend.

## Rodando localmente

```bash
npm install
npm start
```

A API sobe em `http://localhost:3000`.

## Endpoints

Todas as rotas também respondem sob o prefixo `/api` (ex.: `/api/tasks` é equivalente a `/tasks`).

### Tasks

| Método   | Rota         | Descrição                                       |
| -------- | ------------ | ----------------------------------------------- |
| `GET`    | `/tasks`     | Lista todas as tarefas                          |
| `GET`    | `/tasks/:id` | Retorna uma tarefa                              |
| `POST`   | `/tasks`     | Cria uma tarefa (`id` é gerado automaticamente) |
| `PUT`    | `/tasks/:id` | Substitui uma tarefa                            |
| `PATCH`  | `/tasks/:id` | Atualiza campos de uma tarefa                   |
| `DELETE` | `/tasks/:id` | Remove uma tarefa                               |

Formato de uma tarefa:

```json
{
  "id": 1,
  "title": "Estudar",
  "description": "Estudar curso de React",
  "time": "morning",
  "status": "not_started"
}
```

- `time`: `morning` | `afternoon` | `evening`
- `status`: `not_started` | `in_progress` | `done`

### Water

Recurso singular (objeto, não lista) para o consumo de água.

| Método  | Rota     | Descrição               |
| ------- | -------- | ----------------------- |
| `GET`   | `/water` | Retorna o consumo atual |
| `PATCH` | `/water` | Atualiza o consumo      |

```json
{ "consumed": 1500 }
```

### Filtros

O json-server aceita query params para filtrar e ordenar:

```
GET /tasks?status=done
GET /tasks?time=morning&status=in_progress
GET /tasks?_sort=title&_order=asc
```

## Exemplos

```bash
# listar tarefas concluídas
curl http://localhost:3000/tasks?status=done

# criar uma tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Treinar","description":"Musculação","time":"morning","status":"not_started"}'

# marcar como concluída
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# atualizar consumo de água
curl -X PATCH http://localhost:3000/water \
  -H "Content-Type: application/json" \
  -d '{"consumed":2000}'
```

## CORS

Liberado por padrão pelo json-server — o frontend pode consumir a API de qualquer origem, sem configuração extra.

## Deploy

O projeto está configurado para a Vercel. O `vercel.json` redireciona todas as requisições para `api/server.js`, que exporta o app Express como handler serverless.

```bash
vercel
```

Como o filesystem da Vercel é somente leitura, `api/server.js` carrega o `db.json` como objeto (`require`), fazendo o json-server usar o adapter em memória do lowdb. É o que permite que `POST`, `PATCH` e `DELETE` funcionem sem erro — ao custo de não persistirem entre invocações.

## Estrutura

```
.
├── api/
│   └── server.js    # app Express + json-server (handler da Vercel)
├── db.json          # estado inicial dos dados
├── vercel.json      # rewrites e config da função
└── package.json
```
