import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import google from '@/assets/googleLogo.png';
import github from '@/assets/githubLogo.svg';
import { Link } from 'react-router';

const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(1, { message: 'Password is required.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message:
                'Invalid password. Please make sure your password is at least 8 characters long and contains an uppercase letter, a lowercase letter, a number, and a special character.',
        }),
});

function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log('jdsfijsdi');
        console.log(values);
    }

    return (
        <div className="flex-center min-h-svh">
            <div className="flex-center flex-col w-[400px] p-10 gap-5 shadow-lg rounded-lg border-2">
                <img src="/vite.svg" />
                <h1 className="text-lg font-semibold">Login to your Account</h1>

                <div className="flex flex-col gap-2 w-full">
                    <Button variant={'outline'}>
                        <img src={google} className="h-6 w-6" /> Log in with Google
                    </Button>
                    <Button variant={'outline'}>
                        <img src={github} className="h-6 w-6" /> Log in with Github
                    </Button>
                </div>

                <div className="flex justify-center items-center w-full">
                    <div className="h-[1px] w-full bg-[#dbdbdb]"></div>
                    <p className="mx-5">OR</p>
                    <div className="h-[1px] w-full bg-[#dbdbdb]"></div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (inValid) => {
                            console.log(inValid);
                        })}
                        className="flex flex-col gap-5 w-full"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormDescription>
                            <Link to={'/account/reset'} className="text-picton_blue-100">
                                Forgot password?
                            </Link>
                        </FormDescription>

                        <Button type="submit" className="w-full bg-picton_blue hover:bg-blue_(ncs)">
                            Log in
                        </Button>

                        <FormDescription>
                            <p className="text-sm">
                                Don't have an account?{' '}
                                <Link to={'/account/signup'} className="font-semibold text-picton_blue cursor-pointer">
                                    Sign up
                                </Link>
                            </p>
                        </FormDescription>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Login;
