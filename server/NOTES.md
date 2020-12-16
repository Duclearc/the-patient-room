NOTES:
server/index.ts - line 34:

- 'message' is triggered by the 'send' method in 'the-patient-room/src/app/services/websocket.service.ts'
  server/index.ts - line 78:
- if/else would have been less code, but more performance heavy.
- switch() was chosen over map() because performance tests proved it to be minimally faster. I was surprised too!
