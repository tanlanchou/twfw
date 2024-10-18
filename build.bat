@echo off
setlocal

docker stop user_service_v0.1.0_container
docker rm user_service_v0.1.0_container
docker rmi user_service_v0.1.0
call npm run build
docker build -t user_service_v0.1.0 .

endlocal