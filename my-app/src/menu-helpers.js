(function() {
  function toggleDisplay(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.style.display = element.style.display === 'block' ? 'none' : 'block';
  }

  function handleAction(action) {
    switch (action) {
      case 'menu':
        toggleDisplay('menuList');
        break;
      case 'contatos':
        toggleDisplay('contatosTable');
        break;
      case 'historia':
        toggleDisplay('historyBox');
        break;
      case 'informacao':
        toggleDisplay('infoBox');
        break;
    }
  }

  // Use event delegation so handlers still work if DOM nodes are replaced.
  document.addEventListener('click', function(event) {
    const el = event.target.closest('[data-menu-action], #menuButton, #contatosButton, #historiaButton, #informacaoButton');
    if (!el) return;
    event.preventDefault();
    const action = el.getAttribute('data-menu-action') || (el.id === 'menuButton' ? 'menu' : el.id === 'contatosButton' ? 'contatos' : el.id === 'historiaButton' ? 'historia' : el.id === 'informacaoButton' ? 'informacao' : null);
    if (action) handleAction(action);
  });
})();