module.exports = (componentName, componentFileName) => `
import ${componentName}View from "./${componentFileName}-view";
import use${componentName}ViewController from "./${componentFileName}-view-controller";

interface I${componentName}Props {}

/**
 * 
 * @param props
 * @returns
 */
function ${componentName}( props:I${componentName}Props ) {
    const { } = use${componentName}ViewController({});

    return <${componentName}View />;
};
  
export default ${componentName};`;
