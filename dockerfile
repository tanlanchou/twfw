# 使用官方的Node.js运行时作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /usr/src/app

# 将package.json复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将应用程序代码复制到工作目录
COPY . .

EXPOSE 8101

# 运行应用程序
CMD [ "node", "dist/main.js" ]