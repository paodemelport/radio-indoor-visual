from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, 'static', 'audio', 'music')
VINHETA_DIR = os.path.join(BASE_DIR, 'static', 'audio', 'vinhetas')
SLIDES_DIR = os.path.join(BASE_DIR, 'static', 'images')

ALLOWED_AUDIO = {'mp3', 'wav', 'ogg'}
ALLOWED_IMAGES = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

@app.route('/', methods=['GET'])
def index():
    musicas = os.listdir(MUSIC_DIR)
    vinhetas = os.listdir(VINHETA_DIR)
    slides = os.listdir(SLIDES_DIR)
    return render_template('index.html', musicas=musicas, vinhetas=vinhetas, slides=slides)

@app.route('/upload/music', methods=['POST'])
def upload_music():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_AUDIO):
        filename = secure_filename(f.filename)
        f.save(os.path.join(MUSIC_DIR, filename))
    return redirect(url_for('index') + '#musicas')

@app.route('/upload/vinheta', methods=['POST'])
def upload_vinheta():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_AUDIO):
        filename = secure_filename(f.filename)
        f.save(os.path.join(VINHETA_DIR, filename))
    return redirect(url_for('index') + '#vinhetas')

@app.route('/upload/slide', methods=['POST'])
def upload_slide():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_IMAGES):
        filename = secure_filename(f.filename)
        f.save(os.path.join(SLIDES_DIR, filename))
    return redirect(url_for('index') + '#slides')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
