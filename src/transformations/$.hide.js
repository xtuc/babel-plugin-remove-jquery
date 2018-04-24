const template = require("@babel/template").default;

const build = template(`
  (function () {
    const el = document.querySelector(SELECTOR);
    el.style.display = 'none';
  })
`);

module.exports = function({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        const {property, object} = path.node;

        if (t.isIdentifier(property, { name: "hide" })) {
          const [selector] = object.arguments;

          const ast = build({
            SELECTOR: selector,
          });

          path.replaceWith(ast);
        }
      },
    },
  };
};

