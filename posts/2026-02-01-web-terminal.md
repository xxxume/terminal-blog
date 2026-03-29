***

title: Web Terminal 介绍
date: 2026-02-01
tags: \[terminal, web, javascript]
author: Your Name
-----------------

# Web Terminal 介绍

<br />

## 实现原理

1. 使用HTML和CSS创建终端界面
2. 使用JavaScript处理用户输入和命令执行
3. 使用fetch API加载和解析Markdown文件
4. 使用marked.js解析Markdown为HTML
5. 使用Prism.js实现代码高亮

## 支持的命令

- `ls` / `list` - 列出所有文章
- `cat 文件名.md` / `view 文件名` - 查看文章
- `cd posts` - 进入文章目录
- `cd ..` - 返回上级目录
- `pwd` - 显示当前路径
- `help` - 显示帮助信息
- `clear` - 清屏
- `about` - 显示关于信息
- `tags` - 列出所有标签
- `search 关键词` - 搜索文章

```bash
# 示例命令
ls
cat 2026-01-01-hello-world.md
```

