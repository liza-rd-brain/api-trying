document.getElementById('myButton').addEventListener('click', () => {
    vscode.postMessage({ command: 'clicked' });
});