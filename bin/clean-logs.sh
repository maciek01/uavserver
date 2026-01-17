#!/bin/sh


LOG_DIR="/home/pi/uavserver/log"
DAYS_OLD=7

#find "${LOG_DIR}" -name "*.log" -type f -mtime +${DAYS_OLD} -print
sudo find "${LOG_DIR}" -name "*.log" -type f -mtime +${DAYS_OLD} -delete


