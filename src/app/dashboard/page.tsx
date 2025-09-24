'use client'

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Droplets, Activity, Info, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext, BiomarkerStatus, TestResult } from '@/context/app-context';
import { useMemo } from 'react';

const biomarkerInfo = {
  hemoglobin: {
    name: 'Hemoglobin',
    info: 'Measures the oxygen-carrying protein in your red blood cells. Normal range: 12.0 - 15.5 g/dL.',
    icon: Droplets,
    unit: 'g/dL',
  },
  glucose: {
    name: 'Glucose',
    info: 'Measures the amount of sugar in your blood. Normal range: 70 - 99 mg/dL.',
    icon: Activity,
    unit: 'mg/dL',
  },
  crp: {
    name: 'CRP',
    info: 'C-Reactive Protein, a marker for inflammation in the body. Normal range: < 3.0 mg/L.',
    icon: AlertTriangle,
    unit: 'mg/L',
  },
};


const referenceRanges = {
  hb: '12.0 - 15.5 g/dL',
  glucose: '70 - 99 mg/dL',
  crp: '< 3.0 mg/L'
};

const chartConfig = {
  Hemoglobin: {
    label: "Hemoglobin (g/dL)",
    color: "hsl(var(--chart-1))",
  },
  Glucose: {
    label: "Glucose (mg/dL)",
    color: "hsl(var(--chart-2))",
  },
  CRP: {
    label: "CRP (mg/L)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const statusStyles: Record<BiomarkerStatus, { text: string, bg: string, dot: string }> = {
    'Normal': { text: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/50', dot: 'bg-green-500' },
    'At Risk': { text: 'text-orange-800 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/50', dot: 'bg-orange-500' },
    'Needs Attention': { text: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/50', dot: 'bg-red-500' }
};

const BiomarkerCard = ({ name, value, unit, status, info, icon: Icon }: {name: string, value: number, unit: string, status: BiomarkerStatus, info: string, icon: React.ElementType}) => {
    const styles = statusStyles[status];
    return (
        <Card className={`overflow-hidden ${styles.bg}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className={`text-sm font-medium ${styles.text}`}>{name}</CardTitle>
                <Icon className={`h-5 w-5 ${styles.text}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className={`font-semibold ${styles.text}`}>{status}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{info}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
};

export default function DashboardPage() {
    const { testHistory, getBiomarkerStatus, userProfile } = useAppContext();
    
    const latestTest = useMemo(() => {
        return testHistory.length > 0 ? testHistory[0] : null;
    }, [testHistory]);

    const biomarkerData = useMemo(() => {
        if (!latestTest) return [];
        return [
            {
                name: 'Hemoglobin',
                value: latestTest.hemoglobin,
                status: getBiomarkerStatus('hemoglobin', latestTest.hemoglobin),
            },
            {
                name: 'Glucose',
                value: latestTest.glucose,
                status: getBiomarkerStatus('glucose', latestTest.glucose),
            },
            {
                name: 'CRP',
                value: latestTest.crp,
                status: getBiomarkerStatus('crp', latestTest.crp),
            },
        ];
    }, [latestTest, getBiomarkerStatus]);

    const chartData = useMemo(() => {
      return testHistory.map(test => ({
          date: new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Hemoglobin: test.hemoglobin,
          Glucose: test.glucose,
          CRP: test.crp
      })).reverse();
    }, [testHistory]);
    
    if (!userProfile) {
      return (
        <AppShell title="Dashboard">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to DropCheck</h2>
            <p className="text-muted-foreground mb-4">Please create your health profile to view your dashboard.</p>
            <Link href="/" passHref>
                <Button>Create Profile</Button>
            </Link>
          </div>
        </AppShell>
      )
    }
    
    if (!latestTest) {
        return (
            <AppShell title="Dashboard">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Test History</h2>
                    <p className="text-muted-foreground mb-4">You haven't performed any tests yet. Start a new test to see your results.</p>
                    <Link href="/connect-device" passHref>
                        <Button size="lg" className="w-full max-w-xs">
                            <Bluetooth className="mr-2 h-5 w-5" />
                            Start Device Test
                        </Button>
                    </Link>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell title="Dashboard">
            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {biomarkerData.map(data => (
                        <BiomarkerCard 
                            key={data.name} 
                            name={data.name}
                            value={data.value}
                            unit={biomarkerInfo[data.name.toLowerCase() as keyof typeof biomarkerInfo].unit}
                            status={data.status}
                            info={biomarkerInfo[data.name.toLowerCase() as keyof typeof biomarkerInfo].info}
                            icon={biomarkerInfo[data.name.toLowerCase() as keyof typeof biomarkerInfo].icon}
                        />
                    ))}
                </div>

                <Card className="text-center">
                    <CardContent className="p-6">
                        <Link href="/connect-device" passHref>
                            <Button size="lg" className="w-full max-w-xs">
                                <Bluetooth className="mr-2 h-5 w-5" />
                                Start Device Test
                            </Button>
                        </Link>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Device Connected</span>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Biomarker Trends</CardTitle>
                        <CardDescription>Visualize your biomarker changes over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" hide />
                                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" hide />
                                    <YAxis yAxisId="crp" orientation="right" stroke="hsl(var(--chart-3))" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="Hemoglobin" stroke="var(--color-Hemoglobin)" strokeWidth={2} dot={false} />
                                    <Line yAxisId="right" type="monotone" dataKey="Glucose" stroke="var(--color-Glucose)" strokeWidth={2} dot={false} />
                                    <Line yAxisId="crp" type="monotone" dataKey="CRP" stroke="var(--color-CRP)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Test History</CardTitle>
                        <CardDescription>View your past test results and track your progress.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Hemoglobin</TableHead>
                                    <TableHead>Glucose</TableHead>
                                    <TableHead>CRP</TableHead>
                                    <TableHead>Reference Range</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testHistory.map((test) => {
                                  const status = getBiomarkerStatus('hemoglobin', test.hemoglobin) === 'Needs Attention' || getBiomarkerStatus('glucose', test.glucose) === 'Needs Attention' || getBiomarkerStatus('crp', test.crp) === 'Needs Attention' ? 'Needs Attention' : (getBiomarkerStatus('hemoglobin', test.hemoglobin) === 'At Risk' || getBiomarkerStatus('glucose', test.glucose) === 'At Risk' || getBiomarkerStatus('crp', test.crp) === 'At Risk' ? 'At Risk' : 'Normal');
                                  const styles = statusStyles[status];
                                  
                                  return (
                                    <TableRow key={test.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-medium">{new Date(test.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{test.hemoglobin} g/dL</TableCell>
                                        <TableCell>{test.glucose} mg/dL</TableCell>
                                        <TableCell>{test.crp} mg/L</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span>Hb: {referenceRanges.hb}</span>
                                                <span>Glu: {referenceRanges.glucose}</span>
                                                <span>CRP: {referenceRanges.crp}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`${styles.bg} ${styles.text}`}>
                                                <span className={`mr-2 h-2 w-2 rounded-full ${styles.dot}`}></span>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
