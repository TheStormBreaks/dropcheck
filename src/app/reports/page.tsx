
'use client'

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Share2, Mail, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppContext, TestResult } from '@/context/app-context';
import Link from 'next/link';
import { downloadPdf } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, { useState, useRef } from 'react';
import { Logo } from '@/components/logo';

const PrintableReport = React.forwardRef<HTMLDivElement, { report: TestResult | null }>(({ report }, ref) => {
    if (!report) return null;

    return (
        <div ref={ref} className="p-8 bg-white text-black">
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">DropCheck Report</span>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-600">Report ID: {report.id}</p>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Biomarker Results</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gray-100">
                    <div className="font-semibold">Biomarker</div>
                    <div className="font-semibold text-center">Result</div>
                    <div className="font-semibold text-right">Reference Range</div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 items-center">
                    <div>Hemoglobin</div>
                    <div className="text-center font-bold text-lg">{report.hemoglobin} g/dL</div>
                    <div className="text-right text-gray-600">12.0 - 15.5 g/dL</div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 items-center bg-gray-50 rounded-lg">
                    <div>Glucose</div>
                    <div className="text-center font-bold text-lg">{report.glucose} mg/dL</div>
                    <div className="text-right text-gray-600">70 - 99 mg/dL</div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4 items-center">
                    <div>CRP (C-Reactive Protein)</div>
                    <div className="text-center font-bold text-lg">{report.crp} mg/L</div>
                    <div className="text-right text-gray-600">{'<'} 3.0 mg/L</div>
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-500">
                <p>This report is for informational purposes only and is not a substitute for professional medical advice.</p>
                <p>© {new Date().getFullYear()} DropCheck Companion. All rights reserved.</p>
            </div>
        </div>
    );
});
PrintableReport.displayName = 'PrintableReport';


export default function ReportsPage() {
    const { testHistory, removeTestResult } = useAppContext();
    const [selectedReport, setSelectedReport] = useState<TestResult | null>(null);
    const printableRef = useRef<HTMLDivElement>(null);

    if (testHistory.length === 0) {
        return (
            <AppShell title="Reports">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Reports Available</h2>
                    <p className="text-muted-foreground mb-4">You haven't performed any tests yet. Reports will be generated here.</p>
                    <Link href="/connect-device" passHref>
                        <Button>Start a New Test</Button>
                    </Link>
                 </div>
            </AppShell>
        );
    }
    
    const handleDownloadCsv = () => {
        const headers = ["date", "hemoglobin_g_dL", "glucose_mg_dL", "crp_mg_L"];
        const csvRows = [
            headers.join(','),
            ...testHistory.map(row => `${row.date},${row.hemoglobin},${row.glucose},${row.crp}`)
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dropcheck_report_history.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    const handleDownloadSinglePdf = async (report: TestResult) => {
        setSelectedReport(report);
        // Wait for state to update and component to render
        setTimeout(async () => {
             if (printableRef.current) {
                // The element is passed directly to the utility
                await downloadPdf(printableRef.current, `DropCheck_Test_${report.date}.pdf`);
                setSelectedReport(null); // Clean up
             }
        }, 100);
    }
    
    return (
        <AppShell title="Reports">
            {/* Hidden component for printing */}
            <div className="absolute -left-full">
                <PrintableReport ref={printableRef} report={selectedReport} />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Test History Reports</CardTitle>
                            <CardDescription>Download or share your past health reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div id="test-history-table">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Report Date</TableHead>
                                            <TableHead>Hemoglobin</TableHead>
                                            <TableHead>Glucose</TableHead>
                                            <TableHead>CRP</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testHistory.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">{new Date(report.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{report.hemoglobin} g/dL</TableCell>
                                                <TableCell>{report.glucose} mg/dL</TableCell>
                                                <TableCell>{report.crp} mg/L</TableCell>
                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDownloadSinglePdf(report)}>
                                                        <FileDown className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete this test result.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => removeTestResult(report.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Download Full History</CardTitle>
                            <CardDescription>Get a complete record of all your tests.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                           <Button variant="secondary" className="w-full" onClick={handleDownloadCsv}>
                               <FileDown className="mr-2 h-4 w-4" />
                               Download as CSV
                           </Button>
                           <Button variant="secondary" className="w-full" onClick={() => downloadPdf('test-history-table', 'DropCheck_Test_History.pdf')}>
                               <FileDown className="mr-2 h-4 w-4" />
                               Download as PDF
                           </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Share via Email</CardTitle>
                            <CardDescription>Send your latest report to a healthcare provider.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="relative">
                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input type="email" placeholder="doctor@example.com" className="pl-10" />
                           </div>
                           <Button className="w-full">
                               <Share2 className="mr-2 h-4 w-4" />
                               Share Latest Report
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
