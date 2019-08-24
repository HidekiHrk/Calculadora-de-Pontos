var { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    // Main Event //
    var MainWindow = new BrowserWindow({
        width:320, height:480,
        maximizable: false, transparent:true,
        frame:false, webPreferences:{nodeIntegration:true},
        resizable:false,
        icon:`${__dirname}/img/icon.png`
    })
    MainWindow.loadFile(`${__dirname}/front-end/index.html`);
    MainWindow.webContents.openDevTools({mode:'detach'})
});

app.on('window-all-closed', app.quit)