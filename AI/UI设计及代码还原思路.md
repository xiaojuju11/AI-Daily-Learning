# UI设计及代码还原思路

# 一、UI设计工具使用

## [**Stitch**](https://stitch.withgoogle.com/)

stitch 是谷歌旗下的通过提示词一键生成UI设计稿的工具，可通过一段提示词生成出我们想要的UI设计稿以及对应的原型文件（html）实现在线预览和操作

使用的是谷歌自家的Gemini模型。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/e0c2a8f3-d834-4ff3-a978-6c8fd8063842.png)

## [**OpenDesign**](https://open-design.ai/zh/)

这是开源的本地UI设计工具，可以通过提示词，将想法到原型、网页、PPT、视频的一站式生成。全流程在自己的设备上完成。

支持接入各类cli工具和模型api调入来生成你想要的UI设计稿等。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/d50579fa-e677-4df7-82dc-55df406ce10f.png)

## 上述两类工具的优缺点

目前来讲:

stitch有一定的免费使用额度（量大管饱）

opendesign需要接入外部API使用，也可以订阅官方的套餐使用各类高级模型（美元订阅，很贵）

1.  两者都可以生成png和html然后导入至本地然后让AI参考然后对照开发。
    
    并且，在有html文件的情况下，AI还原设计稿的还原度可达90%，仅图片的话，效果很差。
    
2.  stitch在一次性生成很多张设计稿的时候容易飘，跑偏。也就是一套设计稿下来，几张图片可能风格类似，但是主题内容和你的提示词对应可以存在一定偏离，放在UI代码实现的时候还原可能存在出现一些问题。
    
    ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/88673199-06de-4a11-93d9-8b867f23ec92.png)
    
    如图，底栏导航栏存在不一致，而且背景色存在风格偏差。不统一。
    
3.  OpenDesign连贯性非常的好，多张设计稿能很好的实现连贯性，容易达到我们想要的效果，但往往一套提示词下来，目前看来，stitch的效果会比Opendesign要好（可能是模型的问题，若采用高级模型或许这种效果会产生偏差）。
    

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/72c33d08-096c-40da-8030-f5e85dafd3b5.png)

## 工具如何使用

### stitch使用

首先进入首页，我们可以输入提示词，来直接创建设计稿，几分钟后我们就可以看到我们的设计图，更详细讲解如图：

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/77945832-623a-4a44-8fcb-d65ba9a9fd60.png)

我们输入一段简短的提示词，来看看效果：

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/e2c14325-631b-4aed-b388-de4dac060d49.png)

如下图可见，stitch的缺点如我上述所说，容易飘，我们就得去修改。不过我们可以选择在对话框中直接对话或者点击设计稿中的元素，指定修改，指哪打哪！

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/12d9c0bb-58ba-4f44-a2f7-2752bca40da4.png)

也可以点击箭头所指的播放按钮，生成原型文件，我们就可以像打开一个app一样直接预览我们生成的设计稿并体验其交互效果。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/c364842b-b602-4f7f-a084-7fd76840c2dd.png)

### OpenDesign使用

OpenDesign因为是开源项目，功能，生态方面远远多于stitch。有上百的内置skill和插件。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/c9f31fe7-443e-4538-aa70-8afe23a46a23.png)

使用方法依旧很简单，在我们输入好一段提示词后，OpenDesign就会自己执行

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/4e558077-f1da-47cb-b9b9-d8674d1f5520.png)

然后就会生成一系列的文件，我们可以直接点击打开查看预览

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/aaca6b1f-98cf-4b67-8449-2d9601e9a8df.png)

### 下载png和html文件到本地让AI参考来实现

可以直接在stitch或者opendesign上将自己的设计稿下载下来，然后导入本地，放到指定的目录下，让AI去参考，然后实现。

### 连接MCP服务到你的IDE（推荐）

通过这种方式，可以直接让IDE的agent去连接你的stitch或者opendesign来自动化的创建项目，编写提示词，然后生成项目，我们可以直接在工具上去查看生成后的设计稿，满意的话，可以让agent自动下载至本地，然后后续按照其文件参考来编写代码。

**stitch的MCP连接方式**

我们可以翻阅stitch的官方文档，有MCP的配置教程，如果因为全是英文而看不懂可以发给AI。

然后我们在设置里设置好密钥，在配置文件里面填充我们的密钥即可连接使用MCP服务。

懒人方式：文档给AI看，密钥发给AI。他会配好的。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/d620b2b3-16de-475e-9cfb-fc959e24c96e.png)

**OpenDesign**

这一位的配置方式就更加简单粗暴了。如图，OpenDesign给你了一套最简单的配置方式，直接给你复制一段提示词，发送给你的agent。他自己就能配好。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/dd1227f2-9ff5-4688-9820-73f57daee843.png)

在讲述上述两种工具使用后，我们就可以去调用MCP去设计UI稿子。同时应该写好一份md文档，**告诉AI调用mcp设计UI时，应该使用什么提示词，UI中有什么功能。这样才能生成的准确。而这些内容在下方有更详细讲解。**

