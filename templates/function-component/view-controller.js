module.exports =
  componentName => `interface I${componentName}ViewControllerProps {}

/**
 * View Controller for ${componentName}
 * @param props
 * @returns
 */
function use${componentName}ViewController(props:I${componentName}ViewControllerProps) {
};



export default use${componentName}ViewController;`
