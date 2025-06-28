// main.js - VERSÃO COMPLETA

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs'); // Módulo 'fs' do Node.js para lidar com arquivos

let mainWindow; // Torna a variável da janela global para acessá-la mais tarde

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // IMPORTANTE: Necessário para usar 'require' no script.js
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');
}

// --- LÓGICA DO MENU ---
const menuTemplate = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Salvar Arquivo...',
        accelerator: 'CmdOrCtrl+S',
        click() {
          // 1. Pede ao renderer (janela) o conteúdo atual
          mainWindow.webContents.send('get-content');
        }
      },
      {
        label: 'Sair',
        role: 'quit'
      }
    ]
  }
];

// --- LÓGICA DE IPC (COMUNICAÇÃO) ---

// 2. O renderer envia o conteúdo, agora abrimos a caixa de diálogo para salvar
ipcMain.on('send-content', (event, content) => {
  dialog.showSaveDialog(mainWindow, {
    title: 'Salvar arquivo Markdown',
    filters: [{ name: 'Markdown Files', extensions: ['md'] }]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, content);
    }
  }).catch(err => {
    console.log(err);
  });
});

app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  // ... resto do código app.on('activate') ...
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});