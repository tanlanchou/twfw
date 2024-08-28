@echo off
setlocal

REM Check if the container exists and is running
docker ps -a --filter "name=log_v0.1.0" --filter "status=running" --format "{{.Names}}" | find "log_v0.1.0" >nul 2>&1
if %errorlevel% equ 0 (
    echo Stopping and removing the running container log_v0.1.0...
    docker stop log_v0.1.0
    docker rm log_v0.1.0
) else (
    REM Check if the container exists but is not running
    docker ps -a --filter "name=log_v0.1.0" --format "{{.Names}}" | find "log_v0.1.0" >nul 2>&1
    if %errorlevel% equ 0 (
        echo Removing the stopped container log_v0.1.0...
        docker rm log_v0.1.0
    )
)

REM Remove the image
docker image rm log_v0.1.0

REM Build nestjs
echo Running npm run build...
call npm run build
if %errorlevel% neq 0 (
    echo npm run build failed with error level %errorlevel%
    exit /b %errorlevel%
)

REM build image
echo Building Docker image...
docker build -t log_v0.1.0 .

endlocal