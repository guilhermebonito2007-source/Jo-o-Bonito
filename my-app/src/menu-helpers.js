(function() {
  function toggleDisplay(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.toggle('open');
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
    const target = event.target;
    const el = target && typeof target.closest === 'function'
      ? target.closest('[data-menu-action], #menuButton, #contatosButton, #historiaButton, #informacaoButton')
      : target.parentElement && target.parentElement.closest
      ? target.parentElement.closest('[data-menu-action], #menuButton, #contatosButton, #historiaButton, #informacaoButton')
      : null;
    if (!el) return;
    // diagnostic logging
    try { console.debug('[menu-helpers] click on', el.id || el.tagName, 'data-menu-action=', el.getAttribute('data-menu-action')); } catch (e) {}
    event.preventDefault();
    const action = el.getAttribute('data-menu-action') || (el.id === 'menuButton' ? 'menu' : el.id === 'contatosButton' ? 'contatos' : el.id === 'historiaButton' ? 'historia' : el.id === 'informacaoButton' ? 'informacao' : null);
    if (action) {
      try { console.debug('[menu-helpers] resolved action=', action); } catch (e) {}
      handleAction(action);
    }
  });
})();