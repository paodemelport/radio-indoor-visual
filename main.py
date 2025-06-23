from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Diretórios de mídia
MUSIC_DIR = "static/audio/music"
VINHETA_DIR = "static/audio/vinhetas"
SLIDES_DIR = "static/images"

# Criação dos diretórios, se não existirem
os.makedirs(MUSIC_DIR, exist_ok=True)
os.makedirs(VINHETA_DIR, exist_ok=True)
os.makedirs(SLIDES_DIR, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html",
        musicas=os.listdir(MUSIC_DIR),
        vinhetas=os.listdir(VINHETA_DIR),
        slides=os.listdir(SLIDES_DIR)
    )

@app.route("/upload/music", methods=["POST"])
def upload_music():
    files = request.files.getlist("files")
    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(MUSIC_DIR, filename))
    return redirect(url_for("index"))

@app.route("/upload/vinheta", methods=["POST"])
def upload_vinheta():
    files = request.files.getlist("files")
    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(VINHETA_DIR, filename))
    return redirect(url_for("index"))

@app.route("/upload/slide", methods=["POST"])
def upload_slide():
    files = request.files.getlist("files")
    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(SLIDES_DIR, filename))
    return redirect(url_for("index"))

@app.route("/programacao")
def programacao():
    agenda = {
        "segunda": "Pop e Rock",
        "terca": "MPB e Samba",
        "quarta": "Instrumental",
        "quinta": "Flashback",
        "sexta": "Eletrônica",
        "sabado": "Clássicos",
        "domingo": "Diversos"
    }
    return render_template("programacao.html", agenda=agenda)

if __name__ == "__main__":
    app.run(debug=True)
