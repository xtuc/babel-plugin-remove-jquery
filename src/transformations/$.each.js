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
          callee.property.name === "each"
        ) {
          // Keep name of the first argument
          const arrayArgName = args[0];

          // Remove the first argument
          path.node.arguments = args.slice(1);

          // Rename $.each to `arrayArgName`.each and each to forEach
          callee.object = arrayArgName;
          callee.property = t.identifier("forEach");

          // Inverse callback arguments
          args[1].params.reverse();
        }
      }
    }
  };
}

