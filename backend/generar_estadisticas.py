import json
import matplotlib.pyplot as plt

data_path = "./estadisticas.json"

with open(data_path, 'r') as f:
    data = json.load(f)

def obtener_estadisticas(data):
    correctas = 0
    incorrectas = 0

    for partida in data["partidas"]:
        for pregunta in partida["preguntas"]:
            if pregunta["correct"]:
                correctas += 1
            else:
                incorrectas += 1

    return correctas, incorrectas

# Obtener las estadísticas
correctas, incorrectas = obtener_estadisticas(data)

# Crear gráfico de quesitos
labels = 'Correctas', 'Incorrectas'
sizes = [correctas, incorrectas]
colors = ['#66b3ff', '#ff6666']

plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
plt.axis('equal')  # Asegurar que el gráfico sea circular
plt.title("Porcentaje de Respuestas Correctas e Incorrectas")
plt.savefig("public/estadisticas.png")  # Guarda la imagen en la carpeta 'public'
