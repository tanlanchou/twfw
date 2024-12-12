echo CONSUL_HOST
echo %CONSUL_HOST%
echo CONSUL_TOKEN
echo %CONSUL_TOKEN%
docker run -d --name log_v0.1.0_container -p 8103:8103 --env CONSUL_HOST=%CONSUL_HOST% --env CONSUL_TOKEN=%CONSUL_TOKEN% --restart always log_v0.1.0