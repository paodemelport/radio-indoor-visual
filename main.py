
from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'static/audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/configuracoes')
def configuracoes():
    vinhetas = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], 'vinhetas'))
    anuncios = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], 'anuncios'))
    return render_template('configuracoes.html', vinhetas=vinhetas, anuncios=anuncios)

@app.route('/upload_music', methods=['POST'])
def upload_music():
    estilo = request.form.get('estilo')
    if not estilo:
        return "Estilo não selecionado", 400
    files = request.files.getlist('files')
    for file in files:
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], estilo, filename)
        file.save(path)
    return redirect(url_for('configuracoes'))

@app.route('/upload_vinheta', methods=['POST'])
def upload_vinheta():
    files = request.files.getlist('files')
    for file in files:
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], 'vinhetas', filename)
        file.save(path)
    return redirect(url_for('configuracoes'))

@app.route('/upload_anuncio', methods=['POST'])
def upload_anuncio():
    files = request.files.getlist('files')
    for file in files:
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], 'anuncios', filename)
        file.save(path)
    return redirect(url_for('configuracoes'))

if __name__ == '__main__':
    app.run(debug=True)
