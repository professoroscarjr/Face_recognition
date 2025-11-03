// face-recognition-frontend/src/App.js

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const App = () => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    // --- 1. Carregamento dos Modelos de IA ---
    useEffect(() => {
        const loadModels = async() => {
            const MODEL_URL = '/models'; // Caminho para public/models
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
            setMessage('Modelos de IA carregados. Pronto para uso.');
        };
        loadModels();
    }, []);

    // --- 2. Função Central para Detecção e Geração do Embedding ---
    const getFaceDescriptor = async() => {
        if (!webcamRef.current || !webcamRef.current.video || !modelsLoaded) {
            setMessage('Webcam ou modelos de IA não estão prontos.');
            return null;
        }

        const video = webcamRef.current.video;

        // Detecta o rosto e calcula o descritor (embedding)
        const detection = await faceapi.detectSingleFace(video,
            new faceapi.SsdMobilenetv1Options()
        ).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            // O descritor é um Float32Array, convertemos para Array de JS para enviar
            return Array.from(detection.descriptor);
        } else {
            setMessage('Nenhum rosto detectado. Posicione-se melhor.');
            return null;
        }
    };

    // --- 3. Cadastro de Rosto (Enviar para o Backend) ---
    const handleCadastro = useCallback(async() => {
        if (!username.trim()) {
            setMessage('Por favor, insira um nome de usuário.');
            return;
        }

        setMessage('Capturando e cadastrando...');
        const descriptor = await getFaceDescriptor();

        if (descriptor) {
            try {
                const response = await axios.post(`${API_BASE_URL}/cadastrar`, {
                    username: username,
                    descriptor: descriptor,
                });
                setMessage(`Cadastro realizado: ${response.data.message}`);
            } catch (error) {
                setMessage(`Erro ao cadastrar: ${error.response?.data?.error || error.message}`);
            }
        }
    }, [username, modelsLoaded]);

    // --- 4. Reconhecimento Facial (Enviar para o Backend) ---
    const handleReconhecimento = useCallback(async() => {
        setMessage('Capturando e buscando...');
        const descriptor = await getFaceDescriptor();

        if (descriptor) {
            try {
                const response = await axios.post(`${API_BASE_URL}/reconhecer`, {
                    descriptor: descriptor,
                });
                setMessage(response.data.message);
            } catch (error) {
                setMessage(`Erro de reconhecimento: ${error.response?.data?.error || error.message}`);
            }
        }
    }, [modelsLoaded]);

    const videoConstraints = {
        width: 480,
        height: 360,
        facingMode: "user", // "user" para câmera frontal
    };

    return ( <
        div style = {
            { padding: 20, textAlign: 'center' }
        } >
        <
        h2 > Reconhecimento Facial Web < /h2> <
        p > Status: ** { message } ** < /p>

        <
        div style = {
            { border: '2px solid black', display: 'inline-block', marginBottom: 15 }
        } >
        <
        Webcam audio = { false }
        ref = { webcamRef }
        screenshotFormat = "image/jpeg"
        videoConstraints = { videoConstraints }
        style = {
            { width: 480, height: 360 }
        }
        /> </div >

        <
        hr / >

        <
        h3 > 1. Cadastro de Novo Rosto < /h3> <
        input type = "text"
        value = { username }
        onChange = {
            (e) => setUsername(e.target.value)
        }
        placeholder = "Nome do Usuário"
        style = {
            { padding: 10, marginRight: 10 }
        }
        />  <
        button onClick = { handleCadastro }
        disabled = {!modelsLoaded }
        style = {
            { padding: 10 }
        } >
        Cadastrar Rosto de { username || '...' } <
        /button>

        <
        hr / >

        <
        h3 > 2. Reconhecimento < /h3> <
        button onClick = { handleReconhecimento }
        disabled = {!modelsLoaded }
        style = {
            { padding: 10 }
        } >
        Reconhecer Rosto na Câmera <
        /button> < /
        div >
    );
};

export default App;