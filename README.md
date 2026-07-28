# Task Manager API

API REST simples baseada em [json-server](https://github.com/typicode/json-server), criada para servir de backend ao frontend do Task Manager (https://github.com/vicgopfert/task-manager).

As requisições de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) alteram o banco de verdade, mas o alcance dessa alteração depende de onde a API está rodando:

| Ambiente | Onde grava | Persistência |
| --- | --- | --- |
| Local (`npm start`) | o próprio `db.json` | permanente, sobrevive a reinícios |
| Vercel | cópia no diretório temporário | dura enquanto a instância estiver ativa; volta ao estado do `db.json` no cold start |

> Na Vercel o filesystem da função é somente leitura (exceto o diretório temporário), então não há como gravar no `db.json` publicado. Instâncias concorrentes também não compartilham estado. Isso é intencional — o foco do projeto é a apresentação do frontend, não a persistência dos dados.

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

Como o filesystem da Vercel é somente leitura, `api/server.js` detecta o ambiente pela variável `VERCEL` e, quando está em produção, copia o `db.json` para o diretório temporário no cold start e passa a gravar nessa cópia. Localmente ele grava direto no `db.json`. Em ambos os casos o json-server usa o adapter `FileSync` do lowdb, então as escritas funcionam normalmente.

O `db.json` é lido em tempo de execução, e não por `require`, então o file tracing da Vercel não o detecta sozinho — daí o `includeFiles` no `vercel.json`, que garante que o arquivo seja empacotado junto com a função.

## Estrutura

```
.
├── api/
│   └── server.js    # app Express + json-server (handler da Vercel)
├── db.json          # estado inicial dos dados
├── vercel.json      # rewrites e config da função
└── package.json
```
