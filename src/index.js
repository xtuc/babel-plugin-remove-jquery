const transformations = [
  require('./transformations/$.each'),
  require('./transformations/$.extend'),
  require('./transformations/$.now'),
];

module.exports = mergePlugins(transformations);

function mergePlugins(plugins) {
  if (plugins.length < 2) {
    return plugins[0];
  }

  const keys = ['CallExpression'];

  function wrapperPlugin(pluginOpts) {
    const visitor = {};

    keys.forEach((visitorName) => {

      // Visitor wrapper
      visitor[visitorName] = function(args) {

        plugins.forEach((plugin) => {
          const visitors = plugin(pluginOpts).visitor;

          if (typeof visitors[visitorName] !== 'undefined') {
            visitors[visitorName](args);
          }
        });
      }
    });

    return {visitor};
  }

  return wrapperPlugin;
}
