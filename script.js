// script.js - VERSÃO PARA ELECTRON

// 1. Importando módulos locais e IPC do Electron
const { ipcRenderer } = require('electron');
const marked = require('marked');
const hljs = require('highlight.js');

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Configura o marked para usar o highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

function updatePreview() {
  const htmlText = marked.parse(editor.value);
  preview.innerHTML = htmlText;
}

editor.addEventListener('input', updatePreview);

// 2. Ouvindo o pedido do processo principal
ipcRenderer.on('get-content', () => {
  // 3. Enviando o conteúdo de volta para o processo principal
  ipcRenderer.send('send-content', editor.value);
});


// Texto inicial de exemplo
editor.value = `# App de Desktop!

Agora você pode usar **Cmd/Ctrl + S** para salvar seu trabalho.

- Criado com Electron.js
- Renderizado com marked.js
- Realce de sintaxe com highlight.js
`;
updatePreview();