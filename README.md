# 👁️ Sistema de Identificação Facial (Face ID)

Este projeto é uma aplicação full-stack para reconhecimento facial, utilizando uma arquitetura robusta com React para o Frontend, Node.js/Express para o Backend e MySQL para o gerenciamento persistente dos dados de usuários e dos vetores faciais (descritores).

A funcionalidade de IA é potencializada pela biblioteca **`face-api.js`**, que permite a detecção e o cálculo dos descritores faciais diretamente no navegador do usuário.

## ✨ Funcionalidades Principais

* **Cadastro de Usuário:** Registra novos usuários tirando uma foto e extraindo um vetor numérico de 128 dimensões (o descritor facial).
* **Armazenamento Seguro:** O nome do usuário, e-mail e o vetor descritor são armazenados de forma persistente no banco de dados MySQL.
* **Reconhecimento Facial:** Compara o descritor facial da pessoa que tenta fazer o login com todos os descritores armazenados no banco de dados para identificar o usuário.
* **Arquitetura Modular:** Separação clara entre a aplicação cliente (Frontend) e a API de dados (Backend).

## 🚀 Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | React (CRA) | Interface de usuário e lógica do cliente. |
| **Visão Computacional**| `face-api.js` | Detecção e extração de descritores faciais baseada em TensorFlow.js. |
| **Backend** | Node.js, Express | API RESTful para comunicação com o banco de dados. |
| **Banco de Dados**| MySQL | Armazenamento de dados do usuário e dos descritores faciais (`JSON` field). |

## ⚙️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* **Node.js** (versão 14 ou superior)
* **npm** (ou Yarn)
* **MySQL Server**
* **Git**

## 🏗️ Guia de Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Passo 1: Clonar o Repositório

```bash
# Clone o projeto
git clone [https://www.youtube.com/watch?v=RqfwLeY952s](https://www.youtube.com/watch?v=RqfwLeY952s)
cd [NOME DA PASTA PRINCIPAL DO PROJETO]
