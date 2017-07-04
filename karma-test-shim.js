Error.stackTraceLimit = Infinity;


const modulesContext = require.context('./tests', true, /\.spec\.tsx?$|.test\.tsx?$/);

modulesContext.keys().forEach(modulesContext);
