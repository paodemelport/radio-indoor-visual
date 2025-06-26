from flask import Flask, render_template, request, redirect, url_for, send_from_directory, flash
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'radio_secret'

# Caminhos
UPLOAD_FOLDER = 'static/audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Criação automática das pastas
for pasta in ['musicas', 'vinhetas', 'anuncios']:
    os.makedirs(os.path.join(UPLOAD_FOLDER, pasta), exist_ok=True)

# ============== ROTAS ==============

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/configuracoes')
def configuracoes():
    estilos = ['pop', 'rock', 'mpb', 'sertanejo', 'gospel', 'outros']
    vinhetas = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], 'vinhetas'))
    anuncios = os.listdir(os.path.join(app.config['UPLOAD_FOLDER'], 'anuncios'))
    return render_template('configuracoes.html', estilos=estilos, vinhetas=vinhetas, anuncios=anuncios)

# ============== UPLOAD DE MÚSICAS ==============
@app.route('/upload_music', methods=['POST'])
def upload_music():
    estilo = request.form.get('estilo')
    if not estilo:
        flash('Selecione um estilo antes de enviar.')
        return redirect(url_for('configuracoes'))

    arquivos = request.files.getlist('files')
    for arquivo in arquivos:
        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            caminho = os.path.join(app.config['UPLOAD_FOLDER'], 'musicas', estilo)
            os.makedirs(caminho, exist_ok=True)
            arquivo.save(os.path.join(caminho, filename))
    flash('Músicas enviadas com sucesso!')
    return redirect(url_for('configuracoes'))

# ============== UPLOAD DE VINHETAS ==============
@app.route('/upload_vinheta', methods=['POST'])
def upload_vinheta():
    arquivos = request.files.getlist('files')
    for arquivo in arquivos:
        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            caminho = os.path.join(app.config['UPLOAD_FOLDER'], 'vinhetas')
            arquivo.save(os.path.join(caminho, filename))
    flash('Vinhetas enviadas com sucesso!')
    return redirect(url_for('configuracoes'))

# ============== UPLOAD DE ANÚNCIOS ==============
@app.route('/upload_anuncio', methods=['POST'])
def upload_anuncio():
    arquivos = request.files.getlist('files')
    for arquivo in arquivos:
        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            caminho = os.path.join(app.config['UPLOAD_FOLDER'], 'anuncios')
            arquivo.save(os.path.join(caminho, filename))
    flash('Anúncios enviados com sucesso!')
    return redirect(url_for('configuracoes'))

# ============== FUNÇÃO AUXILIAR ==============
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp3', 'wav', 'ogg'}

# ============== EXECUÇÃO LOCAL ==============
if __name__ == '__main__':
    app.run(debug=True)
