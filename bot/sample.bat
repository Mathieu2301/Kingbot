@echo off
curl "https://www.kingpet.fr/api/v3/a/Votes/" ^
  --socks4a "localhost:9050" ^
  -H "authorization: Basic %1==" ^
  -H "content-type: text/plain;charset=UTF-8" ^
  --data-binary "{\"key_participant\":\"%3\",\"sig\":\"%4\",\"fg\":\"%2\"}"
