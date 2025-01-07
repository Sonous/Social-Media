import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address' }),
    otp: z.string().min(1, { message: 'OTP is required.' }).max(6, { message: 'OTP need a six digit code.' }),
    fullname: z.string().min(1, { message: 'Full Name is required.' }),
    password: z
        .string()
        .min(1, { message: 'Password is required.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message:
                'Invalid password. Please make sure your password is at least 8 characters long and contains an uppercase letter, a lowercase letter, a number, and a special character.',
        }),
    username: z.string().min(1, { message: 'Username is required.' }),
});

function Signup() {
    const [disabledInputs, setDisabledInputs] = useState(['otp', 'password']);
    const [enableOtpBtn, setEnableOtpBtn] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            otp: '',
            fullname: '',
            password: '',
            username: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log('jdsfijsdi');
        console.log(values);
    }

    async function handleSendOTP() {
        try {
            const isValid = await form.trigger('email');

            if (isValid) {
                // Send otp and unlock otp field
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex-center min-h-svh">
            <div className="flex-center flex-col w-[400px] p-10 gap-5 shadow-lg rounded-lg border-2">
                <img src="/vite.svg" />
                <h1 className="text-lg font-semibold text-center">
                    Sign up to see photos and videos from your friends.
                </h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (inValid) => {
                            console.log(inValid);
                        })}
                        className="flex flex-col gap-5 w-full"
                    >
                        <div>
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

                                        <FormDescription
                                            className="text-end text-cerulean cursor-pointer font-medium"
                                            onClick={handleSendOTP}
                                        >
                                            Get OTP
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
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

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-picton_blue hover:bg-blue_(ncs)">
                            Sign up
                        </Button>

                        <FormDescription className="text-sm">
                            Have an account?{' '}
                            <Link to={'/account/login'} className="font-semibold text-picton_blue cursor-pointer">
                                Log in
                            </Link>
                        </FormDescription>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Signup;
