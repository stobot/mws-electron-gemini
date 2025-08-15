const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Start the TiddlyWiki server in the background
const tiddlywiki = exec('npx tiddlywiki . --listen port=8888');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Give the server a moment to start, then load the URL
  setTimeout(() => {
    win.loadURL('http://127.0.0.1:8888');
  }, 3000); // 3-second delay
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Kill the TiddlyWiki server process when the app closes
  tiddlywiki.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
