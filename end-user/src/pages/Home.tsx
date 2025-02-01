import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { motion, useAnimate } from 'motion/react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Mention, MentionsInput } from 'react-mentions';
// import { Loading } from "@/components/Loading";

// import { createEditor } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react';

// const initialValue = [
//     {
//         type: 'paragraph',
//         children: [{ text: 'A line of text in a paragraph.' }],
//     },
// ];

const value = `jfdsklfa\nfjk jj lsajfl\nfjsdlfjklsadjfl\njfkalsdf
`;

function Home() {
    const [show, setShow] = useState(false);
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const snowflakes = Array.from({ length: 200 }); // Tạo 50 bông tuyết

    useEffect(() => {
        if (show) {
            animate(scope.current, { opacity: 1, transform: 'translateY(-50px)' }, { duration: 0.5 });
        } else {
            animate(scope.current, { opacity: 0, transform: 'translateY(0px)' }, { duration: 0.5 });
        }
    }, [show]);

    // const [value, setValue] = useState('');
    // const [editor] = useState(() => withReact(createEditor()));

    // const renderElement = useCallback((props) => {
    //     switch (props.element.type) {
    //         case 'code':
    //             return <CodeElement {...props} />;
    //         default:
    //             return <DefaultElement {...props} />;
    //     }
    // }, []);

    return (
        <>
            <div className="p-10 bg-black w-flex col-span-11">
                <h1>Home</h1>
                <div ref={scope} className="w-10 h-10 bg-red-500 opacity-0" />
                <Button onClick={() => setShow(!show)}>Click me</Button>
                {/* <Loading state="full" size={30}/> */}
            </div>
            {/* <Slate editor={editor} initialValue={initialValue} 
                onChange={value => {
                    console.log(value)
                }}
            >
                <Editable
                    renderElement={renderElement}
                    onKeyDown={(event) => {
                        if (event.key === '&') {
                            event.preventDefault();

                            editor.insertText('and');
                        }
                    }}
                />
            </Slate> */}
            <MentionsInput value={value}>
                <Mention
                    trigger="#"
                    data={[]}
                    markup="#[__display__](__id__)"
                    displayTransform={(id: string, display: string) => `#${display}`}
                    // style={defaultMentionStyle}
                    
                />
            </MentionsInput>
        </>
    );
}

// const CodeElement = (props) => {
//     return (
//         <pre {...props.attributes}>
//             <code>{props.children}</code>
//         </pre>
//     );
// };

// const DefaultElement = (props) => {
//     return <p {...props.attributes}>{props.children}</p>;
// };

export default Home;
