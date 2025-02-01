import React, { useRef, useState } from 'react';
import DropZone from './DropZone';
import { ArrowLeft } from 'lucide-react';
import MediasCarousel from './MediasCarousel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import MediasCollection from './MediasCollection';
import EditPost from './edit_post/EditPost';
import supabase from '@/utils/supabase';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import postApis from '@/apis/posts';
import { Loading } from '../Loading';

type DialogState = 'selectMedia' | 'editPost';

type ManageDialogState = {
    currentPart: DialogState;
    enableParts: DialogState[];
};

const initialDialogState: ManageDialogState = {
    currentPart: 'selectMedia',
    enableParts: ['selectMedia'],
};

const CreateDialog = ({
    setShowCreateDialog,
}: {
    setShowCreateDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [medias, setMedias] = useState<CustomFile[]>([]);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [dialogState, setDialogState] = useState(initialDialogState);
    const [content, setContent] = useState('');
    const user = useAppSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false);

    const handleHideDialog = (event: React.MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            if (medias.length === 0) {
                setShowCreateDialog(false);
                return;
            }

            setShowDiscardDialog(true);
        }
    };

    const handlePreviousAction = () => {
        const currentIndex = dialogState.enableParts.indexOf(dialogState.currentPart);

        if (currentIndex === 0) {
            setShowDiscardDialog(true);
        } else {
            setDialogState((prev) => ({
                currentPart: prev.enableParts[currentIndex - 1],
                enableParts: prev.enableParts.slice(0, currentIndex),
            }));
        }
    };

    // TODO: handle send post to supabase and backend
    const handleSendPost = async () => {
        try {
            setIsLoading(true);

            const uploadPromises = medias.map(async (media) => {
                const { data } = await supabase.storage
                    .from('post_medias')
                    .upload(`/${user.id}/${media.file.name}`, media.file, {
                        upsert: true,
                    });

                return {
                    type: media.file.type.split('/')[0],
                    data,
                };
            });
            const uploadResults = await Promise.all(uploadPromises);

            const urlResults = uploadResults.map((result) => {
                if (result.data) {
                    const {data: { publicUrl}} = supabase.storage.from('post_medias').getPublicUrl(result.data.path);

                    return {
                        type: result.type,
                        url: publicUrl
                    };
                }
            }) as MediaType[];

            // TODO: pass object media following pattern: { type: string, url: string }
            // console.log(uploadResults);
            // console.log(urlResults);
            // console.log(medias);
            const { data: { message }} = await postApis.addPost({
                content,
                medias: urlResults,
                userId: user.id
            })

            if (message) {
                setDialogState(initialDialogState)
                setShowCreateDialog(false)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    // [0].replace(/\n\s*\n/g, '<br>')
    console.log(content.split(' '))

    return (
        <>
            {isLoading && <Loading state="full" size={30} />}
            <div
                className="h-svh bg-black bg-opacity-50 flex-center absolute z-̀50 w-full px-10"
                onClick={handleHideDialog}
            >
                <div ref={dialogRef} className="bg-white max-w-[750px] rounded-xl">
                    <header className="flex-center p-3 border-b-[1px]">
                        {medias.length === 0 ? (
                            <h1 className="font-semibold">Create new post</h1>
                        ) : (
                            <div className="flex justify-between w-full">
                                <ArrowLeft className="cursor-pointer" onClick={handlePreviousAction} />
                                <p>Select photos or videos</p>
                                <p
                                    className="cursor-pointer font-semibold text-cerulean hover:opacity-70"
                                    onClick={() => {
                                        if (dialogState.currentPart === 'editPost') {
                                            handleSendPost();
                                            return;
                                        }

                                        setDialogState((prev) => ({
                                            currentPart: 'editPost',
                                            enableParts: [...prev.enableParts, 'editPost'],
                                        }));
                                    }}
                                >
                                    {!dialogState.enableParts.includes('editPost') ? 'Next' : 'Share'}
                                </p>
                            </div>
                        )}
                    </header>
                    <main>
                        {dialogState.currentPart === 'selectMedia' && (
                            <>
                                {medias.length === 0 && <DropZone setMedias={setMedias} />}
                                {medias.length > 0 && (
                                    <>
                                        <MediasCollection medias={medias} setMedias={setMedias} />
                                        <MediasCarousel medias={medias} className="rounded-b-xl h-[500px] w-full" />
                                    </>
                                )}
                            </>
                        )}
                        {dialogState.currentPart === 'editPost' && (
                            <div className="grid grid-cols-[1.5fr_1fr]">
                                <MediasCarousel medias={medias} className="rounded-bl-lg h-[450px] w-full" />
                                <EditPost content={content} setContent={setContent} />
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
                <DialogTrigger />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard post?</DialogTitle>
                        <DialogDescription>If you leave, your edits won't be saved.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                setShowDiscardDialog(false);
                                setShowCreateDialog(false);
                            }}
                        >
                            Discard
                        </Button>
                        <Button variant={'secondary'} onClick={() => setShowDiscardDialog(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default CreateDialog;
