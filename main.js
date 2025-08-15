const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const http = require('http');

// Start the MWS server via the npm script.
const mwsServer = exec('npm start');

// This function creates the application window.
function createWindow() {
  // First, check if a window is already open. This prevents duplicates.
  if (BrowserWindow.getAllWindows().length > 0) return;

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  // Load the URL for the MWS server, which defaults to port 8080.
  win.loadURL('http://127.0.0.1:8080');
}

// This function repeatedly checks if the server is running.
const checkServerReady = () => {
  http.get('http://127.0.0.1:8080', (res) => {
    // If we get any valid response, it means the server is up.
    console.log('Server is ready. Creating window.');
    createWindow();
  }).on('error', (err) => {
    // If the connection is refused, the server isn't ready yet.
    // We will wait half a second and try again.
    console.log('Server not ready, retrying in 500ms...');
    setTimeout(checkServerReady, 500);
  });
};

// When the Electron application is ready, start checking for the server.
app.whenReady().then(checkServerReady);

// Make sure we shut down the server process when all windows are closed.
app.on('window-all-closed', () => {
  mwsServer.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
