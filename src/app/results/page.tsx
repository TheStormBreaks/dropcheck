import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Droplets, Activity, FileDown, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ResultStatus = 'Normal' | 'At Risk' | 'Needs Attention';

const getStatusStyles = (status: ResultStatus) => {
    switch (status) {
        case 'Normal':
            return {
                bar: 'bg-green-500',
                text: 'text-green-600',
                icon: <CheckCircle className="h-8 w-8 text-green-500" />
            };
        case 'At Risk':
            return {
                bar: 'bg-orange-500',
                text: 'text-orange-600',
                icon: <AlertTriangle className="h-8 w-8 text-orange-500" />
            };
        case 'Needs Attention':
            return {
                bar: 'bg-red-500',
                text: 'text-red-600',
                icon: <AlertTriangle className="h-8 w-8 text-red-600" />
            };
    }
};

const results = [
    {
        name: 'Hemoglobin',
        value: 11.2,
        unit: 'g/dL',
        range: '12.0 - 15.5',
        status: 'At Risk' as ResultStatus,
        icon: Droplets
    },
    {
        name: 'Glucose',
        value: 95,
        unit: 'mg/dL',
        range: '70 - 99',
        status: 'Normal' as ResultStatus,
        icon: Activity
    },
    {
        name: 'CRP',
        value: 5.1,
        unit: 'mg/L',
        range: '< 3.0',
        status: 'Needs Attention' as ResultStatus,
        icon: AlertTriangle
    },
];

// Determine overall status based on the worst result
const overallStatus = results.some(r => r.status === 'Needs Attention')
    ? 'Needs Attention'
    : results.some(r => r.status === 'At Risk')
        ? 'At Risk'
        : 'Normal';

const TrafficLightBar = ({ status, value, rangeString }: { status: ResultStatus; value: number; rangeString: string }) => {
    const range = rangeString.includes('-') ? rangeString.split('-').map(s => parseFloat(s.trim())) : [0, parseFloat(rangeString.replace('<', '').trim())];
    const [min, max] = range.length > 1 ? range : [0, range[0]];
    const totalRange = max * 1.5;
    const position = Math.max(0, Math.min(100, (value / totalRange) * 100));
    
    return (
        <div className="w-full">
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
                <div className="absolute h-full w-1/3 bg-green-500/30 left-0"></div>
                <div className="absolute h-full w-1/3 bg-orange-500/30 left-1/3"></div>
                <div className="absolute h-full w-1/3 bg-red-500/30 left-2/3"></div>
                <div className={cn("absolute h-full w-1.5 -translate-x-1/2 rounded-full border-2 border-white", getStatusStyles(status).bar)} style={{ left: `${position}%` }}></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default function ResultsPage() {
    const { icon: statusIcon, text: statusTextColor } = getStatusStyles(overallStatus);

    return (
        <AppShell title="Test Results">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Your Biomarker Results</CardTitle>
                        <CardDescription>Date: October 27, 2023</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {results.map(result => (
                            <div key={result.name}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <result.icon className="h-5 w-5 text-primary" />
                                        <h3 className="font-semibold">{result.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold">{result.value} <span className="text-sm font-normal text-muted-foreground">{result.unit}</span></p>
                                        <p className="text-xs text-muted-foreground">Ref: {result.range}</p>
                                    </div>
                                </div>
                                <TrafficLightBar status={result.status} value={result.value} rangeString={result.range} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            {statusIcon}
                            <CardTitle className={cn("text-2xl", statusTextColor)}>
                                {overallStatus}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">
                                {overallStatus === 'Normal' && 'Your results are within the normal range.'}
                                {overallStatus === 'At Risk' && 'Some of your results are borderline. We recommend monitoring your health closely.'}
                                {overallStatus === 'Needs Attention' && 'Some results are outside the normal range. Please consult a healthcare professional.'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                             <Link href="/recommendations" passHref>
                                <Button className="w-full justify-start" variant="ghost">
                                    <Bot className="mr-2 h-4 w-4" />
                                    Get AI Recommendations
                                </Button>
                            </Link>
                            <Button className="w-full justify-start" variant="ghost">
                                <FileDown className="mr-2 h-4 w-4" />
                                Save as PDF
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