## 使用建议

从上述来讲，OpenDesign似乎在我的眼里更加好用，因为他的生态更好，用的更舒服，更自由。但是那么我为何也会推荐stitch呢？

答案很简单：stitch毕竟是免费的，而且gemini模型在前端UI设计方面也有着很强的能力，我们我们开发一个项目的初期，很难去构思好一个项目整体应该有什么，或者他应该具备什么风格。这个时候我们可以先去使用stitch来零成本的生成一些探索向的设计图，来找到自己想用的风格。然后我们可以再转到OpenDesign中去实现我们的设计稿。

最最重要一点，OpenDesign的插件真的很香。众所周知，现在的AI设计网站生成的都是html + css 文件，但是在OpenDesign中，有这么三类插件，可以转成对应的框架代码，真的很香。然后我们可以下载下来，让AI去读然后照抄实现即可。还原率更高，bug出现频率更少。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/QvjnA3JdDG91BOXo/img/ea991ab7-47ea-44ed-b3d8-0908c17ca186.png)

# 二、UI设计前我们应该做什么？

在开发一个项目前，我们一般需要构思好这个产品的定位、功能、受众等问题。不然我们设计UI，他再好看，布局再优美，图纸中的功能未必是我们想要的。

那这个时候，产品经理的定位就很重要了。因为产品经理就会将产品的这些问题汇聚在一起出一份PM文档。而再次之后，我们就要根据这份文档去进行对应的模块设计，我们的项目应该具有什么模块，每个界面大概要有什么功能等。

在上述的问题解决之后我们才能够正式的开始设计UI再到代码的实现。

所以在这一块内容讲述我的开发前的AI说明书编写和UI设计提示词的编写思路。

而在这之前，我会先分享一下我的AI工作流程。

```plaintext
project/
├── AGENTS.md                         # 总入口
└── .agents/
    ├── AGENTS.md                     # 工作流时序与子代理协作
    ├── CONTEXT-RULE.md               # 开工读取顺序与记录更新规则
    ├── PROJECT-CONTEXT.md            # 当前阶段、已确认决策、下一步
    ├── HANDOFF.md                    # 模块、测试、集成与用户真机验证记录
    ├── REUSE.md                      # 复制到新项目时的使用说明
    ├── testing.md                    # 模块基础测试与统一集成要求
    ├── ui-approaches.md              # 默认 Stitch 的 UI 规则
    │
    ├── roles/
    │   ├── AGENTS.md                 # 子代理角色索引
    │   ├── product-manager.md        # 产品报告：模块、页面、数据关系
    │   ├── ui-designer.md            # Stitch UI、全屏三件套
    │   ├── uniapp-developer.md       # Composition API 开发与模块并行
    │   ├── code-tester.md            # 模块测试、最终集成
    │   └── architecture-cleaner.md   # 产品关联、共享数据与重复风险审查
    │
    ├── spec/
    │   ├── AGENTS.md                 # 三份规格的索引
    │   ├── 01-product-spec.md        # 产品报告
    │   ├── 02-module-design.md       # 路由、Storage、并行分工
    │   └── 03-ui-spec.md             # Screen、PNG、HTML 映射
```

细心的你可能已经发现了，在根目录以及各个子目录下都有一份AGENTS.md文档。如果说readme.md文档是给我们程序员的说明书，那么AGENTS.md文档也就是给AI的说明书。而这份文档已经成为各类CLI和AI编辑器的开发规范（claude不支持，仅支持自家的claude.md。把AGENTS.md替换成claude.md即可），agent在修改代码的时候会自动的去查看这类文档。

所以AGENTS.md文档的存在也就是我们能利用AI完整开发好一个项目的关键地方。

根目录下的文档会告诉AI：项目是什么，技术栈是什么，项目之类是什么，代码风格、注意事项以及各类文件的索引等。

当AI需要读其他的文件时，根目录下的文档会告诉AI应该去哪里读。这一块就类似于指针一样，仅告诉它地址即可。更详细的内容等你找到文件再说。然后子目录下面又会有一份ANENTS.md文档，这些文档就会更详细的告诉你这里的文件的作用职能。层层嵌套，形成一整套规范的工作流程。

而整个项目开发的核心，应该是在spec/这个文件夹下。你可以看到，这里有产品规格，模块设计，ui设计的文档。而这三份文档是AI在开发或设计对应模块功能的时候应该去维护的，我们应该让AI能够自己编写这些，然后更新内容，这样无论何时何地，上下文爆炸也好。我们都能够从容的去新开一个对话框去继续开发我们的项目。

因为整个项目的记忆都在这里。

同时我们也可以再建立一些文件，去记录我们项目整体的开发进度到了哪一步。就比如.agents/PROJECT-CONTEXT.md和HANDOFF.md文档。这样AI不仅知道我们项目是什么样的，还知道我们开发了到了哪里。我们仅需在AGENTS.md文档中约束好让他每次开工前读这些文件，并且每次开发完后去维护更新这些文档即可。

## UI设计稿的提示词编写

