// 全局变量
let currentPath = '~';
let posts = [];
let tags = {};

// 初始化
window.onload = function() {
    updateTime();
    setInterval(updateTime, 1000);
    loadPosts();
    setupInput();
    showWelcomeMessage();
};

// 更新时间
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    timeElement.textContent = now.toLocaleString();
}

// 加载文章
async function loadPosts() {
    try {
        // 尝试从本地文件系统加载
        let loaded = false;
        
        // 1. 尝试加载示例文章
        const sampleFiles = [
            '2026-01-01-hello-world.md',
            '2026-02-01-web-terminal.md',
            '2026-03-01-markdown-guide.md'
        ];
        
        for (const file of sampleFiles) {
            try {
                const response = await fetch(`posts/${file}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = parsePost(content, file);
                    posts.push(post);
                    updateTags(post);
                    loaded = true;
                }
            } catch (e) {
                // 忽略单个文件的加载错误
            }
        }
        
        // 2. 尝试加载用户可能添加的文章
        // 尝试加载常见的Markdown文件名
        const commonFiles = [
            '博客.md', 'blog.md', 'post.md', 'article.md',
            'index.md', 'readme.md', 'README.md'
        ];
        
        for (const file of commonFiles) {
            try {
                const response = await fetch(`posts/${file}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = parsePost(content, file);
                    // 避免重复加载
                    if (!posts.some(p => p.filename === file)) {
                        posts.push(post);
                        updateTags(post);
                        loaded = true;
                    }
                }
            } catch (e) {
                // 忽略单个文件的加载错误
            }
        }
        
        // 3. 尝试加载符合日期格式的文章 (YYYY-MM-DD-*.md)
        // 生成最近10年的日期范围
        const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);
        const months = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0'));
        const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
        
        // 尝试加载最近30天的可能文件
        const recentDates = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            recentDates.push(`${year}-${month}-${day}`);
        }
        
        // 尝试常见的标题格式
        const titleFormats = ['-article', '-post', '-blog', '-note', '-entry'];
        
        for (const date of recentDates) {
            for (const format of titleFormats) {
                const file = `${date}${format}.md`;
                try {
                    const response = await fetch(`posts/${file}`);
                    if (response.ok) {
                        const content = await response.text();
                        const post = parsePost(content, file);
                        // 避免重复加载
                        if (!posts.some(p => p.filename === file)) {
                            posts.push(post);
                            updateTags(post);
                            loaded = true;
                        }
                    }
                } catch (e) {
                    // 忽略单个文件的加载错误
                }
            }
        }
        
        // 4. 尝试加载其他可能的Markdown文件
        // 尝试1-3个字符的文件名
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let len = 1; len <= 3; len++) {
            // 生成所有可能的组合（仅尝试少量以避免性能问题）
            for (let i = 0; i < Math.min(100, Math.pow(chars.length, len)); i++) {
                let file = '';
                let num = i;
                for (let j = 0; j < len; j++) {
                    file = chars[num % chars.length] + file;
                    num = Math.floor(num / chars.length);
                }
                file += '.md';
                
                try {
                    const response = await fetch(`posts/${file}`);
                    if (response.ok) {
                        const content = await response.text();
                        const post = parsePost(content, file);
                        // 避免重复加载
                        if (!posts.some(p => p.filename === file)) {
                            posts.push(post);
                            updateTags(post);
                            loaded = true;
                        }
                    }
                } catch (e) {
                    // 忽略单个文件的加载错误
                }
            }
        }
        
        // 如果本地加载失败，使用模拟数据
        if (!loaded) {
            console.log('本地文件加载失败，使用模拟数据');
            useMockData();
        }
        
        // 按日期倒序排序
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('加载文章失败:', error);
        // 使用模拟数据
        useMockData();
    }
}

