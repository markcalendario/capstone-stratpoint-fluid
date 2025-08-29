import Pusher from "pusher";

export default new Pusher({
  key: process.env.PUSHER_KEY as string,
  appId: process.env.PUSHER_APP_ID as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true
});
