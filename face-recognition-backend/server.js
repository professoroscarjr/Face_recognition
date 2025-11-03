// face-recognition-backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

// --- Configuração e Conexão com o MySQL ---
const dbConfig = {
    host: 'localhost',
    user: 'root', // Altere se necessário
    password: '', // **Altere para a sua senha do MySQL**
    database: 'face_db',
};

let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o MySQL estabelecida!');
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error);
    }
}
connectDB();

// --- Configuração do Express ---
app.use(cors()); // Permite requisições do frontend React
app.use(express.json({ limit: '50mb' })); // Aceita JSON no corpo da requisição

// --- Funções de Lógica ---

// Calcula a Distância Euclidiana entre dois vetores (descritores)
const euclideanDistance = (desc1, desc2) => {
    if (desc1.length !== desc2.length) {
        throw new Error('Descritores devem ter o mesmo tamanho');
    }
    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
        sum += Math.pow(desc1[i] - desc2[i], 2);
    }
    return Math.sqrt(sum);
};

// --- ROTAS DA API ---

// Rota de Cadastro
app.post('/api/cadastrar', async(req, res) => {
    const { username, descriptor } = req.body;

    if (!username || !descriptor) {
        return res.status(400).json({ error: 'Nome de usuário e descritor facial são obrigatórios.' });
    }

    try {
        // Salva o nome e o vetor facial (como string JSON) no banco
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nome, face_descriptor) VALUES (?, ?)', [username, JSON.stringify(descriptor)]
        );

        res.status(201).json({
            message: `Usuário '${username}' cadastrado com sucesso. ID: ${result.insertId}`
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno ao cadastrar o rosto.' });
    }
});

// Rota de Reconhecimento
app.post('/api/reconhecer', async(req, res) => {
    const { descriptor: inputDescriptor } = req.body;
    const DISTANCE_THRESHOLD = 0.6; // Limite de tolerância. Menor que isso é considerado a mesma pessoa.

    if (!inputDescriptor) {
        return res.status(400).json({ error: 'Descritor facial não fornecido.' });
    }

    try {
        // Busca todos os usuários cadastrados
        const [users] = await connection.execute('SELECT id, nome, face_descriptor FROM usuarios');

        if (users.length === 0) {
            return res.status(404).json({ message: 'Nenhum rosto cadastrado no banco de dados.' });
        }

        let bestMatch = { user: null, distance: Infinity };

        // Compara o descritor de entrada com todos os cadastrados
        for (const user of users) {
            const storedDescriptor = JSON.parse(user.face_descriptor);

            // Note: O JSON.parse transforma o array de string em array de number, pronto para a comparação
            const distance = euclideanDistance(inputDescriptor, storedDescriptor);

            if (distance < bestMatch.distance) {
                bestMatch = { user, distance };
            }
        }

        // Verifica se o melhor match está abaixo do limite de tolerância
        if (bestMatch.distance < DISTANCE_THRESHOLD) {
            res.json({
                message: `Reconhecido! Olá, ${bestMatch.user.nome}. Distância: ${bestMatch.distance.toFixed(4)}`,
                user: bestMatch.user.nome,
                distance: bestMatch.distance,
            });
        } else {
            res.status(404).json({
                error: `Rosto não reconhecido. A menor distância foi ${bestMatch.distance.toFixed(4)}.`
            });
        }

    } catch (error) {
        console.error('Erro no reconhecimento:', error);
        res.status(500).json({ error: 'Erro interno durante o reconhecimento facial.' });
    }
});

// Inicialização do Servidor
app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`);
});