# 1. 说说你对 css 盒子模型的理解
- 是什么：
在浏览器渲染页面的时候，渲染引擎会根据css盒模型的标准来将每一个容器分成和内容（content）、内边距（padding）、边框（border）、外边距（margin）四个部分。

- 特点：
  1. 标准盒子模型：width = content
  2. 怪异盒子模型：width = content + padding + border

  box-sizing:content-box; 标准盒模型
  box-sizing:border-box; IE怪异盒模型

- 应用场景：

# 2.css 选择器有哪些？优先级？
1. id 选择器
2. 类名选择器
3. 标签选择器
4. 后代选择器
5. 子代选择器
6. 相邻选择器
7. 群组选择器
8. 属性选择器
!important > 内联 > id 选择器  > 类名选择器 > 标签选择器
9. 伪类选择器
10. 伪元素选择器

# 3.说说 em/px/rem/vw/vh 单位的区别
1. em：相对单位，相对于父元素的字体大小。
2. px：绝对单位，像素。
3. rem：相对单位，相对于根元素的字体大小。
4. vw：相对单位，相对于视口宽度的百分比。
5. vh：相对单位，相对于视口高度的百分比。

# 4.css 中有哪些隐藏元素的方法，区别是什么？
1. display: none; 不占据文档流， 不响应事件
2. visibility: hidden; 占据文档流， 不响应事件
3. opacity: 0; 占据文档流， 响应事件
4. transform:scale(0); 占据文档流， 不响应事件
5. clip-path: polygon(0 0, 0 0, 0 0, 0 0); 占据文档流， 不响应事件  
6. position: absolute; 不占据文档流， 不响应事件

# 5. 元素水平垂直居中的方式有哪些？
1. 定位 + margin：auto
2. 定位 + margin负值 （子元素的高度和宽度已知）
3. 定位 + transform：translate(-50%, -50%)
4. flex 布局:
  .parent{
    display: flex;
    justify-content: center;
    align-items: center;
  }
5. grid 布局:
  .parent{
    display: grid;
    justify-items: center;
    align-items: center;
  }
6.  table-cell表格布局
  .parent{
    display: table-cell;
    vertical-align: middle;// 垂直居中
    text-align: center;// 水平居中（控制非块级元素的水平居中包括行内和行内块）
  }
  .child{
    display: inline-block;
  }

# 6. 说说你对 BFC 的理解
- 是什么 
BFC（Block Formatting Context）是一种独立的渲染区域，内部拥有一套属于它自己的渲染规则,内部元素的渲染不会影响到外部元素。
- 特点
1. BFC在计算高度时，会将浮动元素的高度也计算在内
2. BFC不会与浮动元素重叠
3. 内部元素不会影响外部元素的布局


 1. 同普通容器一样，BFC 容器中的元素依然是垂直排列的
 2. 同普通容器一样，BFC 容器中的元素在垂直方向上同样存在 margin 重叠
 3. BFC容器在垂直方向上的 margin 不会与子元素的 margin 重叠
 4. BFC容器在计算高度时，会将浮动元素的高度也计算在内
创建 BFC 的方式： 
overflow: hidden|auto|scroll|overlay; 不为 visible
float: left|right;不为 none
position: absolute | fixed;
display: inline-xxxx|flex|grid;
- 场景
1. 清除浮动
2. 防止 margin 重叠