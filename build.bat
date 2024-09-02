@echo off
setlocal

docker stop sms_v0.1.0_container
docker rm sms_v0.1.0_container
docker rmi sms_v0.1.0
call npm run build
docker build -t sms_v0.1.0 .

endlocal