首先我们应该要知道提示词编写的重要性，提示词的好坏影响AI生成设计稿的质量可以占90%！

越好的提示词才可以做出越好设计稿。

先给大家看一份比较优质的提示词内容是什么样子的。

```plaintext
### 1. 角色设定
你是一位专注于 **Claymorphism（黏土形态）** 风格的 UI/UX 设计专家，擅长打破传统扁平化设计的枯燥，通过模拟物理世界的 **黏土质感、蓬松形态和柔和光影**，创造出极具亲和力和趣味性的数字界面。你的设计哲学是「**数字世界的实体化与软化**」，旨在让用户感受到屏幕背后的元素仿佛是真实存在的、可触摸的柔软物体，而非冰冷的像素。

### 2. 场景定位
**适用场景**：
- **Web3、NFT 与元宇宙项目**：利用其独特的 3D 属性和新潮感，展示虚拟资产或创建沉浸式体验。
- **儿童教育与早教应用**：柔软、圆润的视觉语言天然具有安全性与亲和力，能降低儿童的认知负担。
- **创意作品集与个人博客**：通过强烈的视觉风格展示设计师的个性和前卫审美。
- **休闲游戏界面**：与游戏内的卡通渲染风格高度契合，增强整体的娱乐氛围。
- **健康与冥想应用**：柔和的色彩和圆滑的形态有助于传递放松、舒缓的情绪。

**不适用场景**：
- **数据密集型后台管理系统（Dashboard）**：厚重的阴影和边距会占用大量屏幕空间，降低信息密度。
- **严肃的金融或法律文档处理**：过于活泼和童趣的风格会削弱权威感与专业严肃性。

### 3. 视觉设计理念
Claymorphism 的核心在于**「蓬松感」**与**「悬浮感」**。
- **反扁平化**：拒绝锐利的边缘和完全平坦的色块。每个 UI 元素都应该像是一个充气的气球或一块捏好的橡皮泥。
- **极致圆润**：所有的矩形都应该拥有巨大的圆角（Border Radius），按钮甚至可以接近胶囊形或圆形，模拟手工捏制的自然弧度。
- **空间层次**：通过强烈的深度暗示，让元素看起来是「漂浮」在背景之上的，或者是从背景中「凸起」的实体。

### 4. 材质与质感
要实现逼真的黏土质感，必须精细控制光影（CSS `box-shadow` 的高级应用）：
- **哑光表面（Matte Finish）**：黏土不是塑料或玻璃，不应有强烈的高光反射。表面应呈现漫反射，质感细腻且略带粗糙度。
- **双重阴影机制**：
  - **外部阴影（Drop Shadow）**：使用深色、大模糊半径的投影，营造物体悬浮的高度感。通常使用两个投影：一个深色模拟遮挡，一个浅色模拟环境光反射。
  - **内部阴影（Inner Shadow）**：这是 Claymorphism 的灵魂。在元素内部上方添加浅色内阴影（高光），在内部下方添加深色内阴影。这能营造出物体边缘的**厚度**和**圆滑的倒角**，产生类似 3D 建模的充气效果。
- **色彩策略**：偏向使用**高明度、低饱和度**的马卡龙色系（Macaron Colors）或粉彩（Pastel Colors）。背景色通常与主体色系保持一致但略浅，以减少视觉冲突，增强整体的柔和感。

### 5. 交互体验
交互设计应模拟物理按压的反馈：
- **Hover（悬停）**：元素轻微上浮，阴影扩散，暗示它是可交互的实体。
- **Active（点击/按压）**：这是体验的关键。点击时，元素不应只是变色，而应模拟**被按下去**的物理状态。
  - **视觉变化**：外部阴影收缩或消失，内部阴影加深，模拟物体被压入平面或变扁的状态。
  - **动态效果**：使用弹性曲线（Spring Animation），让按钮在松开时有「回弹」的果冻感。
- **表单输入**：输入框看起来应该像是黏土表面被「挖」出的一个凹槽（Neumorphism 的凹陷风格的柔软变体）。

### 6. 整体氛围
Claymorphism 营造的是一种**温暖、乐观、安全且充满好奇心**的氛围。它唤起了用户童年玩橡皮泥的触觉记忆，消除了技术的冰冷距离感。整个界面应该像是一个精心布置的玩具屋，每一个组件都让人忍不住想去戳一下、捏一下。这种风格传递出的情感是：「别紧张，这里很有趣，随便玩。」

---
```

在这里我们知道，一份好的UI设计应该是涵盖角色设定、场景定位、视觉设计与理念、材质与质感、交互体验、整体氛围等。而这些板块具体内容的编写能够决定你的UI生成出来是否优雅。

而在这一块，stitch因为免费额度很多，我们可以尽情发挥想象力去制作一些提示词然后给到stitch来验证自己的想法。

在这里，我分享一个网站，里面有很多AI生成出来的UI最佳实践以及对应的提示词，当然，这类网站存在很多，大家可以尽情去网上寻找并分享，学习对应的提示词思路，来实现更好的UI设计。

[https://www.uiprompt.site/zh/home](https://www.uiprompt.site/zh/home)