// 使用模拟数据
function useMockData() {
    const mockPosts = [
        {
            filename: '2026-01-01-hello-world.md',
            title: 'Hello World',
            date: '2026-01-01',
            tags: ['terminal', 'blog', 'markdown'],
            author: 'Your Name',
            content: '# Hello World\n\n这是我的第一篇Web终端风格博客文章。\n\n## 特性\n- 纯前端实现\n- 自动读取`posts/`文件夹\n- 终端命令交互\n- Markdown语法支持\n\n```javascript\nconsole.log(\'Hello Terminal Blog!\');\n```\n\n## 如何使用\n1. 在`posts/`文件夹中创建新的Markdown文件\n2. 按照`YYYY-MM-DD-标题.md`的格式命名\n3. 添加YAML Front Matter元数据\n4. 编写Markdown内容\n5. 刷新页面即可看到新文章'
        },
        {
            filename: '2026-02-01-web-terminal.md',
            title: 'Web Terminal 介绍',
            date: '2026-02-01',
            tags: ['terminal', 'web', 'javascript'],
            author: 'Your Name',
            content: '# Web Terminal 介绍\n\nWeb Terminal 是一种在浏览器中模拟终端界面的技术，它可以为用户提供命令行交互体验。\n\n## 实现原理\n1. 使用HTML和CSS创建终端界面\n2. 使用JavaScript处理用户输入和命令执行\n3. 使用fetch API加载和解析Markdown文件\n4. 使用marked.js解析Markdown为HTML\n5. 使用Prism.js实现代码高亮\n\n## 支持的命令\n- `ls` / `list` - 列出所有文章\n- `cat 文件名.md` / `view 文件名` - 查看文章\n- `cd posts` - 进入文章目录\n- `cd ..` - 返回上级目录\n- `pwd` - 显示当前路径\n- `help` - 显示帮助信息\n- `clear` - 清屏\n- `about` - 显示关于信息\n- `tags` - 列出所有标签\n- `search 关键词` - 搜索文章\n\n```bash\n# 示例命令\nls\ncat 2026-01-01-hello-world.md\n```'
        },
        {
            filename: '2026-03-01-markdown-guide.md',
            title: 'Markdown 语法指南',
            date: '2026-03-01',
            tags: ['markdown', 'guide', 'tutorial'],
            author: 'Your Name',
            content: '# Markdown 语法指南\n\nMarkdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。\n\n## 标题\n\n```markdown\n# 一级标题\n## 二级标题\n### 三级标题\n```\n\n## 列表\n\n### 无序列表\n- 项目1\n- 项目2\n- 项目3\n\n### 有序列表\n1. 第一步\n2. 第二步\n3. 第三步\n\n## 强调\n\n- **粗体**\n- *斜体*\n- ***粗斜体***\n\n## 链接\n\n[Markdown 官方文档](https://daringfireball.net/projects/markdown/)\n\n## 图片\n\n![示例图片](https://via.placeholder.com/300x200)\n\n## 代码块\n\n```python\ndef hello():\n    print("Hello, Markdown!")\n```\n\n## 引用\n\n> 这是一段引用文本\n> 引用可以跨多行\n\n## 表格\n\n| 姓名 | 年龄 | 职业 |\n|------|------|------|\n| 张三 | 25   | 工程师 |\n| 李四 | 30   | 设计师 |'
        }
    ];
    
    mockPosts.forEach(post => {
        posts.push(post);
        updateTags(post);
    });
}

// 解析文章内容和元数据
function parsePost(content, filename) {
    // 解析 YAML Front Matter
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontMatterRegex);
    
    let frontMatter = {};
    let markdownContent = content;
    
    if (match) {
        const frontMatterText = match[1];
        markdownContent = content.replace(match[0], '');
        
        // 简单解析 YAML
        const lines = frontMatterText.split('\n');
        for (const line of lines) {
            const parts = line.split(': ');
            if (parts.length === 2) {
                let key = parts[0].trim();
                let value = parts[1].trim();
                
                // 处理数组类型
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/'/g, ''));
                }
                
                frontMatter[key] = value;
            }
        }
    }
    
    return {
        filename,
        title: frontMatter.title || '无标题',
        date: frontMatter.date || filename.split('-').slice(0, 3).join('-'),
        tags: frontMatter.tags || [],
        author: frontMatter.author || '未知作者',
        content: markdownContent
    };
}

// 更新标签
function updateTags(post) {
    for (const tag of post.tags) {
        if (!tags[tag]) {
            tags[tag] = [];
        }
        tags[tag].push(post);
    }
}

// 设置输入处理
function setupInput() {
    const input = document.getElementById('input');
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                processCommand(command);
                input.value = '';
            }
        }
    });
}

// 处理命令
function processCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // 显示命令
    addOutput(`user@blog:${currentPath}$ ${command}`);
    
    switch (cmd) {
        case 'ls':
        case 'list':
            listPosts();
            break;
        case 'cat':
        case 'view':
            if (args.length > 0) {
                viewPost(args[0]);
            } else {
                addOutput('错误：请指定文件名');
            }
            break;
        case 'cd':
            if (args.length > 0) {
                changeDirectory(args[0]);
            } else {
                addOutput('错误：请指定目录');
            }
            break;
        case 'pwd':
            addOutput(currentPath);
            break;
        case 'help':
            showHelp();
            break;
        case 'clear':
            clearOutput();
            break;
        case 'about':
            showAbout();
            break;
        case 'tags':
            listTags();
            break;
        case 'search':
            if (args.length > 0) {
                searchPosts(args.join(' '));
            } else {
                addOutput('错误：请指定搜索关键词');
            }
            break;
        default:
            addOutput(`错误：未知命令 "${cmd}"，请输入 help 查看可用命令`);
    }
    
    // 滚动到底部
    scrollToBottom();
}

// 添加输出
function addOutput(text) {
    const output = document.getElementById('output');
    const p = document.createElement('p');
    p.textContent = text;
    output.appendChild(p);
}

