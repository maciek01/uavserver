
docker container stop pi-uavserver
docker container rm pi-uavserver
docker image rm uavserver
#docker image rm piserver:5000/uavserver
docker build -t uavserver .

#docker tag uavserver piserver:5000/uavserver
#docker push piserver:5000/uavserver

docker run --name pi-uavserver --restart always -v ~/uavserver/log:/app/log:rw -d -p 9091:9000 uavserver
#docker run --name pi-uavserver --restart always -v ~/uavserver/log:/app/log:rw -d -p 9091:9000 piserver:5000/uavserver
