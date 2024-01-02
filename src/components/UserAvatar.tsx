import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import { Icons } from "./Icon";
import { AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<Props> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className=" relative h-full w-full aspect-square">
          <Image fill src={user.image} alt="Profile Picture" referrerPolicy="no-referrer"/>
        </div>
      ) : (
        <AvatarFallback>
            <span className=" sr-only">{user.name}</span>
            <Icons.user className=" h-4 w-4"/>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
