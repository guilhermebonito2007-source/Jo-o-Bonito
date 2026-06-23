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

  function bindButton(id, action) {
    const button = document.getElementById(id);
    if (!button) {
      console.warn('[menu-helpers] button not found:', id);
      return;
    }
    button.addEventListener('click', function(event) {
      event.preventDefault();
      console.debug('[menu-helpers] clicked', id, 'action=', action);
      handleAction(action);
    });
  }

  function initMenuHelpers() {
    bindButton('menuButton', 'menu');
    bindButton('contatosButton', 'contatos');
    bindButton('historiaButton', 'historia');
    bindButton('informacaoButton', 'informacao');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuHelpers);
  } else {
    initMenuHelpers();
  }
})();