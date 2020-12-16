# NOTES:

## BACKEND
server/index.ts - line 34:
- 'message' is triggered by the 'send' method in 'the-patient-room/src/app/services/websocket.service.ts'

server/index.ts - line 78:
- if/else would have been less code, but more performance heavy.
- switch() was chosen over map() because performance tests proved it to be minimally faster. I was surprised too!

## FRONTEND
src/app/components/room - line 13:
- since those properties are used only to 'get data' from somewhere else and each is taken from a different mehtod, I opted away from a traditional subscription and used this syntatic sugar instead.
- it's less code, easier to read (in my opinion) and service the same.
