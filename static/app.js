// Estado da aplicação
let currentSection = 'musicas';
let currentSlideIndex = 0;
let slides = [];
let isFullscreen = false;
let currentUploadType = '';

// Elementos DOM
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const uploadModal = document.getElementById('uploadModal');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMediaFiles();
    setupEventListeners();
});

// Inicializar aplicação
function initializeApp() {
    // Mostrar seção inicial
    showSection('musicas');
    
    // Carregar dados salvos
    loadSavedData();
    
    // Configurar players de áudio
    setupAudioPlayers();
}

// Configurar event listeners
function setupEventListeners() {
    // Menu lateral
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileSidebar);
    
    // Menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            showSection(section);
        });
    });
    
    // Upload modal
    setupUploadModal();
    
    // Tela cheia
    document.addEventListener('keydown', handleKeyPress);
    
    // Responsividade
    window.addEventListener('resize', handleResize);
    
    // Clique fora do sidebar em mobile
    document.addEventListener('click', handleOutsideClick);
}

// Navegação entre seções
function showSection(sectionName) {
    // Atualizar menu
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Atualizar conteúdo
    contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName) {
            section.classList.add('active');
        }
    });
    
    currentSection = sectionName;
    
    // Carregar dados específicos da seção
    switch(sectionName) {
        case 'musicas':
            loadMusicList();
            break;
        case 'vinhetas':
            loadVinhetasList();
            break;
        case 'slides':
            loadSlidesList();
            break;
    }
}

// Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
    sidebar.classList.toggle('mobile-open');
}

function handleOutsideClick(e) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
            sidebar.classList.remove('mobile-open');
        }
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
    }
}

