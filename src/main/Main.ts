import { is } from "electron-util";
import debug from "electron-debug";
import * as path from "path";
import { format as formatUrl } from "url";

debug();

export default class Main {
    static application: Electron.App;
    static MainWindow: any;

    // Windows
    static mainWindow?: Electron.BrowserWindow;

    static main(app: Electron.App, MainWindow: any) {
        Main.application = app;
        Main.MainWindow = MainWindow;

        Main.application.allowRendererProcessReuse = true;

        Main.application.on("activate", Main.createMainWindow);
        Main.application.on("ready", Main.createMainWindow);
        Main.application.on("window-all-closed", Main.onWindowAllClosed);
    }

    private static createWindow(config: Electron.BrowserWindowConstructorOptions): Electron.BrowserWindow {
        return new Main.MainWindow(config);
    }

    private static onWindowAllClosed() {
        if (!is.macos) {
            Main.application.quit();
        }
    }

    private static createMainWindow() {
        Main.mainWindow = Main.createWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
            },
            show: false,
        });

        Main.mainWindow.setMenu(null);
        Main.mainWindow.setTitle("File Renamer");

        // Open page
        if (is.development) {
            Main.mainWindow.webContents.openDevTools();
            Main.mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/`);
        } else {
            Main.mainWindow.loadURL(
                formatUrl({
                    pathname: path.join(__dirname, "index.html"),
                    protocol: "file",
                    slashes: true,
                })
            );
        }

        // Events
        Main.mainWindow.on("closed", Main.onMainWindowClosed);
        Main.mainWindow.on("ready-to-show", () => Main.mainWindow!.show());
    }

    private static onMainWindowClosed() {
        Main.mainWindow = undefined;
    }
}
