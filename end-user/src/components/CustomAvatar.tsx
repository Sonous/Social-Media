import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const CustomAvatar = ({
    avatar_url,
    username,
    className,
}: {
    avatar_url: string;
    username: string;
    className?: string;
}) => {
    return (
        <Avatar className={className}>
            <AvatarImage src={avatar_url} />
            <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
    );
};

export default CustomAvatar;
