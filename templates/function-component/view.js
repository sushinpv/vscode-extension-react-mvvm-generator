module.exports = componentName => `interface I${componentName}ViewProps {}

/**
 * View for ${componentName}
 * @param props
 * @returns
 */
function ${componentName}View(props:I${componentName}ViewProps): JSX.Element {
  return <div></div>
};
  
export default ${componentName}View;`