// Gerenciamento de Músicas
function loadMusicList() {
    const musicList = document.getElementById('musicList');
    if (!musicList) return;
    
    // Simular carregamento de músicas
    const mockMusic = [
        { name: 'Música Exemplo 1', artist: 'Artista 1', duration: '3:45', file: 'music1.mp3' },
        { name: 'Música Exemplo 2', artist: 'Artista 2', duration: '4:12', file: 'music2.mp3' }
    ];
    
    musicList.innerHTML = mockMusic.map(music => `
        <div class="music-item">
            <div class="music-info">
                <i class="fas fa-music"></i>
                <div>
                    <h4>${music.name}</h4>
                    <p>${music.artist} • ${music.duration}</p>
                </div>
            </div>
            <div class="music-controls">
                <button class="btn-icon" onclick="playMusic('${music.file}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn-icon" onclick="deleteMusic('${music.file}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function playMusic(filename) {
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTrack = document.getElementById('currentTrack');
    const currentArtist = document.getElementById('currentArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (audioPlayer && currentTrack) {
        audioPlayer.src = `/static/audio/music/${filename}`;
        currentTrack.textContent = filename.replace('.mp3', '');
        currentArtist.textContent = 'Reproduzindo...';
        
        audioPlayer.play().catch(e => {
            console.log('Erro ao reproduzir:', e);
            showNotification('Erro ao reproduzir música', 'error');
        });
        
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function deleteMusic(filename) {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
        // Implementar exclusão via API
        showNotification('Música excluída com sucesso', 'success');
        loadMusicList();
    }
}

// Gerenciamento de Vinhetas
function loadVinhetasList() {
    const vinhetasList = document.getElementById('vinhetasList');
    if (!vinhetasList) return;
    
    // Simular carregamento de vinhetas
    const mockVinhetas = [
        { name: 'Vinheta Abertura', type: 'Institucional', duration: '0:15', file: 'vinheta1.mp3' },
        { name: 'Vinheta Comercial', type: 'Publicidade', duration: '0:30', file: 'vinheta2.mp3' }
    ];
    
    vinhetasList.innerHTML = mockVinhetas.map(vinheta => `
        <div class="vinheta-item">
            <div class="vinheta-info">
                <i class="fas fa-bullhorn"></i>
                <div>
                    <h4>${vinheta.name}</h4>
                    <p>${vinheta.type} • ${vinheta.duration}</p>
                </div>
            </div>
            <div class="vinheta-controls">
                <button class="btn-icon" onclick="playVinheta('${vinheta.file}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn-icon" onclick="deleteVinheta('${vinheta.file}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function playVinheta(filename) {
    const vinhetaPlayer = document.getElementById('vinhetaPlayer');
    const currentVinheta = document.getElementById('currentVinheta');
    const vinhetaType = document.getElementById('vinhetaType');
    const vinhetaPlayPauseBtn = document.getElementById('vinhetaPlayPauseBtn');
    
    if (vinhetaPlayer && currentVinheta) {
        vinhetaPlayer.src = `/static/audio/vinhetas/${filename}`;
        currentVinheta.textContent = filename.replace('.mp3', '');
        vinhetaType.textContent = 'Reproduzindo...';
        
        vinhetaPlayer.play().catch(e => {
            console.log('Erro ao reproduzir:', e);
            showNotification('Erro ao reproduzir vinheta', 'error');
        });
        
        vinhetaPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function deleteVinheta(filename) {
    if (confirm('Tem certeza que deseja excluir esta vinheta?')) {
        // Implementar exclusão via API
        showNotification('Vinheta excluída com sucesso', 'success');
        loadVinhetasList();
    }
}

// Gerenciamento de Slides/Vídeos
function loadSlidesList() {
    loadMediaFiles();
}

function loadMediaFiles() {
    const mediaGrid = document.getElementById('mediaGrid');
    if (!mediaGrid) return;
    
    // Simular carregamento de mídia
    const mockMedia = [
        { name: 'slide1.jpg', type: 'image' },
        { name: 'slide2.jpg', type: 'image' },
        { name: 'video1.mp4', type: 'video' },
        { name: 'slide3.jpg', type: 'image' }
    ];
    
    slides = mockMedia;
    updateSlideCounter();
    
    mediaGrid.innerHTML = mockMedia.map((media, index) => `
        <div class="media-item" onclick="selectMedia('${media.name}', ${index})">
            ${media.type === 'image' ? 
                `<img src="/static/images/${media.name}" alt="${media.name}" onerror="this.style.display='none'">` :
                `<video><source src="/static/images/${media.name}" type="video/mp4"></video>`
            }
            <div class="media-overlay">
                <i class="fas fa-eye"></i>
            </div>
        </div>
    `).join('');
}

function selectMedia(filename, index) {
    const slideDisplay = document.getElementById('slideDisplay');
    if (!slideDisplay) return;
    
    currentSlideIndex = index;
    updateSlideCounter();
    
    const media = slides[index];
    if (media.type === 'image') {
        slideDisplay.innerHTML = `<img src="/static/images/${filename}" alt="${filename}">`;
    } else {
        slideDisplay.innerHTML = `<video controls><source src="/static/images/${filename}" type="video/mp4"></video>`;
    }
}

function previousSlide() {
    if (slides.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    selectMedia(slides[currentSlideIndex].name, currentSlideIndex);
}

function nextSlide() {
    if (slides.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    selectMedia(slides[currentSlideIndex].name, currentSlideIndex);
}

function updateSlideCounter() {
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.textContent = slides.length > 0 ? 
            `${currentSlideIndex + 1} / ${slides.length}` : '0 / 0';
    }
}

// Tela Cheia
function toggleFullscreen() {
    if (isFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function enterFullscreen() {
    const fullscreenDisplay = document.getElementById('fullscreenDisplay');
    const slideDisplay = document.getElementById('slideDisplay');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (slideDisplay && fullscreenDisplay) {
        fullscreenDisplay.innerHTML = slideDisplay.innerHTML;
        fullscreenOverlay.classList.add('active');
        isFullscreen = true;
        
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Sair da Tela Cheia';
        
        // Esconder cursor após 3 segundos
        setTimeout(() => {
            if (isFullscreen) {
                fullscreenOverlay.style.cursor = 'none';
            }
        }, 3000);
    }
}

function exitFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    fullscreenOverlay.classList.remove('active');
    fullscreenOverlay.style.cursor = 'default';
    isFullscreen = false;
    
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Tela Cheia';
}

// Upload Modal
function setupUploadModal() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFileSelection(files);
        });
        
        // Click to select
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
        });
    }
}

