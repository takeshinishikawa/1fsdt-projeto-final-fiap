# Sistema de Cadastro e Listagem de Veículos

Este projeto é um sistema de microsserviços para cadastro e listagem de veículos, desenvolvido com Node.js, TypeScript, MongoDB, RabbitMQ e Docker Compose.

## 📦 Estrutura dos Serviços

- **cadastro-service**: Responsável pelo cadastro de veículos, validação de dados, publicação de eventos no RabbitMQ e gerenciamento das marcas/modelos.
- **listagem-service**: Responsável por consumir os eventos de cadastro, armazenar veículos e expor endpoints para consulta e filtragem.
- **mongo**: Banco de dados MongoDB para persistência dos dados.
- **rabbitmq**: Broker de mensagens para comunicação entre os serviços.

## 🚀 Como rodar o projeto

1. **Clone o repositório:**
git clone git@github.com:takeshinishikawa/1fsdt-projeto-final-fiap.git


2. **Suba todos os serviços com Docker Compose:**
docker-compose up --build -d


3. **Acesse os serviços:**
- Cadastro de veículos: [http://localhost:3001/veiculos](http://localhost:3001/veiculos)
- Listagem de veículos: [http://localhost:3002/veiculos](http://localhost:3002/veiculos)
- Cadastro em lote de marcas/modelos: [http://localhost:3001/marcas-modelos/lote](http://localhost:3001/marcas-modelos/lote)
- Consulta de marcas/modelos: [http://localhost:3001/marcas-modelos](http://localhost:3001/marcas-modelos)
- RabbitMQ Management: [http://localhost:15672](http://localhost:15672) (usuário: guest, senha: guest)
- MongoDB: `localhost:27017` (padrão)
- observação: Caso queira, utilize a collection que deixei na raiz do projeto.

## 🛠️ Principais Endpoints

### Cadastro de veículo

POST /veiculos
Content-Type: application/json

{
"marca": "Fiat",
"modelo": "Uno",
"ano": 2020,
"placa": "ABC1234"
}


### Cadastro em lote de marcas/modelos

POST /marcas-modelos/lote
Content-Type: application/json

[
{ "marca": "Fiat", "modelos": ["Uno", "Palio", "Argo"] },
{ "marca": "Volkswagen", "modelos": ["Gol", "Polo", "Virtus"] }
]


### Consulta de marcas/modelos

GET /marcas-modelos


### Listagem de veículos

GET /veiculos
GET /veiculos?marca=Fiat&ano=2020
GET /veiculos/placa/:placa


## 🧑‍💻 Tecnologias Utilizadas

- Node.js + TypeScript
- Express.js
- MongoDB (via Mongoose)
- RabbitMQ (via amqplib)
- Docker & Docker Compose

## ⚙️ Validações e Segurança

- Validação de ano, placa (formatos antigo e novo), marca e modelo (apenas marcas/modelos cadastrados).
- Não permite cadastro de veículos duplicados (placa única).
- Mensagens de erro amigáveis para todos os casos de erro.

**Desenvolvido por Robson Takeshi Nishikawa**