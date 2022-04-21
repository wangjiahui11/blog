const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MyPlugin = require(`${__dirname}/plugins/MyPlugin`)
const FileListPlugin = require(`${__dirname}/plugins/FileListPlugin`)
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  externals: {
    jquery: 'jQuery',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'loader1'
      },
      {
        test: /\.less/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      }
    ]
  },
  resolveLoader: {  // 先解析loader文件夹下的loader 再去执行去node_modules查找
    modules: [path.resolve(__dirname, 'loader'), 'node_modules']
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
    //   generateStatsFile: true, // 是否生成stats.json文件
    // }),
    new MyPlugin({ title: 'MyPlugin' }),
    new FileListPlugin(),
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
};
