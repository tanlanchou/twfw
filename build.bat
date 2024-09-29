@echo off
setlocal

docker stop verification_code_v0.1.0_container
docker rm verification_code_v0.1.0_container
docker rmi verification_code_v0.1.0
call npm run build
docker build -t verification_code_v0.1.0 .

endlocal