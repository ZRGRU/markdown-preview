// main.js - VERSÃO ATUALIZADA

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let currentFilePath = null; // Variável para rastrear o arquivo aberto

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
  updateWindowTitle(); // Define o título inicial
}

// Função para atualizar o título da janela
function updateWindowTitle() {
    const baseTitle = 'Markdown Preview App';
    if (currentFilePath) {
        mainWindow.setTitle(`${path.basename(currentFilePath)} - ${baseTitle}`);
    } else {
        mainWindow.setTitle(`Novo Documento - ${baseTitle}`);
    }
}

// --- LÓGICA DO MENU ---
const menuTemplate = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Abrir Arquivo...',
        accelerator: 'CmdOrCtrl+O',
        click() {
          // Lógica para abrir arquivo
          dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'Markdown Files', extensions: ['md', 'txt'] }]
          }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              const content = fs.readFileSync(filePath, 'utf8');
              currentFilePath = filePath; // Armazena o caminho do arquivo
              mainWindow.webContents.send('file-opened', content); // Envia o conteúdo para a janela
              updateWindowTitle();
            }
          }).catch(err => console.log(err));
        }
      },
      {
        label: 'Salvar Arquivo...',
        accelerator: 'CmdOrCtrl+S',
        click() {
          mainWindow.webContents.send('get-content');
        }
      },
      { type: 'separator' },
      {
        label: 'Sair',
        role: 'quit'
      }
    ]
  }
];

// --- LÓGICA DE IPC ---

ipcMain.on('send-content', (event, content) => {
  // Lógica de "Salvar" inteligente: se já houver um arquivo, salva diretamente.
  // Se não, abre o diálogo de "Salvar como...".
  if (currentFilePath) {
      fs.writeFileSync(currentFilePath, content);
  } else {
      dialog.showSaveDialog(mainWindow, {
        title: 'Salvar arquivo Markdown',
        defaultPath: 'untitled.md',
        filters: [{ name: 'Markdown Files', extensions: ['md'] }]
      }).then(result => {
        if (!result.canceled && result.filePath) {
          fs.writeFileSync(result.filePath, content);
          currentFilePath = result.filePath;
          updateWindowTitle();
        }
      }).catch(err => console.log(err));
  }
});

// ... (Resto do código: app.whenReady, app.on('window-all-closed'), etc.)
app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});