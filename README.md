# pokemonMiniGame

一个 web 端的宝可梦小游戏

- author：肖楷炫
- authorEmail：xiaokaixuan24@163.com

## frontend 目录

- web 端源码

```bash
cd frontend

npm i

npm run dev
```

## server 目录

- 服务端源码

```bash
cd server

npm i

npm start
```

### 注意

- 需要本地启动 MongoDB
- 数据库配置在\server\config/db.config.js 中改
- 宝可梦数据初始化 get 请求一下/pokemons/init 就行

### nginx 配置示例

```bash

server {
	listen 80 ;
	listen [::]:80 ;

	root /yourDistPath;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name _;

  # 定义前端应用的静态文件目录
	location / {
		root /var/www/pokemon;  # 替换为你的前端 dist 文件夹的绝对路径
		index index.html;  # 默认文档
		try_files $uri $uri/ /index.html;  # 如果找不到文件，则重定向到 index.html
	}

	location /xkx/ {  # 假设你的后端 xkx 路径以 /xkx/ 开头
		rewrite ^/xkx/(.*)$ /$1 break;  # 去掉前缀 /xkx/
		proxy_pass http://localhost:1124;  # 代理到1124端口的后端服务
		proxy_set_header Host $host;  # 保留原始主机头
		proxy_set_header X-Real-IP $remote_addr;  # 记录客户端实际IP
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 记录转发的IP
		proxy_set_header X-Forwarded-Proto $scheme;  # 记录使用的协议（http或https）
	}

}
```

# 在线体验

[点我体验](https://xiaokaixuan.com/)

