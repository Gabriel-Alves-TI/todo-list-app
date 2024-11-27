# Todo List App


Este é um projeto de aplicação de lista de tarefas (Todo List) que permite criar, editar, remover e gerenciar suas tarefas de forma simples e eficiente. 

## 🚀 Tecnologias Utilizadas

- **Front-end**: HTML, CSS, JavaScript
- **Back-end**: Node.js, Express
- **Banco de Dados**: MySQL (via Sequelize ORM)

## 📂 Estrutura do Projeto

```plaintext
todo-list-app/
├── frontend/            # Código do front-end
│   ├── index.html       # Página inicial
│   ├── styles.css       # Estilo da aplicação
│   └── script.js        # Lógica de interação com o front-end
├── backend/             # Código do back-end
│   ├── models/          # Modelos do Sequelize
│   ├── routes/          # Rotas da API
│   ├── db.js            # Configuração do banco de dados (Sequelize)
│   └── server.js        # Inicialização do servidor
└── README.md            # Documentação do projeto
```
## ⚙️ Funcionalidades
* Adicionar Tarefa: Permite criar novas tarefas.
* Listar Tarefas: Exibe todas as tarefas registradas.
* Editar Tarefa: Atualiza uma tarefa existente.
* Excluir Tarefa: Remove uma tarefa do banco de dados.

## 🛠️ Configuração do Ambiente
1. Clone o Repositório

``` 
    git clone git@github.com:Gabriel-Alves-TI/todo-list-app.git
    cd todo-list-app
```
2. Configuração do Banco de Dados Certifique-se de que o MySQL está rodando. Atualize o arquivo backend/db.js com suas credenciais.

3. Instalar Dependências No diretório backend:

4. Acesse o Projeto: O front-end estará disponível em http://localhost:3000

## 📋 Rotas da API
**Tarefas**
* GET /tasks: Retorna todas as tarefas.
* POST /tasks: Cria uma nova tarefa.
* PUT /tasks/:id: Atualiza uma tarefa existente.
* DELETE /tasks/:id: Exclui uma tarefa.

##