import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router';
import classNames from 'classnames';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import authApis from '@/apis/auth';
import useDebounce from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import Timer from '@/components/Timer';
import userApis from '@/apis/users';

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
    const [disabledInputs, setDisabledInputs] = useState(['otp', 'info']);
    const [isMounted, setIsMounted] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const { toast } = useToast()
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
                // TODO: Add loading effect
                await authApis.sendOpt(form.getValues('email'));
                console.log('send otp success');
                setDisabledInputs((prev) => [...prev.filter((item) => item !== 'otp'), 'email']);
                setShowTimer(true)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Check otp
    const otpDebounce = useDebounce(form.watch('otp'), 500);


    useEffect(() => {
        if (isMounted) {
            checkOtp();
        } else setIsMounted(true);

        async function checkOtp() {
            const isValid = await form.trigger('otp');
            
            if (!isValid) {
                console.log('otp invalid');
                return;
            }

            try {
                const { data } = await authApis.checkOtp(otpDebounce);

                if (data.isValid) {
                    setDisabledInputs(['otp'])
                    toast({
                        title: 'Success',
                        description: 'OTP is valid',
                    })
                } else {
                    form.setError('otp', {
                        type: 'custom',
                        message: 'Invalid OTP',
                    })
                }
            } catch (error) {
                console.log('error check otp', error);
            }
        }
    }, [otpDebounce]);

    // check username
    const usernameDebouce = useDebounce(form.watch('username'), 500)

    useEffect(() => {
        if (isMounted) {
            checkUsername();
        } else setIsMounted(true);

        async function checkUsername() {
            const isValid = await form.trigger('username');

            if (!isValid) {
                console.log('username invalid');
                return;
            }

            try {
                const { data } = await userApis.checkUsername(usernameDebouce)

                if(!data.isValid) {
                    form.setError('username', {
                        type: 'custom',
                        message: 'Username is taken. Please choose another one.',
                    })
                } else {
                    //TODO: process sign up action
                }
            } catch (error) {
                console.log(error)
            }
        }
    }, [usernameDebouce])

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
                                disabled={disabledInputs.includes('email')}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />

                                        <FormDescription className="flex justify-end">
                                            <span
                                                className={classNames(" font-medium", {
                                                    "text-cerulean  cursor-pointer": !showTimer,
                                                    "text-cerulean-200 cursor-not-allowed": showTimer
                                                })}
                                                onClick={() => {
                                                    if(!showTimer) {
                                                        handleSendOTP()
                                                    }
                                                }}
                                            >
                                                Get OTP
                                                {showTimer && <Timer duration={60} setShowTimer={setShowTimer}/>}
                                            </span>
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="otp"
                                disabled={disabledInputs.includes('otp')}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP</FormLabel>
                                        <FormControl>
                                            <Input  type="text"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullname"
                                disabled={disabledInputs.includes('info')}
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
                                disabled={disabledInputs.includes('info')}
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
                                disabled={disabledInputs.includes('info')}
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
                            <Link to={'/login'} className="font-semibold text-picton_blue cursor-pointer">
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
