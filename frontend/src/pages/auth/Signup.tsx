import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import classNames from 'classnames';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import authApis from '@/apis/auth.api';
import useDebounce from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import Timer from '@/components/Timer';
import userApis from '@/apis/users.api';
import { AxiosError } from 'axios';

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
    username: z
        .string()
        .min(1, { message: 'Username is required.' })
        .regex(/^\S*$/, { message: 'Username cannot contain spaces.' }),
});

function Signup() {
    const [disabledInputs, setDisabledInputs] = useState(['otp']);
    const [isMounted, setIsMounted] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
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

    // Send otp email
    async function handleSendOTP() {
        try {
            const isValid = await form.trigger('email');

            if (isValid) {
                await authApis.sendOpt(form.getValues('email'), false);
                setDisabledInputs((prev) => [...prev.filter((item) => item !== 'otp'), 'email']);
                setShowTimer(true);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    form.setError('email', {
                        type: 'custom',
                        message: 'Email have been used. Please use another one.',
                    });
                    return;
                }
                console.log('Send otp error', error);
            }
        }
    }

    // check username
    const usernameDebouce = useDebounce(form.watch('username'), 500).toLowerCase();

    useEffect(() => {
        if (isMounted) {
            checkUsername();
            // console.log(usernameDebouce.toLowerCase())
        } else setIsMounted(true);

        async function checkUsername() {
            const isValid = await form.trigger('username');

            if (!isValid) {
                console.log('username invalid');
                return;
            }

            try {
                const { data } = await userApis.checkUsername(usernameDebouce);

                if (!data.isValid) {
                    form.setError('username', {
                        type: 'custom',
                        message: 'Username is taken. Please choose another one.',
                    });
                } else {
                    toast({
                        title: 'Success',
                        description: 'Username is valid',
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [usernameDebouce]);

    // Sign up
    async function handleSignup(values: z.infer<typeof formSchema>) {
        try {
            const newUser = {
                name: values.fullname,
                username: values.username,
                email: values.email,
                password: values.password,
            };

            await authApis.signup(newUser, values.otp);
            navigate('/login');
        } catch (error) {
            console.log('Signup error', error);
            toast({
                title: 'Error',
                description: error instanceof AxiosError 
                    ? error.response?.data?.message || 'Something went wrong. Please try again.'
                    : 'Something went wrong. Please try again.',
            });
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
                    <form className="flex flex-col gap-5 w-full">
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
                                                className={classNames(' font-medium', {
                                                    'text-cerulean  cursor-pointer':
                                                        !showTimer && !disabledInputs.includes('getOtp'),
                                                    'text-cerulean-200 cursor-not-allowed':
                                                        showTimer || disabledInputs.includes('getOtp'),
                                                })}
                                                onClick={() => {
                                                    if (!showTimer && !disabledInputs.includes('getOtp')) {
                                                        handleSendOTP();
                                                    }
                                                }}
                                            >
                                                Get OTP
                                                {showTimer && <Timer duration={60} setShowTimer={setShowTimer} />}
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
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullname"
                                disabled={disabledInputs.includes('otp')}
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
                                disabled={disabledInputs.includes('otp')}
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
                                disabled={disabledInputs.includes('otp')}
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

                        <Button
                            type="button"
                            className="w-full bg-picton_blue hover:bg-blue_(ncs)"
                            disabled={disabledInputs.includes('otp')}
                            onClick={async () => {
                                const { invalid: usernameInvalid } = form.getFieldState('username');
                                const { invalid: emailInvalid } = form.getFieldState('email');

                                if (!usernameInvalid && !emailInvalid) {
                                    console.log('jfkasdjflk');
                                    const isFormValid = await form.trigger();

                                    if (isFormValid) {
                                        handleSignup(form.getValues());
                                    }
                                }
                            }}
                        >
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
