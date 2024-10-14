<template>
  <div class="container">
    <div class="preguntas-container">
    <h2>PREGUNTES AUTOESCOLA SALMA c; </h2>
    <ul>
      <li v-for="pregunta in preguntes" :key="pregunta.id">
        <h3>{{ pregunta.pregunta }}</h3>
        <img :src="pregunta.imatge" alt="Pregunta" />
        <ol type="1">
          <li v-for="respuesta in pregunta.respostes" :key="respuesta.id">
            {{ respuesta.resposta }} - 
            <span v-if="respuesta.correcta">Correcta</span>
          </li>
        </ol>
        <button @click="editarPregunta(pregunta)">✏️</button>
        <button @click="eliminarPregunta(pregunta.id)">❌</button>
      </li>
    </ul>
    </div>
  </div>
    <div class="form-container">
    <h2 v-if="preguntaEditada.id">EDITAR PREGUNTA</h2>
    <form v-if="preguntaEditada.id" @submit.prevent="guardar">
      <label for="pregunta">Pregunta:</label>
      <br>
      <input v-model="preguntaEditada.pregunta" id="pregunta" required />
<br>
      <label>Respostes:</label>
      <div v-for="(resposta, index) in preguntaEditada.respostes" :key="resposta.id">
        <input v-model="resposta.resposta" :placeholder="'Resposta ' + (index + 1)" required />
        <label>
          <input type="checkbox" v-model="resposta.correcta" /> Correcta
        </label>
      </div>

      <button type="submit">Actualitzar</button>
    </form>

    <h2>AFEGIR PREGUNTA</h2>
    <form @submit.prevent="afegirPregunta">
      <label for="nuevaPregunta">Pregunta:</label>
      <br>
      <input v-model="nuevaPregunta" id="nuevaPregunta" required />
<br>
      <label for="nuevaImatge">Img URL:</label>
      <br>
      <input v-model="nuevaImatge" id="nuevaImatge" />
      <br>
      <label>Respostes:</label>
      <br>
      <div v-for="index in 4" :key="index">
        <input v-model="nuevasRespostes[index - 1].resposta" :placeholder="'Resposta ' + index" required />
        <label>
          <input type="checkbox" v-model="nuevasRespostes[index - 1].correcta" /> Correcta
        </label>
      </div>

      <button type="submit">Afegir Pregunta</button>
    </form>
  </div>
  
  <div>
    <h1 id="stats">Estadistiques del Quiz</h1>
    <img :src="imageSrc" alt="estadistiques" />
  </div>


</template>

<script>
export default {
  data() {
    return {
      preguntes: [], // Almacena las preguntas
      preguntaEditada: { // Para editar preguntas
        id: null,
        pregunta: '',
        respostes: [],
        imatge: '',
      },
      nuevaPregunta: '', // Para agregar una nueva pregunta
      nuevaImatge: '', // Para la imagen de la nueva pregunta
      nuevasRespostes: [ // Respuestas para la nueva pregunta, siempre 4
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
      ],
      imageSrc: './public/output.png', // URL de la imagen
    };
  },
  methods: {

    async obtenerPreguntas() {
      const response = await fetch('http://dam.inspedralbes.cat:23333/preguntas');
      if (response.ok) {
        this.preguntes = await response.json();
      } else {
        console.error('Error al obtener preguntas');
      }
    },
    async afegirPregunta() {
      const nuevaPreguntaData = {
        id: this.preguntes.length + 1, // Generar un nuevo ID
        pregunta: this.nuevaPregunta,
        respostes: this.nuevasRespostes,
        imatge: this.nuevaImatge,
      };

      try {
        const response = await fetch('http://dam.inspedralbes.cat:23333/preguntas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaPreguntaData),
        });

        if (response.ok) {
          const preguntaAgregada = await response.json();
          this.preguntes.push(preguntaAgregada); // Agregar a la lista
          this.limpiarFormulario();
        } else {
          console.error('Error al afegir');
        }
      } catch (error) {
        console.error(error);
      }
    },
    limpiarFormulario() {
      this.nuevaPregunta = '';
      this.nuevaImatge = '';
      this.nuevasRespostes = [ // Reiniciar las respuestas
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
        { resposta: '', correcta: false },
      ];
    },
    editarPregunta(pregunta) {
      this.preguntaEditada = JSON.parse(JSON.stringify(pregunta)); // Hacer una copia
    },
    async guardar() {
      try {
        const response = await fetch(`http://dam.inspedralbes.cat:23333/preguntas/${this.preguntaEditada.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.preguntaEditada),
        });

        if (response.ok) {
          const preguntaActualizada = await response.json();
          const index = this.preguntes.findIndex(p => p.id === preguntaActualizada.id);
          if (index !== -1) {
            this.preguntes.splice(index, 1, preguntaActualizada);
          }
          this.preguntaEditada = { id: null, pregunta: '', respostes: [] }; // Resetear el formulario
        } else {
          console.error('Error al guardar ');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async eliminarPregunta(id) {
        try {
          const response = await fetch(`http://dam.inspedralbes.cat:23333/preguntas/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            this.preguntes = this.preguntes.filter(p => p.id !== id);
          } else {
            console.error('Error al eliminar');
          }
        } catch (error) {
          console.error( error);
        }
      }
    },
  mounted() {
    this.obtenerPreguntas(); // Obtener preguntas al cargar el componente
  },
};
</script>


<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: 50px ;
}

h2 {
  margin-top: 20px;
}
form {
  margin-bottom: 20px;
}
img {
  width: 200px;
  height: 150px; 

}

button {
  margin: 10px;
}
</style>
