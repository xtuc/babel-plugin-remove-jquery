module.exports = function(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      CallExpression(path) {
        const { callee, arguments: args } = path.node;

        if (!t.isMemberExpression(callee)) {
          return;
        }

        if (
          callee.object.name === "$" &&
          callee.property.name === "now"
        ) {

          // Rename $.now to Date.now
          callee.object = t.identifier("Date");
        }
      }
    }
  };
}

