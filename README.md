# Web Terminal Blog

一个纯前端实现的终端风格静态博客系统，使用HTML+CSS+原生JavaScript实现，无需后端、无需构建工具、纯静态可直接运行。

## 项目特点

- 🎨 模拟经典终端界面：黑底、等宽字体、绿色主色、白色辅助色
- ⌨️ 命令行交互：支持多种终端命令
- 📝 Markdown支持：支持完整的Markdown语法
- 💻 代码高亮：使用Prism.js实现代码块语法高亮
- 📱 响应式设计：适配桌面与移动端
- 🚀 纯静态部署：可直接部署到GitHub Pages、Netlify、Vercel等平台

## 项目结构

```
terminal-blog/
├── index.html       # 主页面
├── style.css        # 终端样式
├── script.js        # 命令逻辑与Markdown解析
├── posts/           # 博客文章文件夹
│   ├── 2026-01-01-hello-world.md
│   ├── 2026-02-01-web-terminal.md
│   └── 2026-03-01-markdown-guide.md
└── README.md        # 使用文档
```

## 快速开始

1. **克隆或下载项目**

2. **启动本地服务器**
   - 使用Python：`python -m http.server 8000`
   - 使用Node.js：`npx http-server . -p 8000`
   - 或直接在浏览器中打开 `index.html` 文件

3. **访问博客**
   在浏览器中打开 `http://localhost:8000`

## 如何添加文章

1. 在 `posts/` 文件夹中创建新的Markdown文件
2. 按照 `YYYY-MM-DD-标题.md` 的格式命名文件
3. 添加YAML Front Matter元数据（可选）：
   ```yaml
   ---
   title: 文章标题
   date: 2026-01-01
   tags: [标签1, 标签2]
   author: 作者名
   ---
   ```
4. 编写Markdown内容
5. 刷新页面即可看到新文章

## 支持的命令

| 命令 | 描述 |
|------|------|
| `ls` / `list` | 列出所有文章（按时间倒序，显示日期、标题、标签） |
| `cat 文件名.md` | 打开并渲染文章（Markdown转HTML，代码高亮） |
| `view 文件名` | 打开并渲染文章（无需 .md 后缀） |
| `cd posts` | 进入文章目录 |
| `cd ..` | 返回上级目录 |
| `pwd` | 显示当前路径 |
| `help` | 显示命令帮助 |
| `clear` | 清屏 |
| `about` | 显示博客简介 |
| `tags` | 列出所有标签及对应文章 |
| `search 关键词` | 搜索文章标题/内容 |

## 技术栈

- HTML5 + CSS3 + 原生JavaScript（ES6+）
- marked.js（CDN引入）- 解析Markdown
- Prism.js（CDN引入）- 代码高亮

## 部署方式

1. **GitHub Pages**
   - 推送项目到GitHub仓库
   - 在仓库设置中启用GitHub Pages
   - 选择 `main` 分支作为源

2. **Netlify**
   - 登录Netlify账号
   - 选择 "New site from Git"
   - 连接GitHub仓库
   - 点击 "Deploy site"

3. **Vercel**
   - 登录Vercel账号
   - 点击 "New Project"
   - 导入GitHub仓库
   - 点击 "Deploy"

## 自定义配置

- **修改终端样式**：编辑 `style.css` 文件
- **修改命令逻辑**：编辑 `script.js` 文件
- **添加新命令**：在 `script.js` 文件的 `processCommand` 函数中添加新的命令处理

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License