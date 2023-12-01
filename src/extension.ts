import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
    const memoryUsageProvider = new MemoryUsageProvider();
    vscode.window.registerTreeDataProvider('memoryUsageView', memoryUsageProvider);
    vscode.commands.registerCommand('memoryUsageView.refresh', () => memoryUsageProvider.refresh());
    setInterval(() => memoryUsageProvider.refresh(), 10000); // Actualización automática cada 10 segundos
}

class MemoryUsageProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    // private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    // readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<vscode.TreeItem[]> {
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Convertir a MB
        const usageItem = new vscode.TreeItem(`Memory Usage: ${memoryUsage.toFixed(2)} MB`);
        const refreshItem = new vscode.TreeItem("Actualizar Memoria Usada", vscode.TreeItemCollapsibleState.None);
        refreshItem.command = { command: 'memoryUsageView.refresh', title: "Actualizar" };

        // Obtener la lista de extensiones instaladas
        const extensions = vscode.extensions.all.map(extension =>
            new vscode.TreeItem(`${extension.packageJSON.displayName}`) // Puedes usar `extension.packageJSON.displayName` para un nombre más amigable
        );

        // obtengo la cantidad de ram usada por cada extension y muestro solo las 5 primeras y le pongo enumero al lado
  

        const memoryUsageExtensions = vscode.extensions.all.map(extension =>
            new vscode.TreeItem(`-. ${extension.packageJSON.displayName}:RAM ${extension.extensionKind}`) // Puedes usar `extension.packageJSON.displayName` para un nombre más amigable
        );


        // verifico si hay extensiones instaladas
        if (extensions.length === 0) {
            return Promise.resolve([usageItem, refreshItem, new vscode.TreeItem("No hay extensiones instaladas")]);
        } 
            // solo imprimo 5 extensiones instaladas en el editor y le pongo al lado la cantidad de ram que usa cada una
            return Promise.resolve([usageItem, refreshItem, ...memoryUsageExtensions.slice(0, 5)]);
            //return Promise.resolve([usageItem, refreshItem, ...extensions.slice(0, 5)]);
            //return Promise.resolve([usageItem, refreshItem, ...extensions]);
            //return Promise.resolve([usageItem, refreshItem]);
       
    }
}
