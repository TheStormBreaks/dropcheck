'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const steps = [
    {
        title: 'Step 1: Prepare Your Finger',
        instruction: 'Clean the tip of your finger with an alcohol swab. Use the provided lancet to prick the side of your fingertip.',
        image: PlaceHolderImages.find(img => img.id === 'prepare-finger'),
    },
    {
        title: 'Step 2: Collect the Sample',
        instruction: 'Gently squeeze your finger to form a drop of blood. Touch the tip of the test cuvette/strip to the blood drop until it fills.',
        image: PlaceHolderImages.find(img => img.id === 'fill-cuvette'),
    },
    {
        title: 'Step 3: Insert the Cuvette',
        instruction: 'Insert the filled cuvette/strip into the DropCheck device. Make sure it is inserted correctly.',
        image: PlaceHolderImages.find(img => img.id === 'insert-strip'),
    },
    {
        title: 'Step 4: Awaiting Results',
        instruction: 'The device is now analyzing your sample. Please wait a moment. Do not remove the cuvette.',
        image: PlaceHolderImages.find(img => img.id === 'wait-for-reading'),
    },
];

export default function TestWorkflowPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const progress = ((currentStep + 1) / steps.length) * 100;
    const isLastStep = currentStep === steps.length - 1;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLastStep) {
            timer = setTimeout(() => {
                // Simulate receiving results and redirecting
                router.push('/results');
            }, 3000); // Wait 3 seconds on the last step
        }
        return () => clearTimeout(timer);
    }, [currentStep, isLastStep, router]);

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const currentStepData = steps[currentStep];

    return (
        <AppShell title="Guided Test">
            <div className="w-full max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{currentStepData.title}</CardTitle>
                        <CardDescription>Follow the instructions carefully for an accurate result.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <Progress value={progress} className="w-full" />

                        {currentStepData.image && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                <Image 
                                    src={currentStepData.image.imageUrl} 
                                    alt={currentStepData.title}
                                    data-ai-hint={currentStepData.image.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        
                        <p className="text-lg">{currentStepData.instruction}</p>

                        {isLastStep && (
                            <div className="flex items-center justify-center gap-2 text-primary p-4 rounded-md bg-primary/10">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="font-semibold">Analyzing... Results will be ready shortly.</span>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardContent className="flex justify-between">
                         <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0 || isLastStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Button onClick={handleNext} disabled={isLastStep}>
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
