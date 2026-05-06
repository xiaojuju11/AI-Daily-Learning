# 1. 说说你对 css 盒子模型的理解
 - 是什么：
  在浏览器渲染页面的时候，渲染引擎会根据 css 盒模型的标准来将每一个容器分成内容区域（content）、内边距区域（padding）、边框区域（border）、外边距区域（margin）。

 - 特点：
  1. 标准盒子模型：width = content
  2. 怪异盒子模型：width = content + padding + border

 - 应用场景：


 # 2. css选择器有哪些？优先级是怎样的？
  1. 类名选择器
  2. id选择器
  3. 标签选择器
  4. 后代选择器
  5. 子选择器
  6. 相邻兄弟选择器
  7. 群组选择器

  8. 伪类选择器
  9. 伪元素选择器
  10. 属性选择器

  important > 内联 > id选择器 > 类名选择器 > 标签选择器 

# 3. 说说 em/px/rem/vw/vh 的区别？
  1. em：相对单位，相对于父元素的字体大小。
  2. px：绝对单位，像素。
  3. rem：相对单位，相对于根元素的字体大小。
  4. vw：相对单位，相对于视口宽度的百分比。
  5. vh：相对单位，相对于视口高度的百分比。

# 4. css中，有哪些方式可以隐藏元素，区别是什么？
  1. display: none;  不占据文档流， 无法触发事件
  2. visibility: hidden;  占据文档流， 无法触发事件
  3. opacity: 0;  占据文档流， 可以触发事件
  4. transform: scale(0);  占据文档流， 不可以触发事件
  5. clip-path: polygon(0 0, 0 0, 0 0, 0 0);  占据文档流， 不可以触发事件
  6. position: absolute;  不占据文档流， 不可以触发事件

# 5. 元素水平垂直居中的方式有哪些？
  1. 定位 + margin: auto;
  2. 定位 + margin负值 （子元素宽度和高度已知）
  3. 定位 + transform: translate(-50%, -50%);
  4. flex 布局
  5. grid 布局
  6. table-cell 布局

# 6. 谈谈你对 BFC 的理解
 - 是什么：
  BFC（Block Formatting Context）是 CSS 中的一种布局模式，它会创建一个独立的渲染区域，内部的元素不会影响到外部的元素。

 - 特点：
  1. BFC在计算高度时，会包含浮动子元素的高度。
  2. BFC不会与浮动元素重叠。
  3. 内部的元素不会影响到外部的元素

  overflow: hidden | auto | scroll | overlay;
  position: absolute | fixed;
  float: left | right;
  display: flex | grid | inline-xxx

 - 应用场景：
  1. 清除浮动
  2. 防止margin重叠

# 7. 怎么理解回流重绘？ （从输入url到页面渲染的过程 下）
- 输入url 后发生了什么？
 1. 网络传输
 2. 浏览器渲染

- 浏览器获取到服务端的资源后，要干什么？
 1. 解析 HTML 资源，生成 DOM 树
 2. 解析 CSS 文档，生成 CSSOM 树
 3. 合并 DOM 树和 CSSOM 树，生成渲染树
 4. 计算页面布局 （回流）
 5. 渲染页面(GPU) （重绘）

DOM树：
{
  tag: 'div',
  children: [
    {
      tag: 'p',
      children: [
        {
          tag: 'span',
          children: [
            {
              tag: 'text',
              text: 'hello world'
            }
          ]
        }
      ]
    }
  ]
}

CSSOM树：
{
  .box: {
    tag: 'div',
    style: {
      width: '100px',
      height: '100px',
      color: 'red'
    }
  }
}

render树：
{
  tag: 'div',
  style: {
    width: '100px',
    height: '100px',
    color: 'red'
  },
  children: [
    {
      tag: 'p',
      style: {
        width: '100px',
        height: '100px',
        color: 'red'
      },
      children: [
        {
          tag: 'span',
          style: {
            width: '100px',
            height: '100px',
            color: 'red'
          },
          children: [
            {
              tag: 'text',
              text: 'hello world'
            }
          ]
        }
      ]
    }
  ]
}

 发生回流的场景：页面元素的几何属性发生变化时，浏览器会重新计算元素的位置和大小，这个过程称为回流。

 重绘发生的场景：页面元素的外观属性发生变化时，浏览器会重新绘制元素，这个过程称为重绘。

 回流一定发生重绘，重绘不一定发生回流。

 - 浏览器的优化机制：
 由于每一次回流都会造成额外的计算消耗，所以浏览器会维护一个优化队列。将回流行为存放在队列中，直到一定时间后，或者达到阈值后，浏览器会一次性执行队列中的回流行为。

 - 导致回流的特例：
  offsetWidth、offsetHeight、...
  clientWidth、clientHeight、...
  scrollWidth、scrollHeight 


  - 应用场景：
   将元素脱离文档流后再批量修改元素的几何属性，再将元素重新插入文档流中，这样可以减少回流的次数。

# 8. 什么是响应式布局？你是怎么再项目中实现响应式布局的？
 - 响应式布局：指的是页面能够根据不同的设备屏幕尺寸，自动调整布局和样式，以提供更好的用户体验。
 - 实现响应式布局的方式：
  1. 媒体查询（Media Query）
  2. 弹性布局（Flexible Layout）
  3. 网格布局（Grid Layout）
  4. rem 单位 + 媒体查询
  5. vw/vh  % 单位

# 9. css中常见的实现动画的方式有哪些？
  1. 过渡（Transition）
  2. 自定义动画（Animation）
  3. 转变动画（Transform）


# 10. 如何用css画一个三角形？
 1. 利用border属性
 2. 利用clip-path属性
