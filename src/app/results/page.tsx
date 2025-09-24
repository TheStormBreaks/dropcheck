'use client';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Droplets, Activity, FileDown, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppContext, BiomarkerStatus } from '@/context/app-context';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const getStatusStyles = (status: BiomarkerStatus) => {
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

const biomarkerInfo = [
    {
        key: 'hemoglobin' as const,
        name: 'Hemoglobin',
        unit: 'g/dL',
        range: '12.0 - 15.5',
        icon: Droplets
    },
    {
        key: 'glucose' as const,
        name: 'Glucose',
        unit: 'mg/dL',
        range: '70 - 99',
        icon: Activity
    },
    {
        key: 'crp' as const,
        name: 'CRP',
        unit: 'mg/L',
        range: '< 3.0',
        icon: AlertTriangle
    },
];


const TrafficLightBar = ({ status, value, rangeString }: { status: BiomarkerStatus; value: number; rangeString: string }) => {
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
    const router = useRouter();
    const { testHistory, getBiomarkerStatus } = useAppContext();
    const latestTest = testHistory.length > 0 ? testHistory[0] : null;

    const results = useMemo(() => {
        if (!latestTest) return [];
        return biomarkerInfo.map(info => ({
            ...info,
            value: latestTest[info.key],
            status: getBiomarkerStatus(info.key, latestTest[info.key])
        }))
    }, [latestTest, getBiomarkerStatus]);

    const overallStatus = useMemo((): BiomarkerStatus => {
        if (!results.length) return 'Normal';
        const statuses = results.map(r => r.status);
        if (statuses.includes('Needs Attention')) return 'Needs Attention';
        if (statuses.includes('At Risk')) return 'At Risk';
        return 'Normal';
    }, [results]);

    const { icon: statusIcon, text: statusTextColor } = getStatusStyles(overallStatus);

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
                const width = pdfWidth;
                const height = width / ratio;

                pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight: height);
                pdf.save(`DropCheck_Results_${latestTest?.date}.pdf`);
            });
        }
    };
    
    if (!latestTest) {
        // This can happen if the user navigates directly to this page
        // without taking a test.
        return (
            <AppShell title="Test Results">
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-2xl font-semibold mb-2">No results to display.</h2>
                    <p className="text-muted-foreground mb-4">Please complete a test to see your results.</p>
                    <Link href="/connect-device" passHref>
                        <Button>Start a New Test</Button>
                    </Link>
                 </div>
            </AppShell>
        )
    }

    return (
        <AppShell title="Test Results">
            <div id="pdf-content" className="bg-background p-4">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Your Biomarker Results</CardTitle>
                            <CardDescription>Date: {new Date(latestTest.date).toLocaleDateString()}</CardDescription>
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
                    </div>
                </div>
            </div>
            <Card className="mt-6">
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
                    <Button className="w-full justify-start" variant="ghost" onClick={handleSavePdf}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Save as PDF
                    </Button>
                </CardContent>
            </Card>
        </AppShell>
    );
}
