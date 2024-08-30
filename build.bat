@echo off
setlocal

docker stop jwt_v0.1.0_container
docker rm jwt_v0.1.0_container
docker rmi jwt_v0.1.0
call npm run build
docker build -t jwt_v0.1.0 .

endlocal