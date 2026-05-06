# 将 tsx 编译为 js
@babel/standalone  (babel的浏览器版本)
@types/babel__standalone  


# 资源处理
import { useState } from "react";
import Aaa from './Aaa.tsx'

需要用到：babel （parse、 transform、 generate） AST -- 抽象语法树

const url = URL.createObjectURL(new Blob([code1], {type: 'application/javascript'})) 将某份资源处理成一个 blob 地址，并在 babel 编译的过程中将 from "xxx" 修改成成 from "blob:https://xxxxxx"

# bebel
@babel/core
@types/babel__core


# 引入 react
<script type="importmap">
    {
      "imports": {
          "react": "https://esm.sh/react@18.2.0"
      }
    }
  </script>

  <script type="module">
    import React from "react";

    console.log(React);
  </script>


# 代码提示器
npm i @monaco-editor/react

# 预览
iframe 标签

左侧的 tsx 代码被编译，编译完后引入带一个 html文件中，并将这个 html 文件展示在iframe中


# allotment 拖拽组件


# 样式隔离
index.module.scss  将组件的样式隔离起来，不会影响到其他组件的样式


# 编辑器 @monaco-editor/react
第三方的库需要代码提示：npm i @typescript/ata