import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const CustomAvatar = ({
    avatar_url,
    username,
    className,
    onClick
}: {
    avatar_url: string;
    username: string;
    className?: string;
    onClick?: () => void
}) => {
    return (
        <Avatar className={className} onClick={onClick}>
            <AvatarImage src={avatar_url} />
            <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
    );
};

export default CustomAvatar;
