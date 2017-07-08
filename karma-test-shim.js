Error.stackTraceLimit = Infinity;

require("document-register-element");

const modulesContext = require.context('./tests', true, /\.spec\.tsx?$|.test\.tsx?$/);

modulesContext.keys().forEach(modulesContext);
