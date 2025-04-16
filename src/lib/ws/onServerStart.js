/* eslint @typescript-eslint/no-unsafe-call: 0 */
/* eslint @typescript-eslint/no-unsafe-member-access: 0 */

/**
 *
 * @param {*} server Server
 */
export default function onServerStart(server) {
  let counter = 0;
  console.log("Got here");
  setInterval(() => {
    server.emit("counter", counter);
    counter += 1;
  }, 2000);
}
