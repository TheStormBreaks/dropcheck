
'use client'

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Droplets, Activity, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

type BiomarkerStatus = 'Normal' | 'At Risk' | 'Needs Attention';

const biomarkerData = [
  {
    name: 'Hemoglobin',
    value: '13.5 g/dL',
    status: 'Normal' as BiomarkerStatus,
    info: 'Measures the oxygen-carrying protein in your red blood cells. Normal range: 12.0 - 15.5 g/dL.',
    icon: Droplets,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/50',
  },
  {
    name: 'Glucose',
    value: '115 mg/dL',
    status: 'At Risk' as BiomarkerStatus,
    info: 'Measures the amount of sugar in your blood. Normal range: 70 - 99 mg/dL.',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/50',
  },
  {
    name: 'CRP',
    value: '4.2 mg/L',
    status: 'Needs Attention' as BiomarkerStatus,
    info: 'C-Reactive Protein, a marker for inflammation in the body. Normal range: < 3.0 mg/L.',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/50',
  },
];

const recentTests = [
    { date: '2023-10-26', hb: '13.5', glucose: '98', crp: '1.2', status: 'Normal' },
    { date: '2023-10-19', hb: '12.8', glucose: '115', crp: '2.5', status: 'At Risk' },
    { date: '2023-10-12', hb: '11.9', glucose: '125', crp: '4.2', status: 'Needs Attention' },
    { date: '2023-10-05', hb: '13.2', glucose: '95', crp: '0.9', status: 'Normal' },
];

const referenceRanges = {
  hb: '12.0 - 15.5 g/dL',
  glucose: '70 - 99 mg/dL',
  crp: '< 3.0 mg/L'
};

const chartData = recentTests.map(test => ({
    date: new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Hemoglobin: parseFloat(test.hb),
    Glucose: parseFloat(test.glucose),
    CRP: parseFloat(test.crp)
})).reverse();


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

const statusStyles: Record<BiomarkerStatus, string> = {
    'Normal': 'bg-green-500',
    'At Risk': 'bg-orange-500',
    'Needs Attention': 'bg-red-500'
};

const BiomarkerCard = ({ name, value, status, info, icon: Icon, color, bgColor }: (typeof biomarkerData)[0]) => (
    <Card className={`overflow-hidden ${bgColor}`}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${color}`}>{name}</CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className={`font-semibold ${color}`}>{status}</span>
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

export default function DashboardPage() {
    return (
        <AppShell title="Dashboard">
            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {biomarkerData.map(data => <BiomarkerCard key={data.name} {...data} />)}
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
                                {recentTests.map((test) => (
                                    <TableRow key={test.date} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-medium">{test.date}</TableCell>
                                        <TableCell>{test.hb} g/dL</TableCell>
                                        <TableCell>{test.glucose} mg/dL</TableCell>
                                        <TableCell>{test.crp} mg/L</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>Hb: {referenceRanges.hb}</span>
                                                <span>Glu: {referenceRanges.glucose}</span>
                                                <span>CRP: {referenceRanges.crp}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                test.status === 'Normal' ? 'secondary' : test.status === 'At Risk' ? 'default' : 'destructive'
                                                }
                                                className={`
                                                    ${test.status === 'Normal' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}
                                                    ${test.status === 'At Risk' && 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'}
                                                    ${test.status === 'Needs Attention' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}
                                                `}>
                                                <span className={`mr-2 h-2 w-2 rounded-full ${statusStyles[test.status as BiomarkerStatus]}`}></span>
                                                {test.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}

    
