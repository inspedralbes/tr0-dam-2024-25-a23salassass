/**
 * const preguntes = await getPreguntes();
objPreguntes.llistaP=preguntes;



---
export async function getPreguntes(){
    const response = await fetch(`http://localhost:5000/preguntas/${id}`);
const preguntas = await response.json();
return preguntas;

}
*/