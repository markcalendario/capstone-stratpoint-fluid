import Pusher from "pusher-js";

export const CHANNELS = {
  KANBAN: "kanban",
  ACTIVITY_LOG: "activity-log",
  NOTIFICATION: "notification"
};

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

const pusherClient = new Pusher(pusherKey, { cluster: pusherCluster });
export default pusherClient;
