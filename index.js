const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New TODO'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New TODO',
                click: () => createAddWindow()
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

