@echo off
setlocal

docker stop log_v0.1.0_container
docker rm log_v0.1.0_container
docker rmi log_v0.1.0
call npm run build
docker build -t log_v0.1.0 .

endlocal