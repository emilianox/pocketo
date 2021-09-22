// function isBabelRegister(caller) {
//   return !!(caller && caller.name === "@babel/register");
// }

module.exports = function (api) {
  // const isRegister = api.caller(isBabelRegister);
  const pluginsProduction = [];
  const pluginsNoProduction = [
    "console-source",
    "babel-plugin-typescript-to-proptypes",
  ];

  const pluginsToAdd = api.env("production")
    ? pluginsProduction
    : pluginsNoProduction;

  return {
    presets: ["next/babel"],
    plugins: ["ramda", ...pluginsToAdd],
  };
};
