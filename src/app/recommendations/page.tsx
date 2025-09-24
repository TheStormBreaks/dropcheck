import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateHealthRecommendations, type HealthRecommendationsInput, type HealthRecommendationsOutput } from '@/ai/flows/personalized-health-recommendations';
import { Utensils, Dumbbell, HeartPulse, Download, MessageSquareQuote, FlaskConical } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

type RecommendationCardProps = {
    title: string;
    icon: React.ElementType;
    data: HealthRecommendationsOutput[keyof HealthRecommendationsOutput];
    image?: (typeof PlaceHolderImages)[0];
};

function RecommendationCard({ title, icon: Icon, data, image }: RecommendationCardProps) {
    return (
        <Card className="overflow-hidden">
            {image && (
                <div className="relative aspect-video w-full">
                    <Image 
                        src={image.imageUrl} 
                        alt={title}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Icon className="h-7 w-7 text-primary" />
                    <span className="text-2xl">{title}</span>
                </CardTitle>
                 <CardDescription>{data.introduction}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {data.recommendations.map((rec, index) => (
                    <div key={index} className="rounded-lg border bg-secondary/30 p-4">
                        <h4 className="font-semibold text-lg mb-1">{rec.title}</h4>
                        <p className="text-muted-foreground">{rec.description}</p>
                    </div>
                ))}
                 <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 font-semibold">
                                <FlaskConical className="h-4 w-4" />
                                Scientific Rationale
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert prose-p:text-muted-foreground">
                           <p>{data.scientificRationale}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}

async function RecommendationsContent() {
    const recommendations = await generateHealthRecommendations(mockInput);
    
    const recommendationCards = [
        {
            title: 'Diet Advice',
            icon: Utensils,
            data: recommendations.dietAdvice,
            image: PlaceHolderImages.find(img => img.id === 'diet-advice'),
        },
        {
            title: 'Exercise Routine',
            icon: Dumbbell,
            data: recommendations.exerciseRoutine,
            image: PlaceHolderImages.find(img => img.id === 'exercise-routine'),
        },
        {
            title: 'Lifestyle Tips',
            icon: HeartPulse,
            data: recommendations.lifestyleTips,
            image: PlaceHolderImages.find(img => img.id === 'lifestyle-tips'),
        },
    ];

    return (
        <div className="space-y-8">
            {recommendationCards.map((rec) => (
                <RecommendationCard key={rec.title} {...rec} />
            ))}
        </div>
    );
}

function RecommendationsSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2, 3].map(i => (
                <Card key={i}>
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-4/5" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
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
                <Card className="mb-8 bg-primary/10 border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Your AI Health Guide</CardTitle>
                        <CardDescription className="text-base">
                            Based on your latest results and profile, here are some personalized tips to help you improve your health. This is not medical advice.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Suspense fallback={<RecommendationsSkeleton />}>
                    <RecommendationsContent />
                </Suspense>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button className="w-full" size="lg">
                            <Download className="mr-2 h-4 w-4" />
                            Save Recommendations
                        </Button>
                        <Button variant="secondary" className="w-full" size="lg">
                            <MessageSquareQuote className="mr-2 h-4 w-4" />
                            Request Expert Feedback
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
