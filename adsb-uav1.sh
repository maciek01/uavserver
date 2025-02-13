


RESP=$(curl -X 'POST' \
  'http://piserver2:9091/uavserver/v1/adsb' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "unitId": "uav1",
  "targets":
{
  "time": 1739409206,
  "states": [
    [
      "a7cfe3",
      "NKS727  ",
      "United States",
      1739409201, 1739409202, -71.0108, 42.3704, null, true, 0, 205.31, null, null, null, "1636",
      false, 0],
    [
      "a21bea",
      "RPA5702 ",
      "United States",
      1739409203, 1739409203, -71.0221, 42.3637, null, true, 0, 59.06, null, null, null, null, false, 0],
    [
      "a1fbd9",
      "RPA5808 ",
      "United States",
      1739409201, 1739409201, -71.0237, 42.3649, null, true, 0, 177.19, null, null, null, null, false, 0],
    [
      "a9fe30",
      "FDX1206 ",
      "United States",
      1739409201, 1739409201, -71.0223, 42.3592, null, true, 0, 210.94, null, null, null, null, false, 0],
    [
      "a89ccc",
      "NKS2975 ",
      "United States",
      1739409199, 1739409199, -71.0176, 42.3647, null, true, 0, 309.38, null, null, null, null, false, 0],
    [
      "a35fc2",
      "JBU1940 ",
      "United States",
      1739409196, 1739409197, -71.0145, 42.3651, null, true, 0.06, 320.62, null, null, null, "5770",
      false, 0],
    [
      "adc9b6",
      "JBU1302 ",
      "United States",
      1739409205, 1739409205, -71.0139, 42.3663, null, true, 0, 244.69, null, null, null, "0757",
      false, 0],
    [
      "aa8a83",
      "AAL108  ",
      "United States",
      1739409202, 1739409204, -71.0171, 42.36, null, true, 0, 315, null, null, null, null, false, 0],
    [
      "a358bd",
      "JBU2286 ",
      "United States",
      1739409199, 1739409203, -71.0151, 42.3687, null, true, 0.06, 227.81, null, null, null, null, false, 0],
    [
      "a2b26b",
      "JBU2355 ",
      "United States",
      1739409197, 1739409205, -71.0138, 42.3645, null, true, 0, 202.5, null, null, null, null, false, 0],
    [
      "4bb0e7",
      "THY5BY  ",
      "Turkey",
      1739409205, 1739409205, -71.0154, 42.3591, null, true, 4.63, 199.69, null, null, null, null, false, 0],
    [
      "ac159a",
      "RPA5714 ",
      "United States",
      1739409201, 1739409201, -71.0231, 42.3644, null, true, 0, 81.56, null, null, null, null, false, 0],
    [
      "a07228",
      "RPA4641 ",
      "United States",
      1739408896, 1739408896, -71.0187, 42.3602, null, true, 0, 30.94, null, null, null, "1473",
      false, 0],
    [
      "a38c66",
      "",
      "United States",
      1739409199, 1739409199, -71.0232, 42.3609, null, true, 5.66, 149.06, null, null, null, null, false, 0],
    [
      "a23844",
      "RPA5624 ",
      "United States",
      1739409206, 1739409206, -71.0131, 42.3564, null, true, 5.92, 191.25, null, null, null, null, false, 0],
    [
      "c00b93",
      "JZA612  ",
      "Canada",
      1739409198, 1739409204, -71.0214, 42.3606, null, true, 0, 300.94, null, null, null, "6222",
      false, 0],
    [
      "a35949",
      "JBU2620 ",
      "United States",
      1739409196, 1739409200, -71.0243, 42.3734, null, true, 0.06, 348.75, null, null, null, null, false, 0],
    [
      "a79e31",
      "JBU599  ",
      "United States",
      1739409205, 1739409205, -71.0162, 42.3573, null, true, 4.37, 199.69, null, null, null, null, false, 0],
    [
      "a742c2",
      "AAL1886 ",
      "United States",
      1739409200, 1739409205, -71.0179, 42.36, null, true, 0, 8.44, null, null, null, "7577",
      false, 0],
    [
      "a1e1d8",
      "RPA5627 ",
      "United States",
      1739409199, 1739409204, -71.0221, 42.3609, null, true, 0, 300.94, null, null, null, "3504",
      false, 0],
    [
      "ab3d17",
      "RPA5680 ",
      "United States",
      1739409205, 1739409205, -71.0206, 42.3602, null, true, 2.31, 300.94, null, null, null, "7442",
      false, 0],
    [
      "a36b2d",
      "JBU692  ",
      "United States",
      1739409201, 1739409203, -71.0247, 42.3732, null, true, 0.06, 95.62, null, null, null, null, false, 0],
    [
      "a4cd23",
      "JBU33   ",
      "United States",
      1739409204, 1739409204, -71.0174, 42.3677, null, true, 0, 213.75, null, null, null, "6772",
      false, 0],
    [
      "a35109",
      "JBU22   ",
      "United States",
      1739409189, 1739409194, -71.0161, 42.3677, null, true, 0.06, 151.88, null, null, null, null, false, 0],
    [
      "a2e45f",
      "N286BA  ",
      "United States",
      1739409101, 1739409159, -71.0216, 42.3744, null, true, 0, 312.19, null, null, null, "2340",
      false, 0],
    [
      "a66239",
      "JBU393  ",
      "United States",
      1739409205, 1739409205, -71.0153, 42.3672, null, true, 0, 337.5, null, null, null, null, false, 0]
  ]
}
}')

echo $RESP
