#!/usr/bin/env python3

import traceback
import time
import requests
#import json



ONE_MINUTE_IN_DEC = 0.016667

RANGE_IN_NM = 10 #check box of 10 nautical miles around the UAV


getHeartbeatsUrl = 'http://home.kolesnik.org:9091/uavserver/v1/heartbeats'

postAdsbUrl = 'http://home.kolesnik.org:9091/uavserver/v1/adsb'


getAdsbsUrl = 'https://opensky-network.org/api/states/all?'





def processAdsb(unitId, adsbs):


	print("Process adsb for unit " + unitId)

	update = {
		"unitId": unitId,
		"targets": adsbs
	}

	try:
		resp = requests.post(postAdsbUrl, json=update, timeout=5)
	except requests.RequestException:
		traceback.print_exc()
		return False
	
	#print(resp.status_code, resp.ok)

	return resp.ok

def processHeartbeat(heartbeat):
	
	beat = heartbeat["heartbeat"]

	unitId = beat["unitId"] if beat is not None else None

	lat = beat["gpsLat"] if beat is not None else None
	lon = beat["gpsLon"] if beat is not None else None

	if lat is not None and lon is not None:

		lamin = lat - ONE_MINUTE_IN_DEC * RANGE_IN_NM
		lamax = lat + ONE_MINUTE_IN_DEC * RANGE_IN_NM
		lomin = lon - ONE_MINUTE_IN_DEC * RANGE_IN_NM * 2 #longitude is 2 times shorter than latitude at mid-latitudes
		lomax = lon + ONE_MINUTE_IN_DEC * RANGE_IN_NM * 2 #longitude is 2 times shorter than latitude at mid-latitudes


		url = getAdsbsUrl + 'lamin=' + str(lamin) + '&lomin=' + str(lomin) + '&lamax=' + str(lamax) + '&lomax=' + str(lomax)

		#print(url)

		try:
			adsbs = requests.get(url, timeout=5)

			if adsbs.status_code == 200 and adsbs.ok:

				processAdsb(unitId, adsbs.json())

		except requests.RequestException:
			traceback.print_exc()

	return


while True:

	try:
		heartbeatsResp = requests.get(getHeartbeatsUrl, timeout=1)
		#x = requests.post(url, data = myobj, timeout=1)

		if heartbeatsResp.status_code == 200 and heartbeatsResp.ok:
			#print(heartbeats.text)
			#print(heartbeatsResp.json())

			heartbeats = heartbeatsResp.json()

			for beat in heartbeats["data"]["heartbeats"]:
				processHeartbeat(beat)




	except Exception as e:
		traceback.print_exc()


	time.sleep(5)



