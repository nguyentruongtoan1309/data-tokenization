import { getRawData } from '@/apis/amplify';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/upload/FileUpload';
import config from '@/config/amplifyconfiguration.json';
import { currentSession } from '@/lib/utils';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsmobile from '../config/aws-exports';
import { signOut } from 'aws-amplify/auth';

Amplify.configure(config, {
    API: {
        REST: {
            headers: async () => {
                return {
                    Authorization: (await currentSession())?.idToken?.toString(),
                } as never;
            },
        },
    },
});
Amplify.configure(awsmobile);

const HomePage = () => {
    const { user } = useAuthenticator((context) => [context.user]);

    const handleSignOut = async () => {
        await signOut();
    };
    return (
        <div className='text-center p-5'>
            <h1 className='mb-5 text-2xl'>Home Page</h1>
            <h2 className="mb-5">Welcome {user?.username}</h2>
            <div className="mb-5">
                <Button className='mx-1' onClick={handleSignOut}>Log out</Button>
                <Button className='mx-1' onClick={currentSession}>Get token</Button>
                <Button className='mx-1' onClick={getRawData}>Get raw data</Button>
            </div>
            <FileUpload />
        </div>
    );
};

export default HomePage;