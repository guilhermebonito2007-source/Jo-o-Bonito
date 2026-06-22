(function() {
  function toggleDisplay(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.style.display = element.style.display === 'block' ? 'none' : 'block';
  }

  function attachButton(id, callback) {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener('click', function(event) {
      event.preventDefault();
      callback();
    });
  }

  function attachMenuHandlers() {
    attachButton('menuButton', function() {
      toggleDisplay('menuList');
    });
    attachButton('contatosButton', function() {
      toggleDisplay('contatosTable');
    });
    attachButton('historiaButton', function() {
      toggleDisplay('historyBox');
    });
    attachButton('informacaoButton', function() {
      toggleDisplay('infoBox');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachMenuHandlers);
  } else {
    attachMenuHandlers();
  }
})();