'use client'

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Share2, Mail, CheckCircle, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/app-context';
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

export default function ReportsPage() {
    const { testHistory, removeTestResult } = useAppContext();

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
    
    return (
        <AppShell title="Reports">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Test History Reports</CardTitle>
                            <CardDescription>Download or share your past health reports.</CardDescription>
                        </CardHeader>
                        <CardContent id="test-history-table">
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
                                            <TableCell className="text-right">
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
