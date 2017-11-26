
docker image rm uavserver

docker build -t uavserver .

docker run --name pi-uavserver --restart always -v ~/uavserver/log:/app/log:rw -d -p 9000:9000 uavserver



