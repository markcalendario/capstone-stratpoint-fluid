import {
  useAcceptInvite,
  useDenyInvite,
  useInvites
} from "@/hooks/use-project-members";
import pusherClient, { EVENTS } from "@/lib/utils/pusher-client";
import {
  InvitationEventData,
  ProjectMemberSchema
} from "@/types/projectMembers";
import { ProjectSchema } from "@/types/projects";
import { RoleSchema } from "@/types/roles";
import { useClerk } from "@clerk/nextjs";
import { Bell, BellOff, Check, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SectionEmpty from "./section-empty";
import SectionLoader from "./section-loader";
import { showActionToast, showErrorToast, showSuccessToast } from "./toast";

export default function InviteNotificationsButton() {
  const { user } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleReceiveInvitationEvent = (data: InvitationEventData) => {
    const action = !isOpen ? toggleMenu : () => {};
    showActionToast(data.message, "View", action);
  };

  useEffect(() => {
    if (!user) return;
    const channel = pusherClient.subscribe(user.id);
    channel.bind(EVENTS.INVITATION, handleReceiveInvitationEvent);

    return () => {
      channel.unbind(EVENTS.INVITATION, handleReceiveInvitationEvent);
      pusherClient.unsubscribe(user.id);
    };
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-primary block aspect-square cursor-pointer rounded-full bg-white p-2 dark:bg-neutral-900 dark:text-neutral-100">
        <Bell size={16} />
      </button>

      {isOpen && (
        <div className="ring-primary/20 absolute right-[-15px] mt-2 w-fit min-w-[300px] space-y-2 rounded-sm bg-white p-3 shadow-sm ring-1 dark:bg-neutral-800">
          <InviteNotificationList />
        </div>
      )}
    </div>
  );
}

function InviteNotificationList() {
  const { user } = useClerk();
  const { isInvitesLoading, invitesData } = useInvites(user?.id ?? "");

  const invites = invitesData?.invites;
  const isLoading = isInvitesLoading || !invites;

  if (isLoading) return <SectionLoader text="Loading Invitations" />;

  if (!invites.length) {
    return (
      <SectionEmpty
        icon={BellOff}
        text="No Invitations"
      />
    );
  }

  return invites.map((invite) => (
    <InviteNotification
      id={invite.id}
      key={invite.id}
      role={invite.role}
      isAccepted={invite.isAccepted}
      projectName={invite.projectName}
      projectImage={invite.projectImage}
      inviteElapsedTime={invite.inviteElapsedTime}
    />
  ));
}

interface InviteNotificationProps {
  inviteElapsedTime: string;
  role: RoleSchema["title"];
  id: ProjectMemberSchema["id"];
  projectName: ProjectSchema["id"];
  projectImage: ProjectSchema["imageUrl"];
  isAccepted: ProjectMemberSchema["isAccepted"];
}

function InviteNotification({
  id,
  role,
  projectName,
  projectImage,
  inviteElapsedTime
}: InviteNotificationProps) {
  const { user } = useClerk();
  const { isAcceptingInvite, acceptInvite } = useAcceptInvite(user?.id ?? "");
  const { isDenyingInvite, denyInvite } = useDenyInvite(user?.id ?? "");

  const handleAcceptInvite = async () => {
    const { success, message } = await acceptInvite({ id });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);
  };

  const handleDenyInvite = async () => {
    const { success, message } = await denyInvite({ id });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);
  };

  const isResponding = isAcceptingInvite || isDenyingInvite;

  return (
    <div className="w-full">
      <div className="flex items-start gap-2">
        <Image
          width={25}
          height={25}
          alt={projectName}
          src={projectImage}
          className="rounded-xs"
        />

        <div className="space-y-1">
          <p className="mr-2 text-xs leading-[17px] text-neutral-700 dark:text-neutral-200">
            You are invited to join in <strong>{projectName}</strong> as{" "}
            <strong className="mr-2">{role}.</strong>
            {!isResponding && (
              <span className="inline-flex gap-1">
                <button
                  className="cursor-pointer"
                  onClick={handleAcceptInvite}>
                  <Check size={10} />
                </button>

                <button
                  className="cursor-pointer"
                  onClick={handleDenyInvite}>
                  <X size={10} />
                </button>
              </span>
            )}
          </p>

          <p className="text-[10px] text-neutral-400">{inviteElapsedTime}</p>
        </div>
      </div>
    </div>
  );
}
