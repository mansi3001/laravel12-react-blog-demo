import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export default function Error403() {
    return (
        <>
            <Head title="Access Denied" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <ShieldX className="w-10 h-10 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Access Denied
                        </CardTitle>
                        <p className="text-gray-600 mt-2">
                            You don't have permission to access this page
                        </p>
                    </CardHeader>
                    
                    <CardContent className="text-center space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                                <strong>Error 403:</strong> Insufficient privileges to view this resource.
                                Please contact your administrator if you believe this is an error.
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
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Need help? Contact your system administrator
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}