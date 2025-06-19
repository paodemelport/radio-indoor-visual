from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Diretórios de mídia
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR  = os.path.join(BASE_DIR, 'static')
MUSIC_DIR   = os.path.join(STATIC_DIR, 'audio', 'music')
VINHETA_DIR = os.path.join(STATIC_DIR, 'audio', 'vinhetas')
SLIDES_DIR  = os.path.join(STATIC_DIR, 'images')

# Cria as pastas se não existirem
for d in (MUSIC_DIR, VINHETA_DIR, SLIDES_DIR):
    os.makedirs(d, exist_ok=True)

# Extensões permitidas
ALLOWED_AUDIO  = {'mp3', 'wav', 'ogg'}
ALLOWED_IMAGES = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename, allowed):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

@app.route('/', methods=['GET'])
def index():
    musicas  = sorted(os.listdir(MUSIC_DIR))
    vinhetas = sorted(os.listdir(VINHETA_DIR))
    slides   = sorted(os.listdir(SLIDES_DIR))
    return render_template('index.html',
        musicas=musicas, vinhetas=vinhetas, slides=slides
    )

@app.route('/upload/music', methods=['POST'])
def upload_music():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_AUDIO):
        fn = secure_filename(f.filename)
        f.save(os.path.join(MUSIC_DIR, fn))
    return redirect(url_for('index') + '#musicas')

@app.route('/upload/vinheta', methods=['POST'])
def upload_vinheta():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_AUDIO):
        fn = secure_filename(f.filename)
        f.save(os.path.join(VINHETA_DIR, fn))
    return redirect(url_for('index') + '#vinhetas')

@app.route('/upload/slide', methods=['POST'])
def upload_slide():
    f = request.files.get('file')
    if f and allowed_file(f.filename, ALLOWED_IMAGES):
        fn = secure_filename(f.filename)
        f.save(os.path.join(SLIDES_DIR, fn))
    return redirect(url_for('index') + '#slides')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
