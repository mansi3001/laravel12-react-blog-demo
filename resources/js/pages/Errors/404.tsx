import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';

export default function Error404() {
    return (
        <>
            <Head title="Page Not Found" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <FileQuestion className="w-10 h-10 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Page Not Found
                        </CardTitle>
                        <p className="text-gray-600 mt-2">
                            The page you're looking for doesn't exist
                        </p>
                    </CardHeader>
                    
                    <CardContent className="text-center space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Error 404:</strong> The requested resource could not be found.
                                Please check the URL or navigate back to a safe page.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button 
                                asChild 
                                className="flex-1"
                                size="lg"
                            >
                                <Link href="/dashboard">
                                    <Home className="w-4 h-4 mr-2" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                onClick={() => window.history.back()}
                                className="flex-1"
                                size="lg"
                            >
                                <ArrowLeft className="w-4 w-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Lost? Try searching or contact support
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}