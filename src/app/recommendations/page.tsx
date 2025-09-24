'use client';

import {AppShell} from '@/components/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {
  generateHealthRecommendations,
  type HealthRecommendationsInput,
  type HealthRecommendationsOutput,
} from '@/ai/flows/personalized-health-recommendations';
import {
  Utensils,
  Dumbbell,
  HeartPulse,
  Download,
  MessageSquareQuote,
  FlaskConical,
  FileText,
} from 'lucide-react';
import {PlaceHolderImages} from '@/lib/placeholder-images';
import Image from 'next/image';
import {Suspense, useEffect, useState, useMemo} from 'react';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAppContext } from '@/context/app-context';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type RecommendationCardProps = {
  title: string;
  icon: React.ElementType;
  data: HealthRecommendationsOutput[keyof HealthRecommendationsOutput];
  image?: (typeof PlaceHolderImages)[0];
};

function RecommendationCard({
  title,
  icon: Icon,
  data,
  image,
}: RecommendationCardProps) {
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

function RecommendationsContent() {
  const { userProfile, testHistory } = useAppContext();
  const [recommendations, setRecommendations] = useState<HealthRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  
  const latestTest = testHistory.length > 0 ? testHistory[0] : null;

  const recommendationInput: HealthRecommendationsInput | null = useMemo(() => {
    if (!userProfile || !latestTest) {
      return null;
    }
    return {
      age: userProfile.age,
      heightCm: userProfile.height,
      weightKg: userProfile.weight,
      gender: userProfile.gender,
      familyHistory: userProfile.familyHistoryDetails?.split(',').map(s => s.trim()) || [],
      regularMedications: userProfile.regularMedications || 'None',
      durationOfPeriods: userProfile.durationOfPeriods,
      severityOfPeriods: userProfile.severityOfPeriods,
      irregularCyclesOrSpotting: userProfile.irregularCyclesOrSpotting,
      dietaryPreferences: userProfile.dietaryPreferences,
      supplementUse: userProfile.supplementUse,
      fatigueLevel: userProfile.fatigueLevel,
      dizzinessLevel: userProfile.dizzinessLevel,
      paleSkinOrNails: userProfile.paleSkinOrNails,
      shortnessOfBreath: userProfile.shortnessOfBreath,
      polydipsia: userProfile.polydipsia,
      polyuria: userProfile.polyuria,
      polyphagia: userProfile.polyphagia,
      hemoglobin: latestTest.hemoglobin,
      glucose: latestTest.glucose,
      crp: latestTest.crp,
    };
  }, [userProfile, latestTest]);


  useEffect(() => {
    async function fetchRecommendations() {
      if (!recommendationInput) {
        setLoading(false);
        return
      };
      
      try {
        setLoading(true);
        const result = await generateHealthRecommendations(recommendationInput);
        setRecommendations(result);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [recommendationInput]);
  
  if (!userProfile || !latestTest) {
    return (
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Insufficient Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">We need your profile and at least one test result to generate recommendations.</p>
          {!userProfile && <Link href="/"><Button>Create Profile</Button></Link>}
          {userProfile && !latestTest && <Link href="/connect-device"><Button>Start a Test</Button></Link>}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (!recommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load recommendations. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

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
    <div id="pdf-content" className="space-y-8 bg-background">
      {recommendationCards.map(rec => (
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
  );
}

export default function RecommendationsPage() {

  const handleSavePdf = () => {
        const input = document.getElementById('pdf-content');
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                let width = pdfWidth;
                let height = width / ratio;

                if (height > pdfHeight) {
                    height = pdfHeight;
                    width = height * ratio;
                }
                
                const x = (pdfWidth - width) / 2;

                pdf.addImage(imgData, 'PNG', x, 0, width, height);
                pdf.save(`DropCheck_Recommendations.pdf`);
            });
        }
    };


  return (
    <AppShell title="Personalized Recommendations">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="mb-8 bg-primary/10 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Your AI Health Guide
            </CardTitle>
            <CardDescription className="text-base">
              Based on your latest results and profile, here are some
              personalized tips to help you improve your health. This is not
              medical advice.
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
            <Button className="w-full" size="lg" onClick={handleSavePdf}>
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
