const template = require("@babel/template").default;

function defineHelper(str) {
  return template(str, { sourceType: "module" });
}

const extendHelper = defineHelper(`
  var ID = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue;
      }

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
  };
`);

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
          callee.property.name === "extend"
        ) {

          // Inject our extend helper
          const helperId = path.scope.generateUidIdentifier("extend");
          const helper = extendHelper({ID: helperId});

          path.insertBefore([helper]);

          // Rename $.extend to our helper id
          path.node.callee = helperId;
        }
      }
    }
  };
}

