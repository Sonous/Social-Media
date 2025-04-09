type FolderType = 'avatars' | 'posts';

type SignatureParams = { timestamp: number; folder?: string; overwrite?: boolean; public_id?: string };
type TokenPayload = {
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        avatar_url: string;
        bio: string;
        created_at: string;
        updated_at: string;
    };
    tokenType: 'accessToken' | 'refreshToken';
    iat: number;
    exp: number;
};
