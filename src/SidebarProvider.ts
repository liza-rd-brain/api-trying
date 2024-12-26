import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Listen for messages from the Sidebar component and execute action
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                // case "onSomething: {
                //     // code here...
                //     break;
                // }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out/compiled/sidebar.js")
        );
        const styleMainUri = "";
        // const styleMainUri = webview.asWebviewUri(
        //     Uri.joinPath(this._extensionUri, "media", "sidebar.css")
        // );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pomodoro Timer</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                        padding: 20px;
                        text-align: center;
                    }
                    h1 {
                        color: var(--vscode-textLink-foreground);
                        margin-bottom: 20px;
                    }
                    .timer {
                        font-size: 48px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .buttons button {
                        padding: 10px 20px;
                        margin: 5px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        cursor: pointer;
                    }
                    .buttons button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    .session-type {
                        margin-top: 20px;
                        font-size: 18px;
                    }
                </style>
            </head>
            <body>
                <h1>POMODORO TIMER</h1>
                <div class="timer" id="timer">25:00</div>
                <div class="buttons">
                    <button onclick="startTimer()">Start</button>
                    <button onclick="pauseTimer()">Pause</button>
                    <button onclick="resetTimer()">Reset</button>
                </div>
                <div class="session-type" id="sessionType">POMODORO</div>
                <script>
                    let timerInterval;
                    let timeLeft = 25 * 60; // 25 minutes in seconds
                    let isPomodoro = true;

                    function updateTimer() {
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;
                        document.getElementById('timer').textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                    }

                    function startTimer() {
                        if (!timerInterval) {
                            timerInterval = setInterval(() => {
                                timeLeft--;
                                updateTimer();
                                if (timeLeft <= 0) {
                                    clearInterval(timerInterval);
                                    timerInterval = null;
                                    const message = isPomodoro ? 'Pomodoro session complete! Take a short break.' : 'Short break complete! Start a new Pomodoro session.';
                                    vscode.postMessage({
                                        command: 'timerComplete',
                                        text: message
                                    });
                                    switchSession();
                                }
                            }, 1000);
                        }
                    }

                    function pauseTimer() {
                        clearInterval(timerInterval);
                        timerInterval = null;
                    }

                    function resetTimer() {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        timeLeft = isPomodoro ? 25 * 60 : 5 * 60;
                        updateTimer();
                    }

                    function switchSession() {
                        isPomodoro = !isPomodoro;
                        timeLeft = isPomodoro ? 25 * 60 : 5 * 60;
                        document.getElementById('sessionType').textContent = isPomodoro ? 'POMODORO' : 'SHORT BREAK';
                        updateTimer();
                    }

                    // Initialize the timer display
                    updateTimer();
                </script>
            </body>
            </html>`
            ;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}