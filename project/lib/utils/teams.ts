import { TeamsSchema } from "@/types/teams";

export const MEMBERSHIP_STATUS = {
  OWNER: "Owner",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  INVITED: "Invited"
};

export function getMembershipStatus(isAccepted?: TeamsSchema["isAccepted"]) {
  if (isAccepted) {
    return MEMBERSHIP_STATUS.ACCEPTED;
  } else if (isAccepted === false) {
    return MEMBERSHIP_STATUS.DECLINED;
  } else if (isAccepted === null) {
    return MEMBERSHIP_STATUS.INVITED;
  } else {
    return "No Status";
  }
}
