# 使用Node.js官方的轻量级镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装应用依赖
RUN npm install
COPY ./.env.prod ./.env
COPY ./template ./template
COPY ./configuration ./configuration

COPY ./rules ./rules


# 复制应用程序代码到工作目录
COPY app.js ./app.js

# 暴露应用程序运行的端口
EXPOSE 25501

# 定义运行时命令
CMD ["node", "app.js"]
