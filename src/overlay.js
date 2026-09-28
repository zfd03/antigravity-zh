(() => {
  if (window.__antigravityZhOverlay || !location.hostname.match(/^127\.0\.0\.1$/)) return;
  window.__antigravityZhOverlay = true;
  document.documentElement.lang = 'zh-CN';

  // Exact UI labels only. Do not alter editor content, chat messages, commands, or paths.
  const words = new Map(Object.entries({
    'File': '文件', 'Edit': '编辑', 'View': '视图', 'Window': '窗口', 'Help': '帮助',
    'Settings': '设置', 'General': '通用', 'Application': '应用程序',
    'General Settings': '通用设置', 'Account Settings': '账户设置',
    'Appearance': '外观', 'Theme': '主题', 'Dark': '深色', 'Light': '浅色', 'System': '跟随系统',
    'New Window': '新建窗口', 'Close Window': '关闭窗口', 'Quit': '退出', 'Cancel': '取消',
    'Save': '保存', 'Apply': '应用', 'Done': '完成', 'Close': '关闭', 'Open': '打开',
    'Back': '返回', 'Next': '下一步', 'Continue': '继续', 'Retry': '重试',
    'Confirm': '确认', 'Delete': '删除', 'Remove': '移除', 'Rename': '重命名',
    'Create': '创建', 'Add': '添加', 'Edit': '编辑', 'Copy': '复制', 'Copied': '已复制',
    'Search': '搜索', 'Clear': '清除', 'Refresh': '刷新', 'Reload': '重新加载',
    'Learn more': '了解更多', 'Show more': '显示更多', 'Show less': '收起',
    'Project': '项目', 'Projects': '项目', 'Project Settings': '项目设置',
    'Project Name': '项目名称', 'New Project': '新建项目',
    'Create a Project': '创建项目', 'Create a New Project': '创建新项目',
    'New project': '新建项目',
    'Select a project': '选择项目', 'Choose a project': '选择项目',
    'No Project': '未选择项目', 'Folders': '文件夹', 'Add Folder': '添加文件夹',
    'Manage project folders, agent settings, and permissions.': '管理项目文件夹、智能体设置和权限。',
    'Permission Settings': '权限设置', 'Also includes': '还包括',
    'when working in this project.': '在此项目中工作时。',
    'Inherit Global': '继承全局设置', 'File Access Rules': '文件访问规则',
    'Configure allowed and denied paths for file reads and writes.': '配置允许和禁止读取、写入的路径。',
    'Terminal Commands': '终端命令', 'Configure allowed terminal commands.': '配置允许执行的终端命令。',
    'MCP Tools': 'MCP 工具',
    'Configure external tools via Model Context Protocol.': '通过 Model Context Protocol 配置外部工具。',
    'Danger Zone': '危险操作', 'Delete Project': '删除项目', 'Permanently delete': '永久删除',
    'Create project': '创建项目', 'Create Project': '创建项目',
    'Create project from scratch': '从头创建项目',
    'Open Project': '打开项目', 'Recent Projects': '最近的项目',
    'No projects yet': '暂无项目', 'New Task': '新建任务', 'New task': '新建任务',
    'Tasks': '任务', 'Task': '任务', 'All Tasks': '所有任务',
    'New Conversation': '新建对话', 'New conversation': '新建对话',
    'Conversations': '对话', 'History': '历史记录',
    'Send': '发送', 'Stop': '停止', 'Pause': '暂停', 'Resume': '继续',
    'Run': '运行', 'Review': '审查', 'Accept': '接受', 'Reject': '拒绝',
    'Approve': '批准', 'Deny': '拒绝', 'Allow': '允许', 'Always allow': '始终允许',
    'Allow once': '仅允许一次', 'Ask every time': '每次询问',
    'Terminal': '终端', 'Browser': '浏览器', 'Files': '文件', 'Changes': '更改',
    'Diff': '差异', 'Preview': '预览', 'Output': '输出', 'Logs': '日志',
    'Extensions': '扩展', 'Plugins': '插件', 'Skills': '技能',
    'Customizations': '自定义', 'Customize': '自定义', 'Custom': '自定义',
    'Permissions': '权限', 'Model': '模型', 'Models': '模型',
    'Model Settings': '模型设置', 'Select a model': '选择模型',
    'Choose a model': '选择模型', 'Available Models': '可用模型',
    'Search models': '搜索模型',
    'Notifications': '通知', 'Keyboard Shortcuts': '键盘快捷键',
    'Language': '语言', 'Update': '更新', 'Check for Updates': '检查更新',
    'Download': '下载', 'Install': '安装', 'Restart': '重启',
    'Sign in': '登录', 'Sign out': '退出登录', 'Profile': '个人资料',
    'Home': '主页', 'Welcome': '欢迎', 'Get Started': '开始使用',
    'Quick Start': '快速开始', 'Select Folder': '选择文件夹',
    'Open Folder': '打开文件夹', 'Open in Browser': '在浏览器中打开',
    'Open in Terminal': '在终端中打开', 'More options': '更多选项',
    'No results': '没有结果', 'Loading...': '加载中…', 'Loading…': '加载中…',
    'Error': '错误', 'Warning': '警告', 'Success': '成功',
    'Enabled': '已启用', 'Disabled': '已禁用', 'On': '开启', 'Off': '关闭',
    'Today': '今天', 'Yesterday': '昨天', 'Pinned': '已固定',
    'Archive': '归档', 'Archived': '已归档', 'Unarchive': '取消归档',
    'Share': '分享', 'Open Settings': '打开设置',
    'Search projects': '搜索项目', 'Search Projects': '搜索项目',
    'Search tasks': '搜索任务',
    'Search conversations': '搜索对话', 'Ask anything': '输入问题',
    'Ask a question': '输入问题', 'Type a message': '输入消息',
    'Ask anything, @ to mention, / for actions': '输入问题，使用 @ 提及，或用 / 选择操作',
    'Message input': '消息输入框', 'Send message': '发送消息',
    'Type your message...': '输入消息…',
    'Conversation History': '对话历史', 'Scheduled Tasks': '定时任务',
    'Conversation Log': '对话记录', 'No conversations yet': '暂无对话',
    'No more older messages': '没有更早的消息了',
    'Shortcuts': '快捷键', 'Provide Feedback': '提供反馈',
    'Not in Project': '未归入项目',
    'Execution': '执行', 'Queued Messages': '队列消息',
    'Queue': '加入队列', 'Send Immediately': '立即发送',
    'Keyboard shortcuts': '键盘快捷键',
    'Global Permissions': '全局权限', 'Permission Preset': '权限预设',
    'Default': '默认', 'Tool Permissions': '工具权限',
    'Network Access Rules': '网络访问规则', 'Agent Behavior': '智能体行为',
    'Plan Review Policy': '计划审查策略', 'Always Ask': '始终询问',
    'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
    'Configure agent execution, queued message delivery, and permissions.': '配置智能体执行、队列消息的发送方式及权限。',
    'Configure when follow-up messages are sent.': '设置后续消息的发送时机。',
    'Configure global allowed and denied resource permissions.': '配置全局允许和禁止的资源访问权限。',
    'Controls the actions the agent can take.': '控制智能体可以执行的操作。',
    'Modify permissions for file, terminal, and MCP tools.': '修改文件、终端和 MCP 工具的权限。',
    'Configure allowed and denied URLs for reading.': '配置允许和禁止读取的网址。',
    'Whether the agent asks you to review its documents.': '设置智能体是否请你审查文档。',
    'Type': '输入', 'and select': '并选择',
    'to have the agent generate a plan.': '即可让智能体生成计划。',
    'Configure the browser subagent. It requires': '配置浏览器子智能体。使用前需要安装',
    'to be installed.': '。',
    'The browser subagent can be invoked by typing /browser in the conversation input box.': '在对话输入框中输入 /browser 即可调用浏览器子智能体。',
    'Configure the browser subagent. It requires Google Chrome to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.': '配置浏览器子智能体。使用前需安装 Google Chrome。在对话输入框中输入 /browser 即可调用。',
    'Account': '账户', 'Models & Usage': '模型与用量',
    'Manage your plan, credentials, and general preferences.': '管理套餐、凭据和通用偏好设置。',
    'Enable Telemetry': '启用使用数据收集',
    'When toggled on, Antigravity collects usage data to help Google enhance performance and features.': '开启后，Antigravity 会收集使用数据，帮助 Google 改进性能和功能。',
    'Marketing Emails': '产品邮件',
    'Receive product updates, tips, and promotions from Google Antigravity via email.': '通过邮件接收 Google Antigravity 的产品更新、使用技巧和推广信息。',
    'Your Plan:': '当前套餐：', 'Antigravity Starter Quota': 'Antigravity 入门配额',
    'This account is ineligible for higher rate limits through a Google AI plan at this time.': '此账户目前无法通过 Google AI 套餐获得更高的使用限额。',
    'Email': '电子邮箱', 'Sign Out': '退出登录',
    'By using this app, you agree to its': '使用本应用即表示你同意其',
    'Terms of Service': '服务条款',
    'Controls whether the agent can run custom JavaScript to automate complex browser actions.': '控制智能体是否可以运行自定义 JavaScript 来执行复杂的浏览器操作。',
    'Request Review': '请求审查', 'Browser Actuation Rules': '浏览器操作规则',
    'Configure allowed and denied URLs for browser actuation.': '配置允许和禁止进行浏览器操作的网址。',
    "Configure the agent's visual theme and display preferences.": '配置智能体的主题和显示偏好。',
    'Contrast': '对比度', 'Strong': '高对比度', 'Light Theme': '浅色主题',
    'Dark Theme': '深色主题', 'Preset': '预设', 'Default Light': '默认浅色',
    'Default Dark': '默认深色', 'Background': '背景', 'Foreground': '前景',
    'Accent': '强调色', 'Chat Settings': '对话设置',
    'Verbose Agent Chat': '显示智能体详细过程',
    'Display and preserve intermediate thinking steps.': '显示并保留中间思考步骤。',
    'Conversation Width': '对话宽度',
    'Configure the maximum width of the conversation panel.': '设置对话面板的最大宽度。',
    'Narrow': '窄', 'Wide': '宽',
    'Manage Antigravity app settings.': '管理 Antigravity 应用设置。',
    'Prevent Sleep': '防止休眠',
    'Prevent the computer from sleeping while the app is running.': '应用运行时防止电脑进入休眠。',
    'Keep In Menu Bar': '保留在菜单栏',
    'Keep the app accessible from the menu bar and running in the background when all windows are closed.': '关闭所有窗口后，仍可从菜单栏打开应用并让其在后台运行。',
    'Remote Control': '远程控制', 'Enable Remote Control': '启用远程控制',
    'Work with local agents from another device.': '从其他设备使用本机智能体。',
    'Notification Settings': '通知设置',
    "To modify notification settings, open your operating system's system preferences.": '要修改通知设置，请打开操作系统的系统设置。',
    'Open System Preferences': '打开系统设置', 'Version': '版本',
    'App version': '应用版本', 'Advanced Settings': '高级设置',
    'Feedback Type': '反馈类型', 'Bug Report': '错误报告',
    'Feature Request': '功能建议', 'Auth and Billing': '认证与账单',
    'Remote Control Issue': '远程控制问题', 'General Feedback': '一般反馈',
    'Description': '描述', 'Steps to reproduce the issue': '复现步骤',
    'Expected behavior': '预期行为', 'Actual behavior': '实际行为',
    'Any error messages': '错误信息', 'Any relevant information': '其他相关信息',
    'Steps to Reproduce': '复现步骤', 'Attach a screenshot (optional)': '添加截图（可选）',
    'Attach Antigravity server logs': '添加 Antigravity 服务日志', 'Submit': '提交',
    'Keyboard shortcuts for quick navigation and control.': '用于快速导航和操作的键盘快捷键。',
    'Recommended': '推荐', 'Navigation': '导航',
    'Open Conversation Picker': '打开对话选择器', 'Open File Search': '打开文件搜索',
    'Focus Input': '聚焦输入框', 'File Picker': '文件选择器',
    'Select Previous Conversation': '选择上一个对话',
    'Select Next Conversation': '选择下一个对话',
    'Previous Pane Tab': '上一个面板标签', 'Next Pane Tab': '下一个面板标签',
    'Conversation': '对话', 'Toggle Model Selector': '切换模型选择器',
    'Toggle Voice Recording': '切换语音录制', 'Find in Pane': '在面板中查找',
    'Add to Chat/Quote': '添加到对话／引用', 'Layout Controls': '布局控制',
    'Toggle Sidebar': '切换侧边栏', 'Toggle Auxiliary Pane': '切换辅助面板',
    'Toggle Terminal': '切换终端',
    'Manage your model quota and credits.': '管理模型配额和点数。',
    'Plan': '套餐', 'Model Quota': '模型配额',
    'Gemini Models': 'Gemini 模型', 'Weekly Limit Remaining': '每周限额剩余',
    'Claude and GPT models': 'Claude 和 GPT 模型',
    'Browser Settings': '浏览器设置', 'Browser settings have moved': '浏览器设置已迁移',
    'Browser settings have moved to the Browser section of General settings.': '浏览器设置已移至“通用设置”中的“浏览器”部分。',
    'Go to General settings': '前往通用设置',
    'Configure default behaviors, skills, and MCP servers.': '配置默认行为、技能和 MCP 服务器。',
    'Token Usage': 'Token 用量',
    'There are no customizations enabled.': '尚未启用自定义功能。',
    'Global': '全局', 'Installed MCP Servers': '已安装的 MCP 服务器',
    'Add MCP': '添加 MCP', 'Open MCP Config': '打开 MCP 配置',
    'No MCP servers installed': '尚未安装 MCP 服务器',
    'Use Add MCP to browse the store, or add a custom server via the MCP config.': '使用“添加 MCP”浏览商店，或通过 MCP 配置添加自定义服务器。',
    'Build With Google Plugins': 'Google 插件',
    'Browse and enable plugins from the Build With Google catalog.': '浏览并启用 Google 插件目录中的插件。',
    'Add customization': '添加自定义项', 'Add Customization': '添加自定义项',
    'No customizations': '暂无自定义项',
  }));
  const uiSelector = 'button,a,label,h1,h2,h3,h4,h5,h6,[role="button"],[role="menuitem"],[role="tab"],[role="option"],nav,aside,dialog,[data-testid^="settings-nav-item-"]';
  const skipSelector = 'pre,code,kbd,samp,textarea,[contenteditable],.font-mono,.monaco-editor,[class*="CodeMirror"],[class*="editor"]';
  const attrSelector = '[title],[aria-label],[placeholder],[data-placeholder]';
  function inSettingsContent(element) {
    if (!document.querySelector('[data-testid^="settings-nav-item-"]')) return false;
    // Settings pages contain many labels rendered as plain div/span elements rather
    // than buttons or headings. Include the settings dialog and explicitly tagged
    // settings sections, without treating chat/editor scroll areas as settings UI.
    return Boolean(element.closest('[role="dialog"],[data-testid*="settings"]'));
  }
  function inSidebarOrProjectUI(element) {
    return Boolean(element.closest('nav,aside,[role="navigation"],[data-testid*="sidebar"],[data-testid*="project"]'));
  }
  const translate = value => {
    const match = /^(\s*)(.*?)(\s*)$/s.exec(value);
    if (!match) return value;
    const normalized = match[2].replace(/\s+/g, ' ');
    if (words.has(normalized)) return match[1] + words.get(normalized) + match[3];
    const punctuation = /([.!?…:;]+)$/u.exec(normalized);
    const withoutPunctuation = punctuation ? normalized.slice(0, -punctuation[1].length).trimEnd() : normalized;
    if (words.has(withoutPunctuation)) return match[1] + words.get(withoutPunctuation) + (punctuation?.[1] ?? '') + match[3];
    const quota = /^You have used some of your weekly limit, it will fully refresh in (.+)\.$/.exec(normalized);
    if (!quota) return value;
    const duration = quota[1]
      .replace(/(\d+)\s+days?/g, '$1天')
      .replace(/(\d+)\s+hours?/g, '$1小时')
      .replace(/(\d+)\s+minutes?/g, '$1分钟')
      .replace(/,\s*/g, '');
    return match[1] + `每周限额将在 ${duration} 后完全刷新。` + match[3];
  };
  function translateNode(node) {
    const parent = node.parentElement;
    const source = node.nodeValue.trim();
    const composer = parent?.closest('.relative.w-full,[data-testid*="composer"],[data-testid*="message-input"]');
    const composerPlaceholder = composer?.querySelector('[aria-label="Message input"],[aria-label="消息输入框"],[data-placeholder]');
    const sidebarEmptyState = source === 'No conversations yet' && parent?.closest('[data-testid="conversation-list-sidebar"]');
    if (!parent || parent.closest(skipSelector) || (!parent.closest(uiSelector) && !inSettingsContent(parent) && !inSidebarOrProjectUI(parent) && !composerPlaceholder && !sidebarEmptyState)) return;
    const next = translate(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
  }
  function visit(root) {
    if (!(root instanceof Element)) return;
    const elements = [root, ...root.querySelectorAll(attrSelector)];
    for (const element of elements) {
      for (const name of ['title', 'aria-label', 'placeholder', 'data-placeholder']) {
        if (element.hasAttribute(name)) {
          const old = element.getAttribute(name);
          const next = translate(old);
          if (next !== old) element.setAttribute(name, next);
        }
      }
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) translateNode(node);
  }
  visit(document.body);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') {
        translateNode(record.target);
      } else if (record.type === 'attributes') {
        visit(record.target);
      } else {
        for (const node of record.addedNodes) {
          if (node instanceof Element) visit(node);
          else if (node.nodeType === Node.TEXT_NODE) translateNode(node);
        }
      }
    }
  });
  observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'aria-label', 'placeholder', 'data-placeholder']});
})();
