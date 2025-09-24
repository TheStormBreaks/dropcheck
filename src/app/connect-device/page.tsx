'use client';

import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { Bluetooth, Loader2, CheckCircle, AlertCircle, Wifi, WifiOff, XCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ScanStatus = 'idle' | 'scanning' | 'found' | 'pairing' | 'paired' | 'error';

const devices = [
    { name: 'DropCheck-A7B2', signal: 'strong' },
    { name: 'DropCheck-F3C9', signal: 'medium' },
];

export default function ConnectDevicePage() {
    const router = useRouter();
    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [cartridgeDetected, setCartridgeDetected] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (scanStatus === 'scanning') {
            timer = setTimeout(() => setScanStatus('found'), 2000);
        }
        if (scanStatus === 'pairing') {
            timer = setTimeout(() => {
                setScanStatus('paired');
                setCartridgeDetected(true);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [scanStatus]);

    const handleScan = () => {
        setScanStatus('scanning');
        setSelectedDevice(null);
        setCartridgeDetected(false);
    };

    const handlePair = (deviceName: string) => {
        setScanStatus('pairing');
        setSelectedDevice(deviceName);
    };

    const handleStartTest = () => {
        router.push('/test-workflow');
    };

    const getStatusContent = () => {
        switch (scanStatus) {
            case 'scanning':
                return { icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />, text: 'Scanning for devices...' };
            case 'found':
                return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: 'Devices found. Please select one to pair.' };
            case 'pairing':
                return { icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />, text: `Pairing with ${selectedDevice}...` };
            case 'paired':
                return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: `Successfully paired with ${selectedDevice}.` };
            case 'error':
                 return { icon: <AlertCircle className="h-5 w-5 text-destructive" />, text: 'Connection failed. Please try again.' };
            default:
                return { icon: <Bluetooth className="h-5 w-5 text-muted-foreground" />, text: 'Ready to connect.' };
        }
    };
    
    const { icon: statusIcon, text: statusText } = getStatusContent();

    return (
        <AppShell title="Connect to Device">
            <div className="w-full max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Connect to DropCheck Device</CardTitle>
                        <CardDescription>Follow the steps below to pair your device and start a test.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {scanStatus === 'idle' && (
                            <div className="flex justify-center p-8">
                                <Button size="lg" className="h-24 w-24 rounded-full flex-col gap-2" onClick={handleScan}>
                                    <Bluetooth className="h-10 w-10 animate-pulse" />
                                    <span>Scan</span>
                                </Button>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Alert>
                                <AlertTitle className="flex items-center gap-2">
                                    {statusIcon}
                                    <span>Connection Status</span>
                                </AlertTitle>
                                <AlertDescription>{statusText}</AlertDescription>
                            </Alert>

                            {scanStatus === 'found' && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Available Devices</h3>
                                    {devices.map(device => (
                                        <button key={device.name} onClick={() => handlePair(device.name)} className="w-full">
                                            <Card className="hover:bg-accent hover:border-primary transition-colors">
                                                <CardContent className="p-4 flex items-center justify-between">
                                                    <span className="font-medium">{device.name}</span>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        {device.signal === 'strong' ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                                                        <ChevronRight className="h-5 w-5" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </button>
                                    ))}
                                </div>
                            )}

                             <Alert variant={cartridgeDetected ? "default" : "destructive"}>
                                {cartridgeDetected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <AlertTitle>Cartridge Status</AlertTitle>
                                <AlertDescription>
                                    {cartridgeDetected ? "Cartridge detected and ready." : "No cartridge detected. Please insert one."}
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={scanStatus !== 'paired' || !cartridgeDetected}
                            onClick={handleStartTest}
                        >
                            Start Test
                        </Button>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Having trouble connecting? Get help.
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </AppShell>
    );
}
