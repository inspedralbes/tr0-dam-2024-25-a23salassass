const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Corrección: uuidv4 correcto

const app = express();
app.use(cors());
app.use(express.json());

const filePath = './preguntas.json'; // Archivo de preguntas
const estadisticasPath = './estadisticas.json'; // Archivo de estadísticas

// LEER ESTADISTICAS
const leerEstadisticas = () => {
  try {
    const data = fs.readFileSync(estadisticasPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { partidas: [] }; // Si el archivo no existe, crea una estructura vacía
  }
};

// GUARDAR ESTADISTICAS
const guardarEstadisticas = (estadisticas) => {
  fs.writeFileSync(estadisticasPath, JSON.stringify(estadisticas, null, 2)); // Corrección: usar la variable estadisticasPath
};

// Ruta para guardar estadísticas
app.post('/estadisticas', (req, res) => {
  const { userId, preguntas } = req.body;
  const idFaltante =  uuidv4(); // Corrección: uuidv4 correcto

  const estadisticas = leerEstadisticas();
  const partida = {
    userId: idFaltante,
    preguntas,
    timeStamp: new Date().toISOString() // Corrección: new Date() para fecha
  };
  estadisticas.partidas.push(partida);
  guardarEstadisticas(estadisticas);

  res.status(201).json({ message: 'Estadísticas guardadas', userId: idFaltante });
});

// Ruta para obtener estadísticas de un usuario
app.get('/estadisticas/:userId', (req, res) => {
  const userId = req.params.userId;
  const estadisticas = leerEstadisticas();
  const partidasUsuario = estadisticas.partidas.filter(partida => partida.userId === userId);

  if (partidasUsuario.length === 0) {
    return res.status(404).json({ error: 'No se encontraron partidas para este usuario.' });
  }
  res.json(partidasUsuario);
});

// LEER PREGUNTAS
const leerPreguntas = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// GUARDAR PREGUNTAS
const guardarPreguntas = (preguntes) => {
  fs.writeFileSync(filePath, JSON.stringify(preguntes, null, 2));
};

// Obtener todas las preguntas
app.get('/preguntas', (req, res) => {
  const preguntes = leerPreguntas();
  res.json(preguntes.preguntes);
});

// Obtener una pregunta por id
app.get('/preguntas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const preguntes = leerPreguntas();
  const pregunta = preguntes.preguntes.find(p => p.id === id);

  if (pregunta) {
    res.json(pregunta);
  } else {
    res.status(404).send('Pregunta no trobada');
  }
});

// Crear una nueva pregunta
app.post('/preguntas', (req, res) => {
  const nuevaPregunta = req.body;
  const preguntes = leerPreguntas();
  preguntes.preguntes.push(nuevaPregunta);
  guardarPreguntas(preguntes);
  res.status(201).json(nuevaPregunta);
});

// Actualizar una pregunta existente
app.put('/preguntas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const preguntaEditada = req.body;
  let preguntes = leerPreguntas();

  for (let i = 0; i < preguntes.preguntes.length; i++) {
    if (preguntes.preguntes[i].id === id) {
      preguntes.preguntes[i].pregunta = preguntaEditada.pregunta;
      for (let j = 0; j < preguntes.preguntes[i].respostes.length; j++) {
        preguntes.preguntes[i].respostes[j].resposta = preguntaEditada.respostes[j].resposta;
        preguntes.preguntes[i].respostes[j].correcta = preguntaEditada.respostes[j].correcta;
      }
      guardarPreguntas(preguntes);
      return res.json(preguntes.preguntes[i]);
    }
  }
  res.status(404).send('Pregunta no trobada');
});

// Eliminar una pregunta
app.delete('/preguntas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let preguntes = leerPreguntas();
  preguntes.preguntes = preguntes.preguntes.filter(p => p.id !== id);
  guardarPreguntas(preguntes);
  res.status(204).send(); // Respuesta vacía
});

// Iniciar el servidor
const PORT = 23333;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://dam.inspedralbes.cat:${PORT}`);
});

