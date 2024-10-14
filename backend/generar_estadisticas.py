import json
import matplotlib.pyplot as plt
import numpy as np
plt.style.use('classic')

data_path = "./estadisticas.json"

with open(data_path, 'r') as f:
    data = json.load(f)

def estadisticas_pregunta(data):
    estadisticas = {}

    for partida in data["partidas"]:
        for pregunta in partida["preguntas"]:
            question_id = pregunta["questionId"]
            correct = pregunta["correct"]

            if question_id not in estadisticas:
                estadisticas[question_id] = {"correctes": 0, "incorrectes": 0}

            if correct:
                estadisticas[question_id]["correctes"] += 1
            else:
                estadisticas[question_id]["incorrectes"] += 1

    return estadisticas

estadisticas = estadisticas_pregunta(data)

preguntas = list(estadisticas.keys())
correctes = [estadisticas[q]["correctes"] for q in preguntas]
incorrectes = [estadisticas[q]["incorrectes"] for q in preguntas]

x = np.arange(len(preguntas))
width = 0.35

fig, ax = plt.subplots()
bars_correctes = ax.bar(x - width/2, correctes, width, label='correctes', color='g')
bars_incorrectes = ax.bar(x + width/2, incorrectes, width, label='incorrectes', color='r')

ax.set_xlabel('ID de Pregunta')
ax.set_ylabel('Quantitat')
ax.set_title('Respostes correctes e incorrectes per Pregunta')
ax.set_xticks(x)
ax.set_xticklabels(preguntas)
ax.legend()

plt.show()

plt.close()
