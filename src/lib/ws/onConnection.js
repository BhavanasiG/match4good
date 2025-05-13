/* eslint @typescript-eslint/no-unsafe-call: 0 */
/* eslint @typescript-eslint/no-unsafe-member-access: 0 */

/**
 *
 * @param {*} ws WebSocket
 */
export default function onConnection(ws) {
  console.log('New client connected');

  ws.on('disconnect', () => {
    console.log('Client disconnected');
  });
}
