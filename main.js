const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

// This correctly starts the MWS server via the npm script.
const mwsServer = exec('npm start');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  // The MWS server uses port 8080 by default. This is a key change.
  win.loadURL('http://127.0.0.1:8080');
}

// Listen for output from the server process.
mwsServer.stdout.on('data', (data) => {
  // The MWS server outputs "listening on port" when it's ready.
  // This is the second key change.
  if (data.includes('listening on port')) {
    // As soon as we see that message, we create the window.
    // We add a check to make sure we don't accidentally open multiple windows.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  }
});

// It's also good practice to log any errors.
mwsServer.stderr.on('data', (data) => {
  console.error(`MWS Server Error: ${data}`);
});

// We don't need anything inside app.whenReady() because the
// stdout listener above will trigger the window creation.
app.whenReady();

// Make sure we shut down the server when the app closes.
app.on('window-all-closed', () => {
  mwsServer.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
