
from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, 'static/audio/music')
VINHETA_DIR = os.path.join(BASE_DIR, 'static/audio/vinhetas')
SLIDES_DIR = os.path.join(BASE_DIR, 'static/images')

@app.route('/')
def index():
    return render_template("index.html",
        musicas=os.listdir(MUSIC_DIR),
        vinhetas=os.listdir(VINHETA_DIR),
        slides=os.listdir(SLIDES_DIR))

@app.route('/upload/music', methods=['POST'])
def upload_music():
    for f in request.files.getlist("files"):
        f.save(os.path.join(MUSIC_DIR, f.filename))
    return redirect(url_for('index'))

@app.route('/upload/vinheta', methods=['POST'])
def upload_vinheta():
    for f in request.files.getlist("files"):
        f.save(os.path.join(VINHETA_DIR, f.filename))
    return redirect(url_for('index'))

@app.route('/upload/slide', methods=['POST'])
def upload_slide():
    for f in request.files.getlist("files"):
        f.save(os.path.join(SLIDES_DIR, f.filename))
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
