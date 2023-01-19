module.exports = {
    // plugins: ["stylelint-order"],
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-styled-components",
    ],
    customSyntax: "postcss-scss",
    rules: {
        "color-hex-case": "lower",
        "number-leading-zero": "always",
    },
};
