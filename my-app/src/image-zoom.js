/**
 * Inicializa a funcionalidade de zoom de imagens para produtos
 * Permite clicar em qualquer imagem de produto para ampliar em um modal
 */
function initProductImageZoom() {
  // Verifica se o modal já existe, se não, cria
  let imageModal = document.getElementById('imageModal');
  
  if (!imageModal) {
    // Cria o modal dinamicamente se não existir
    const modalHTML = `
      <div class="image-modal" id="imageModal">
        <button type="button" class="close-modal" id="closeImageModal" aria-label="Fechar">×</button>
        <img id="zoomedImage" src="" alt="Imagem ampliada">
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    imageModal = document.getElementById('imageModal');
  }

  const zoomedImage = document.getElementById('zoomedImage') || imageModal.querySelector('img');
  const closeButton = document.getElementById('closeImageModal') || imageModal.querySelector('.close-modal');

  function closeZoom() {
    imageModal.classList.remove('open');
    if (zoomedImage) {
      zoomedImage.src = '';
      zoomedImage.alt = '';
    }
  }

  // Adiciona evento de clique a todas as imagens de produtos
  document.querySelectorAll('.product-card img').forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (zoomedImage) {
        zoomedImage.src = img.src;
        zoomedImage.alt = img.alt || 'Imagem do produto';
        imageModal.classList.add('open');
      }
    });
  });

  // Fecha ao clicar no botão de fechar
  if (closeButton) {
    closeButton.addEventListener('click', closeZoom);
  }

  // Fecha ao clicar fora da imagem (no fundo do modal)
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeZoom();
    }
  });

  // Fecha ao pressionar ESC
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal.classList.contains('open')) {
      closeZoom();
    }
  });
}

// Inicializa ao carregar a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductImageZoom);
} else {
  initProductImageZoom();
}
