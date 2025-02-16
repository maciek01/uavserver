sudo apt install -y python3-pip
sudo python3 -m pip cache purge
sudo pip3 install --upgrade pip
sudo pip3 install --upgrade --no-cache-dir requests




#cd
#git clone git@github.com:openskynetwork/opensky-api.git
#cd opensky-api
#pip3 install -e $PWD/python

sudo rm -f /etc/systemd/system/adsb-pump.service
sudo ln -s /home/pi/uavserver/etc/systemd/system/adsb-pump.service /etc/systemd/system/adsb-pump.service

sudo systemctl start adsb-pump
sudo systemctl daemon-reload
sudo systemctl enable adsb-pump
sudo systemctl start adsb-pump
