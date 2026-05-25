# 构建工具
npm i --save-dev style-loader css-loader webpack-loader
1. webpack
 - 只能打包js文件
 - 外挂插件

 - 深度优先，递归式的做依赖收集，每次打包时，会从入口文件开始，递归式的去查找依赖的文件，直到没有依赖的文件为止，最后将所有依赖的文件打包到一个文件中 （构建过程比较耗时）

2. vite


