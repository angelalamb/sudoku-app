const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 675,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load the main window
  win.loadURL(url.format({
    pathname: path.join(__dirname, '/gui/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
