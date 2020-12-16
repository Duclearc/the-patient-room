RUN:
- navigate to `server` folder on your terminal
- `npm i`
- `tsc`
- `node ./dist/server/index.js`
- you should see the message...

    >Server has started and runs on port: 1234

    ...appear on your terminal.
- have fun!

NOTES:
 server/index.ts - line 34:
 - 'message' is triggered by the 'send' method in 'the-patient-room/src/app/services/websocket.service.ts'
 server/index.ts - line 78:
 - switch() was chosen over map() because performance tests proved it to be minimally faster. I was surprised too!