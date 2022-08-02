// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { TextEncoder } = require("util");
const vscode = require("vscode");

const indexTemplate = require("./templates/index-template");
const testController = require("./templates/test-cases/test-controller");
const testView = require("./templates/test-cases/test-view");

/**
 * Function component with children FWC
 */
const FWCComponent = require("./templates/function-component-with-child/component");
const FWCView = require("./templates/function-component-with-child/view");
const FWCController = require("./templates/function-component-with-child/view-controller");

/**
 * Function component without children FC
 */
const FCComponent = require("./templates/function-component/component");
const FCView = require("./templates/function-component/view");
const FCController = require("./templates/function-component/view-controller");

/**
 * Function to create a file
 * @param { string } basePath
 * @param { string } filename
 * @param { string } content
 */
const writeFile = async (basePath, filename, content) => {
  const filePath = vscode.Uri.file(basePath + `/${filename}`);
  await vscode.workspace.fs.writeFile(filePath, new TextEncoder().encode(content));
};

/**
 * Function to add - between two uppercase latters
 * @param { string } string
 * @returns
 */
const insertSpaces = (string) => {
  string = string.replace(/([a-z])([A-Z])/g, "$1-$2");
  string = string.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2");
  return string;
};

/**
 * Function to convert component name to filename
 * @param {string} componentPath
 */
const getComponentName = (componentPath) => {
  if (!componentPath.includes("/")) return { componentName: componentPath, componentPath: null };

  let files = componentPath.split("/");
  return { componentName: files.pop(), componentPath: files.join("/") };
};

/**
 * Function to capitalize first latter
 * @param {string } string
 * @returns
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposableFWC = vscode.commands.registerCommand("react-mvvm-generator.createFWCComponent", async function () {
    // Ask the user to provide a component name
    const componentNameInput = await vscode.window.showInputBox();

    // If there is no component name, do not proceed
    if (!componentNameInput) return;

    let { componentName: componentNameConverted, componentPath: selectedFolderPath } = getComponentName(componentNameInput);

    if (!selectedFolderPath) {
      // Folder selection is added for creating component
      const options = {
        canSelectMany: false,
        openLabel: "Select",
        canSelectFiles: false,
        canSelectFolders: true,
      };

      const selectedFolder = await vscode.window.showOpenDialog(options);
      selectedFolderPath = selectedFolder ? (selectedFolder[0] ? selectedFolder[0].fsPath : null) : null;
    } else {
      // If the user given a foldername in the filename itself, then append the ws path as prefix
      selectedFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "/" + selectedFolderPath;
    }

    // Convert the input into component name and component file name
    const componentName = capitalizeFirstLetter(componentNameConverted);
    const componentFileName = insertSpaces(componentName).toLowerCase();

    // Check user has a workspace enabled or not
    if (!vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders[0]) return;

    // Create the path from the ws path
    const wsPath = (selectedFolderPath || vscode.workspace.workspaceFolders[0].uri.fsPath) + "/" + componentFileName; // gets the path of the first workspace folder

    // Write all files
    writeFile(wsPath, `${componentFileName}-view-controller.tsx`, FWCController(componentName));
    writeFile(wsPath, `${componentFileName}-view.tsx`, FWCView(componentName));
    writeFile(wsPath, `${componentFileName}.tsx`, FWCComponent(componentName, componentFileName));
    writeFile(wsPath, `index.tsx`, indexTemplate(componentName, componentFileName));
    writeFile(wsPath + "/__test__", `${componentFileName}-view-controller.test.tsx`, testController(componentName, componentFileName));
    writeFile(wsPath + "/__test__", `${componentFileName}-view.test.tsx`, testView(componentName, componentFileName));

    // Show message
    vscode.window.showInformationMessage("FC Created " + wsPath);
  });

  let disposableFC = vscode.commands.registerCommand("react-mvvm-generator.createFCComponent", async function () {
    // Ask the user to provide a component name
    const componentNameInput = await vscode.window.showInputBox();

    // If there is no component name, do not proceed
    if (!componentNameInput) return;

    let { componentName: componentNameConverted, componentPath: selectedFolderPath } = getComponentName(componentNameInput);

    if (!selectedFolderPath) {
      // Folder selection is added for creating component
      const options = {
        canSelectMany: false,
        openLabel: "Select",
        canSelectFiles: false,
        canSelectFolders: true,
      };

      const selectedFolder = await vscode.window.showOpenDialog(options);
      selectedFolderPath = selectedFolder ? (selectedFolder[0] ? selectedFolder[0].fsPath : null) : null;
    } else {
      // If the user given a foldername in the filename itself, then append the ws path as prefix
      selectedFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath + "/" + selectedFolderPath;
    }

    // Convert the input into component name and component file name
    const componentName = capitalizeFirstLetter(componentNameConverted);
    const componentFileName = insertSpaces(componentName).toLowerCase();

    // Check user has a workspace enabled or not
    if (!vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders[0]) return;

    // Create the path from the ws path
    const wsPath = (selectedFolderPath || vscode.workspace.workspaceFolders[0].uri.fsPath) + "/" + componentFileName; // gets the path of the first workspace folder

    // Write all files
    writeFile(wsPath, `${componentFileName}-view-controller.tsx`, FCController(componentName));
    writeFile(wsPath, `${componentFileName}-view.tsx`, FCView(componentName));
    writeFile(wsPath, `${componentFileName}.tsx`, FCComponent(componentName, componentFileName));
    writeFile(wsPath, `index.tsx`, indexTemplate(componentName, componentFileName));
    writeFile(wsPath + "/__test__", `${componentFileName}-view-controller.test.tsx`, testController(componentName, componentFileName));
    writeFile(wsPath + "/__test__", `${componentFileName}-view.test.tsx`, testView(componentName, componentFileName));

    // Show message
    vscode.window.showInformationMessage("FE Component Created " + wsPath);
  });
  context.subscriptions.push(disposableFWC);
  context.subscriptions.push(disposableFC);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
