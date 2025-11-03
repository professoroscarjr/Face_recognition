 Sistema de Identificação Facial (Face ID)Projeto full-stack implementado com React no Frontend, Node.js/Express no Backend e MySQL como banco de dados. Utiliza a biblioteca face-api.js para realizar a detecção, extração de descritores e reconhecimento facial.🚀 Tecnologias UtilizadasCamadaTecnologiaDescriçãoFrontendReact (CRA), face-api.jsInterface de usuário e processamento facial no lado do cliente.BackendNode.js, ExpressAPI RESTful para manipulação de dados de usuários e descritores faciais.Banco de DadosMySQLArmazenamento persistente das informações de usuário e dos descritores faciais (vetores numéricos).FerramentasGit, npm/Yarn, WebpackGerenciamento de versão e pacotes.⚙️ Pré-requisitosPara rodar este projeto, você precisará ter instalado em sua máquina:Node.js (versão 14+) e npm (ou Yarn)MySQL Server (ou utilizar um serviço como XAMPP/WAMP/Docker para o servidor MySQL)Git🏗️ Configuração do ProjetoSiga os passos abaixo para configurar e rodar o projeto.1. Clonar o RepositórioBash# Clone o projeto em sua máquina local
git clone https://www.youtube.com/watch?v=RqfwLeY952s
cd [NOME DA PASTA PRINCIPAL DO PROJETO]
2. Configuração do Banco de Dados MySQLVocê deve criar um banco de dados e a tabela necessária para armazenar as informações do usuário e os descritores faciais.A. Criar o Banco de DadosAcesse seu cliente MySQL (Workbench, terminal, DBeaver, etc.) e crie um novo banco de dados.SQLCREATE DATABASE IF NOT EXISTS face_id_db;
USE face_id_db;
B. Criar a Tabela de UsuáriosA tabela deve incluir um campo para o descritor facial (face_descriptor), que será um vetor numérico de alta dimensão (128 elementos no face-api.js).SQLCREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    # O descritor facial é armazenado como texto JSON
    face_descriptor JSON NOT NULL
);
3. Configuração do Backend (Node/Express)Navegue até a pasta do backend, instale as dependências e configure as variáveis de ambiente.Bashcd face-recognition-backend
npm install
Variáveis de AmbienteCrie um arquivo chamado .env na raiz da pasta face-recognition-backend e preencha com suas credenciais do MySQL:Fragmento do código# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=face_id_db

# Porta do Servidor Node (pode ser 3001 para não conflitar com o React)
PORT=3001
4. Configuração do Frontend (React) e Modelos de IANavegue até a pasta do frontend e instale as dependências.Bashcd ../face-recognition-frontend
npm install
Modelos de face-api.jsO projeto requer que os modelos de Machine Learning sejam carregados a partir de um caminho estático.Crie a pasta estática:Bashmkdir public/models
Baixe os modelos: Baixe os arquivos de modelos necessários (arquivos .json e .weights/_shard) da biblioteca face-api.js. Você geralmente precisará dos modelos de:ssd_mobilenetv1 (Detecção)face_landmark_68 (Landmarks)face_recognition (Descritores)Coloque todos os arquivos baixados dentro da pasta recém-criada:face-recognition-frontend/
└── public/
    └── models/  <--- COLOQUE OS ARQUIVOS AQUI
▶️ Como Rodar o ProjetoVocê precisa iniciar o Backend e o Frontend separadamente.1. Iniciar o BackendNa pasta face-recognition-backend, execute:Bashnpm start
# O servidor será iniciado em http://localhost:3001
2. Iniciar o FrontendEm um novo terminal, na pasta face-recognition-frontend, execute:Bashnpm start
# A aplicação será aberta em http://localhost:3000
O projeto deve estar funcionando! Você poderá usar a aplicação para cadastrar faces (que armazenará o descritor no MySQL via API) e realizar o reconhecimento facial.Caso você tenha seguido a sugestão anterior e usado o craco para eliminar o aviso do source-map-loader, inclua uma nota rápida sobre como iniciar:Nota: Se você configurou o craco, use npm start (no frontend) que o craco cuidará da inicialização e configuração do Webpack.
