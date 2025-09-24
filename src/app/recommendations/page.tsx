import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateHealthRecommendations, type HealthRecommendationsInput } from '@/ai/flows/personalized-health-recommendations';
import { Utensils, Dumbbell, HeartPulse, Download, MessageSquareQuote } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// In a real app, this data would come from the user's profile and latest test results.
const mockInput: HealthRecommendationsInput = {
    age: 34,
    heightCm: 165,
    weightKg: 70,
    gender: 'Female',
    familyHistory: ['Diabetes'],
    regularMedications: 'None',
    durationOfPeriods: 5,
    severityOfPeriods: 'Moderate',
    irregularCyclesOrSpotting: false,
    dietaryPreferences: 'Non-vegetarian',
    supplementUse: ['iron'],
    fatigueLevel: 7,
    dizzinessLevel: 4,
    paleSkinOrNails: 5,
    shortnessOfBreath: 3,
    hemoglobin: 11.2, // From results page
    glucose: 95,    // From results page
    crp: 5.1,       // From results page
};

async function RecommendationsContent() {
    const recommendations = await generateHealthRecommendations(mockInput);
    
    const recommendationCards = [
        {
            title: 'Diet Advice',
            icon: Utensils,
            content: recommendations.dietAdvice,
            image: PlaceHolderImages.find(img => img.id === 'diet-advice'),
        },
        {
            title: 'Exercise Routine',
            icon: Dumbbell,
            content: recommendations.exerciseRoutine,
            image: PlaceHolderImages.find(img => img.id === 'exercise-routine'),
        },
        {
            title: 'Lifestyle Tips',
            icon: HeartPulse,
            content: recommendations.lifestyleTips,
            image: PlaceHolderImages.find(img => img.id === 'lifestyle-tips'),
        },
    ];

    return (
        <div className="space-y-6">
            {recommendationCards.map((rec) => (
                <Card key={rec.title} className="overflow-hidden">
                     {rec.image && (
                        <div className="relative aspect-video w-full">
                            <Image 
                                src={rec.image.imageUrl} 
                                alt={rec.title}
                                data-ai-hint={rec.image.imageHint}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <rec.icon className="h-6 w-6 text-primary" />
                            <span>{rec.title}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{rec.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function RecommendationsSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map(i => (
                <Card key={i}>
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function RecommendationsPage() {
    return (
        <AppShell title="Personalized Recommendations">
            <div className="w-full max-w-3xl mx-auto">
                <Card className="mb-6 bg-primary/10">
                    <CardHeader>
                        <CardTitle>Your AI Health Guide</CardTitle>
                        <CardDescription>
                            Based on your latest results and profile, here are some personalized tips to help you improve your health. This is not medical advice.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Suspense fallback={<RecommendationsSkeleton />}>
                    <RecommendationsContent />
                </Suspense>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Save Recommendations
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <MessageSquareQuote className="mr-2 h-4 w-4" />
                            Request Expert Feedback
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