// 添加HTML输出
function addHtmlOutput(html) {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
}

// 滚动到底部
function scrollToBottom() {
    const terminalBody = document.querySelector('.terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// 列出文章
function listPosts() {
    if (posts.length === 0) {
        addOutput('没有找到文章');
        return;
    }
    
    addOutput('文章列表（按时间倒序）：');
    addOutput('');
    
    posts.forEach(post => {
        const date = post.date;
        const title = post.title;
        const tags = post.tags.join(', ');
        addOutput(`${date} - ${title} [${tags}]`);
    });
}

// 查看文章
function viewPost(input) {
    let post = null;
    
    // 尝试直接匹配文件名
    let filename = input;
    if (!filename.endsWith('.md')) {
        filename += '.md';
    }
    post = posts.find(p => p.filename === filename);
    
    // 如果找不到，尝试根据文章标题匹配
    if (!post) {
        post = posts.find(p => p.title === input);
    }
    
    // 如果还是找不到，尝试模糊匹配标题
    if (!post) {
        post = posts.find(p => p.title.toLowerCase().includes(input.toLowerCase()));
    }
    
    if (post) {
        // 解析Markdown
        const html = marked.parse(post.content);
        
        // 添加文章头部信息
        const articleHtml = `
            <div class="article">
                <h1>${post.title}</h1>
                <p><strong>日期：</strong>${post.date}</p>
                <p><strong>作者：</strong>${post.author}</p>
                <p><strong>标签：</strong>${post.tags.join(', ')}</p>
                <hr>
                ${html}
            </div>
        `;
        
        addHtmlOutput(articleHtml);
        
        // 应用代码高亮
        Prism.highlightAll();
    } else {
        addOutput(`错误：找不到文件或文章 "${input}"`);
    }
}

// 更改目录
function changeDirectory(path) {
    if (path === 'posts') {
        currentPath = '~/posts';
        updatePrompt();
        addOutput('进入目录: posts');
    } else if (path === '..') {
        currentPath = '~';
        updatePrompt();
        addOutput('返回上级目录');
    } else {
        addOutput(`错误：目录 "${path}" 不存在`);
    }
}

// 更新提示符
function updatePrompt() {
    const prompt = document.querySelector('.prompt');
    prompt.textContent = `user@blog:${currentPath}$ `;
}

// 显示帮助
function showHelp() {
    addOutput('可用命令：');
    addOutput('');
    addOutput('ls / list          - 列出所有文章（按时间倒序）');
    addOutput('cat 文件名.md      - 查看文章内容');
    addOutput('view 文件名        - 查看文章内容（无需 .md 后缀）');
    addOutput('cd posts          - 进入文章目录');
    addOutput('cd ..             - 返回上级目录');
    addOutput('pwd               - 显示当前路径');
    addOutput('help              - 显示此帮助信息');
    addOutput('clear             - 清屏');
    addOutput('about             - 显示博客简介');
    addOutput('tags              - 列出所有标签及对应文章');
    addOutput('search 关键词      - 搜索文章标题/内容');
}

// 清屏
function clearOutput() {
    const output = document.getElementById('output');
    output.innerHTML = '';
}

// 显示关于
function showAbout() {
    addOutput('Web Terminal Blog');
    addOutput('版本：1.0.0');
    addOutput('');
    addOutput('一个纯前端实现的终端风格博客系统');
    addOutput('使用 HTML + CSS + 原生 JavaScript 构建');
    addOutput('支持 Markdown 解析和代码高亮');
    addOutput('');
    addOutput('只需在 posts/ 文件夹中添加 Markdown 文件即可发布文章');
}

// 列出标签
function listTags() {
    if (Object.keys(tags).length === 0) {
        addOutput('没有找到标签');
        return;
    }
    
    addOutput('标签列表：');
    addOutput('');
    
    for (const [tag, tagPosts] of Object.entries(tags)) {
        addOutput(`标签: ${tag}`);
        tagPosts.forEach(post => {
            addOutput(`  - ${post.date} - ${post.title}`);
        });
        addOutput('');
    }
}

// 搜索文章
function searchPosts(keyword) {
    const results = posts.filter(post => {
        return post.title.toLowerCase().includes(keyword.toLowerCase()) || 
               post.content.toLowerCase().includes(keyword.toLowerCase());
    });
    
    if (results.length === 0) {
        addOutput(`没有找到包含 "${keyword}" 的文章`);
        return;
    }
    
    addOutput(`搜索结果（包含 "${keyword}"）：`);
    addOutput('');
    
    results.forEach(post => {
        const date = post.date;
        const title = post.title;
        addOutput(`${date} - ${title}`);
    });
}

// 显示欢迎信息
function showWelcomeMessage() {
    addOutput('欢迎使用 Web Terminal Blog!');
    addOutput('');
    addOutput('这是一个纯前端实现的终端风格博客系统');
    addOutput('输入 help 查看可用命令');
    addOutput('');
}