import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }).min(8, { message: "It must be at least 8 characters long" })

});

export function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="lg:container h-full mx-auto">
            <div className="flex items-center justify-center h-full">
                <Form {...form}>
                    <Card className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                        <CardHeader>
                            <CardTitle className="text-center">Login</CardTitle>
                            {/* <CardDescription>Card Description</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Input placeholder="Username" {...field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Input placeholder="Password" {...field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="py-5">
                                    <Button className="w-full" type="submit">
                                        Login
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </Form>
            </div>
        </div>
    );
}
