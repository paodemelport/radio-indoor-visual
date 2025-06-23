
document.getElementById('fullscreen')?.addEventListener('click', () => {
  const container = document.getElementById('slide-container');
  if (container.requestFullscreen) {
    container.requestFullscreen();
  }
});
document.querySelectorAll('form input[type="file"]').forEach(input => {
  input.addEventListener('click', () => {
    input.value = null;
  });
});
