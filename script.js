// script.js - VERSÃO ATUALIZADA

const { ipcRenderer } = require('electron');
const marked = require('marked');
const hljs = require('highlight.js');

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Variável para rastrear se o documento foi editado
let isDocumentEdited = false;

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

// Quando o usuário digita, marca o documento como editado
editor.addEventListener('input', () => {
  if (!isDocumentEdited) {
      isDocumentEdited = true;
      // Envia um sinal para o main.js de que o documento foi alterado
      ipcRenderer.send('document-edited-status', true);
  }
  updatePreview();
});

ipcRenderer.on('get-content', () => {
  // Ao salvar, consideramos o documento "limpo" novamente
  isDocumentEdited = false;
  ipcRenderer.send('document-edited-status', false);
  ipcRenderer.send('send-content', editor.value);
});

// Ouve o evento de arquivo aberto vindo do main.js
ipcRenderer.on('file-opened', (event, content) => {
    editor.value = content; // Coloca o conteúdo no editor
    updatePreview(); // Atualiza o preview
    isDocumentEdited = false; // Um arquivo recém-aberto não está "editado"
    ipcRenderer.send('document-edited-status', false);
});

// Texto inicial removido para começar com um documento limpo.
// Você pode adicionar um ipcRenderer.send para carregar um estado inicial se quiser.