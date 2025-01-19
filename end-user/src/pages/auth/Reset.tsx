import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

function Reset() {
    const handleResetAccount = () => {};

    return (
        <div className="flex-center min-h-svh">
            <div className="flex-center flex-col w-[400px] p-5 gap-5 shadow-lg rounded-lg border-2">
                <Lock size={50} />

                <h1 className="font-semibold text-lg">Trouble logging in?</h1>

                <p className="text-sm text-center">
                    Enter your email, phone, or username and we'll send you a link to get back into your account.
                </p>

                <div className="w-full">
                    <Input type="text" placeholder="Enter your email or username" />

                    <Button className="w-full mt-5 bg-picton_blue hover:bg-blue_(ncs)" onClick={handleResetAccount}>
                        Reset Password
                    </Button>
                </div>

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
