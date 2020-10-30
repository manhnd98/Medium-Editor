const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env["mode"] === "development" ? true : false;

module.exports = {
  devtool: "eval-source-map",
  entry: ["./src/index.ts", "./src/styles/main.scss"],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: [
                {
                  globalName: 'MediumEditor',
                  moduleLocalName: 'MediumEditor',
                },
              ],
            },
          },
          {
            loader: "ts-loader",
          },
        ],

        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"],
  },
  output: {
    publicPath: "public",
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    publicPath: "/public",
  },
  plugins: [
    // Xuất kết quả với CSS - sau khi qua loader MiniCssExtractPlugin.loader
    new MiniCssExtractPlugin(),
  ],
};
