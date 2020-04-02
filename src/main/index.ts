import { app, BrowserWindow, nativeImage } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import { is } from "electron-util";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: any;

function createMainWindow() {
    const window = new BrowserWindow({ webPreferences: { nodeIntegration: true } });

    if (is.development) {
        window.webContents.openDevTools();
    }

    if (is.development) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/`);
    } else {
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, "index.html"),
                protocol: "file",
                slashes: true
            })
        );
    }

    window.setMenu(null);
    if (is.macos) {
        window.setIcon(nativeImage.createFromPath("./resources/icon.icns"));
    } else {
        window.setIcon(nativeImage.createFromPath("./resources/icon.ico"));
    }

    window.on("closed", () => {
        mainWindow = null;
    });

    window.webContents.on("devtools-opened", () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
    mainWindow = createMainWindow();
});
