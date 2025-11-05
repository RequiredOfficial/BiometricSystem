const path = require('path');
const url = require('url');
const { app, BrowserWindow, protocol } = require('electron');

let window;

function createWindow(){
  window = new BrowserWindow({
    width: 1400,
    height: 800,
    icon: path.join(__dirname, 'frontend', 'images', 'icon.jpg')
  });

  window.loadFile(path.join(__dirname, 'index.html'));

  // очищает окно после закрытия
  window.on('closed', () => {
    window = null;
  })
};

// Открытие html-файла при запуске программы
app.on('ready', createWindow);

// Закрытие всех процессов программы после закрытия окна
app.on('window-all-closed', () => {
  app.quit();
});