// main.js - Processo Principal do Electron

const { app, BrowserWindow } = require('electron');
const path = require('path');

// Função que cria a janela do navegador
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
    //   __dirname aponta para a raiz do projeto
    //   path.join é usado para criar um caminho de arquivo seguro entre SOs
    //   preload: path.join(__dirname, 'preload.js') // Opcional, mas boa prática
    }
  });

  // Carrega o index.html na janela
  mainWindow.loadFile('index.html');

  // Abre as Ferramentas de Desenvolvedor (DevTools) - opcional
  // mainWindow.webContents.openDevTools();
}

// Este método será chamado quando o Electron terminar a inicialização
// e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // No macOS, é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Encerra o aplicativo quando todas as janelas forem fechadas, exceto no macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});