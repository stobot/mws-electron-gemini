const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

// Start the TiddlyWiki server in the background.
const tiddlywiki = exec('npx tiddlywiki wikis --listen port=8888');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    // We can remove the webPreferences as they are not needed for this approach.
  });

  // Load the URL of our local TiddlyWiki server.
  win.loadURL('http://127.0.0.1:8888');
}

// Wait for the Electron app itself to be ready.
app.whenReady().then(() => {
  // Now, listen to the server's output stream.
  tiddlywiki.stdout.on('data', (data) => {
    // When the output includes the text "Serving on", we know the server is ready.
    if (data.includes('Serving on')) {
      // Only now is it safe to create the display window.
      createWindow();
    }
  });
});

// This part remains the same: clean up when all windows are closed.
app.on('window-all-closed', () => {
  // Important: kill the server process when the app closes.
  tiddlywiki.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
