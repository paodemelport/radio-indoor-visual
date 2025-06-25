from flask import Flask, render_template, request, redirect
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'

# Criar pastas se não existirem
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/programacao')
def programacao():
    return render_template('programacao.html')

@app.route('/upload_music', methods=['POST'])
def upload_music():
    estilo = request.form.get('estilo')
    files = request.files.getlist('files')
    folder = os.path.join(UPLOAD_FOLDER, 'musicas', estilo if estilo else 'outros')
    os.makedirs(folder, exist_ok=True)
    for file in files:
        file.save(os.path.join(folder, file.filename))
    return redirect('/')

@app.route('/upload_vinheta', methods=['POST'])
def upload_vinheta():
    files = request.files.getlist('files')
    folder = os.path.join(UPLOAD_FOLDER, 'vinhetas')
    os.makedirs(folder, exist_ok=True)
    for file in files:
        file.save(os.path.join(folder, file.filename))
    return redirect('/')

@app.route('/upload_anuncio', methods=['POST'])
def upload_anuncio():
    files = request.files.getlist('files')
    folder = os.path.join(UPLOAD_FOLDER, 'anuncios')
    os.makedirs(folder, exist_ok=True)
    for file in files:
        file.save(os.path.join(folder, file.filename))
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
