const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// initial app windows
app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

// create add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New TODO'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);

    // TODO: Enable Garbage Collection with Electron
    addWindow.on('closed', () => addWindow = null);
}

// receive child window todo add event then emit to main windows
ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    // Activate closed event 
    addWindow.close();
});

// construct MenuItem
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New TODO',
                click: () => createAddWindow()
             },
             {
                 label: 'Clear TODO List',
                 click: () => { mainWindow.webContents.send('todo:clear') }
             },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl + Q',
                click: () => app.quit()
            }
        ]
    }
];

if(process.platform === 'darwin') 
{
    menuTemplate.unshift({});
}

// TODO: Add Developer Tool Menu dynamically
if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload'},
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click: (item, focusedWindow) => {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}

