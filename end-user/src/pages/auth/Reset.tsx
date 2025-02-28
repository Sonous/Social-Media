import { Lock } from 'lucide-react';
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
import Timer from '@/components/Timer';
import userApis from '@/apis/users.api';
import { AxiosError } from 'axios';


const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address' }),
    otp: z.string().min(1, { message: 'OTP is required.' }).max(6, { message: 'OTP need a six digit code.' }),
    password: z
        .string()
        .min(1, { message: 'Password is required.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message:
                'Invalid password. Please make sure your password is at least 8 characters long and contains an uppercase letter, a lowercase letter, a number, and a special character.',
        }),
});

function Reset() {
    // const [email, setEmail] = useState('')
    // const [otp, setOtp] = useState('')
    // const [password, setPassword] = useState('')
    const [disabledInputs, setDisabledInputs] = useState(['otp', 'info']);
    const [isMounted, setIsMounted] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            otp: '',
            password: '',
        },
    });

    const handleResetAccount = async (values: z.infer<typeof formSchema>) => {
        try {
            await userApis.updateUser(userId, { password: values.password })
            navigate('/login')
        } catch (error) {
            console.log('Reset account error', error);
        }
    };

    // Send otp email
    async function handleSendOTP() {
        try {
            const isValid = await form.trigger('email');

            if (isValid) {
                // TODO: Add loading effect
                const { data} = await authApis.reset(form.getValues('email'));
                setDisabledInputs((prev) => [...prev.filter((item) => item !== 'otp'), 'email']);
                setShowTimer(true)
                setUserId(data.userId)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if(error.status === 404) {
                    form.setError('email', {
                        type: 'custom',
                        message: 'Email not found',
                    })
                    return;
                }
                console.log('Send otp error', error);
            }
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
                    setDisabledInputs(prev => [...prev.filter(item => item !== 'info'), 'otp', 'getOtp'])
                    // TODO: add toast success
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

    return (
        <div className="flex-center min-h-svh">
            <div className="flex-center flex-col w-[400px] p-5 gap-5 shadow-lg rounded-lg border-2">
                <Lock size={50} />

                <h1 className="font-semibold text-lg">Trouble logging in?</h1>

                <p className="text-sm text-center">
                    Enter your email, phone, or username and we'll send you a link to get back into your account.
                </p>

                <Form {...form}>
                    <form
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
                                                    "text-cerulean  cursor-pointer": !showTimer && !disabledInputs.includes('getOtp'),
                                                    "text-cerulean-200 cursor-not-allowed": showTimer || disabledInputs.includes('getOtp'),
                                                })}
                                                onClick={() => {
                                                    if(!showTimer && !disabledInputs.includes('getOtp')) {
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
                        </div>

                        <Button type='button' className="w-full bg-picton_blue hover:bg-blue_(ncs)" onClick={async () => {
                            const { invalid: emailInvalid } = form.getFieldState('email')

                            if(!emailInvalid) {
                                const isFormValid = await form.trigger()

                                if(isFormValid) {
                                    handleResetAccount(form.getValues())
                                }
                            } 
                        }}>
                            Sign up
                        </Button>
                    </form>
                </Form>

                <div className="flex justify-center items-center w-full">
                    <div className="h-[1px] w-full bg-[#dbdbdb]"></div>
                    <p className="mx-5">OR</p>
                    <div className="h-[1px] w-full bg-[#dbdbdb]"></div>
                </div>

                <Link to="/signup" className="text-sm hover:text-blue_(ncs)">
                    Create new account
                </Link>
            </div>
        </div>
    );
}

export default Reset;
