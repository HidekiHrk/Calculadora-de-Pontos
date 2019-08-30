var { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    // Main Event //
    var MainWindow = new BrowserWindow({
        width:320, height:480,
        maximizable: false, transparent:true,
        frame:false, webPreferences:{nodeIntegration:true, zoomFactor:1.0},
        resizable:false, show:false,
        icon:`${__dirname}/front-end/img/png/icon.png`
    })
    // MainWindow.loadFile(`${__dirname}/front-end/index.html`);
    MainWindow.webContents.openDevTools({mode:'detach'})
    MainWindow.once('ready-to-show', () => {
        MainWindow.show();
    })
    MainWindow.on('closed', () => {
        app.quit();
    })
});

app.on('window-all-closed', app.quit)