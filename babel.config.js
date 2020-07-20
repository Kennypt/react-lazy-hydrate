module.exports = function(api) {
  api.cache(true);

  return {
    compact: true,
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          modules: false,
          targets: {
            esmodules: true,
          },
          corejs: '3',
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [],
    env: {
      test: {
        plugins: [],
      },
      production: {
        plugins: ["transform-react-remove-prop-types"],
      },
    },
  };
};
