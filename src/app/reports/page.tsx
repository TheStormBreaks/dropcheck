import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Share2, Mail, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const pastReports = [
    { date: 'October 2023 Summary', type: 'Monthly', sharedWith: 'dr.smith@clinic.com' },
    { date: 'Test on 2023-10-26', type: 'Single Test', sharedWith: null },
    { date: 'September 2023 Summary', type: 'Monthly', sharedWith: 'dr.smith@clinic.com' },
    { date: 'Test on 2023-09-18', type: 'Single Test', sharedWith: null },
];

export default function ReportsPage() {
    return (
        <AppShell title="Reports">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Reports</CardTitle>
                            <CardDescription>Download or share your past health reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Shared With</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pastReports.map((report) => (
                                        <TableRow key={report.date}>
                                            <TableCell className="font-medium">{report.date}</TableCell>
                                            <TableCell>{report.type}</TableCell>
                                            <TableCell>
                                                {report.sharedWith ? (
                                                    <Badge variant="secondary" className="flex w-fit items-center gap-1">
                                                        <CheckCircle className="h-3 w-3 text-green-500" /> {report.sharedWith}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">Not shared</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <FileDown className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
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
                            <CardTitle>Download Reports</CardTitle>
                            <CardDescription>Generate and download a new report.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                           <Button className="w-full">
                               <FileDown className="mr-2 h-4 w-4" />
                               Download as PDF
                           </Button>
                           <Button variant="secondary" className="w-full">
                               <FileDown className="mr-2 h-4 w-4" />
                               Download as CSV
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
                               Share Report
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
