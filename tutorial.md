1) https://code.visualstudio.com/api/extension-guides/tree-view
tree-view - для отображения контента в сайдбаре


*** There are two necessary methods in this API that you need to implement: ***

* getChildren(element?: T): ProviderResult<T[]> 
- Implement this to return the children for the given element or root (if no element is passed).
* getTreeItem(element: T): TreeItem | Thenable<TreeItem> 
- Implement this to return the UI representation (TreeItem) of the element that gets displayed in the view.


2) https://code.visualstudio.com/api/extension-guides/webview

The webview API allows extensions to create fully customizable views within Visual Studio Code. For example, the built-in Markdown extension uses webviews to render Markdown previews. Webviews can also be used to build complex user interfaces beyond what VS Code's native APIs support.

Think of a webview as an iframe within VS Code that your extension controls. A webview can render almost any HTML content in this frame, and it communicates with extensions using message passing. This freedom makes webviews incredibly powerful, and opens up a whole new range of extension possibilities.