function openUploadModal(type) {
    currentUploadType = type;
    const modalTitle = document.getElementById('modalTitle');
    const fileInput = document.getElementById('fileInput');
    
    if (modalTitle) {
        switch(type) {
            case 'music':
                modalTitle.textContent = 'Adicionar Música';
                fileInput.accept = 'audio/*';
                break;
            case 'vinhetas':
                modalTitle.textContent = 'Adicionar Vinheta';
                fileInput.accept = 'audio/*';
                break;
            case 'slides':
                modalTitle.textContent = 'Adicionar Mídia';
                fileInput.accept = 'image/*,video/*';
                break;
        }
    }
    
    uploadModal.classList.add('active');
}

function closeUploadModal() {
    uploadModal.classList.remove('active');
    resetUploadForm();
}

function handleFileSelection(files) {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.files = files;
    }
}

function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!fileInput.files.length) {
        showNotification('Selecione pelo menos um arquivo', 'warning');
        return;
    }
    
    uploadProgress.style.display = 'block';
    
    // Simular upload
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Enviando... ${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showNotification('Arquivos enviados com sucesso!', 'success');
                closeUploadModal();
                
                // Recarregar lista correspondente
                switch(currentUploadType) {
                    case 'music':
                        loadMusicList();
                        break;
                    case 'vinhetas':
                        loadVinhetasList();
                        break;
                    case 'slides':
                        loadSlidesList();
                        break;
                }
            }, 500);
        }
    }, 200);
}

function resetUploadForm() {
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    
    if (fileInput) fileInput.value = '';
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
}

// Players de Áudio
function setupAudioPlayers() {
    const audioPlayer = document.getElementById('audioPlayer');
    const vinhetaPlayer = document.getElementById('vinhetaPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const vinhetaPlayPauseBtn = document.getElementById('vinhetaPlayPauseBtn');
    const vinhetaStopBtn = document.getElementById('vinhetaStopBtn');
    
    // Player principal
    if (audioPlayer && playPauseBtn && stopBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        stopBtn.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        audioPlayer.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
    
    // Player de vinhetas
    if (vinhetaPlayer && vinhetaPlayPauseBtn && vinhetaStopBtn) {
        vinhetaPlayPauseBtn.addEventListener('click', () => {
            if (vinhetaPlayer.paused) {
                vinhetaPlayer.play();
                vinhetaPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                vinhetaPlayer.pause();
                vinhetaPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        vinhetaStopBtn.addEventListener('click', () => {
            vinhetaPlayer.pause();
            vinhetaPlayer.currentTime = 0;
            vinhetaPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        vinhetaPlayer.addEventListener('ended', () => {
            vinhetaPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
}

// Atalhos de Teclado
function handleKeyPress(e) {
    if (isFullscreen) {
        switch(e.key) {
            case 'Escape':
                exitFullscreen();
                break;
            case 'ArrowLeft':
                previousSlide();
                break;
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
        }
    }
}

// Notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos inline (caso não estejam no CSS)
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Dados salvos
function loadSavedData() {
    // Carregar configurações salvas do localStorage
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection) {
        showSection(savedSection);
    }
}

function saveData() {
    // Salvar estado atual
    localStorage.setItem('currentSection', currentSection);
}

// Salvar dados ao sair
window.addEventListener('beforeunload', saveData);

