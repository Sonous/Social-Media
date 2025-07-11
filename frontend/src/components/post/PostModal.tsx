import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
import FullPost from './FullPost';

export default function PostModal({
    post,
    isOpen,
    setIsOpen,
}: {
    post: Post;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[400px] md:max-w-[500px] lg:max-w-[550px] p-0 pt-3">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center">Post</DialogTitle>
                </DialogHeader>
                <FullPost post={post} type='modal' />
            </DialogContent>
        </Dialog>
    );
}
