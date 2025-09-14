
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssessmentResult } from "@/lib/types";
import { Printer } from "lucide-react";
import Link from "next/link";
import Logo from "../logo";
import { assessmentData } from "@/lib/assessments";
import { useLocale } from "@/context/locale-provider";

type ReportPageProps = {
    studentName: string;
    date: Date;
    completedAssessments: AssessmentResult[];
}

export function ReportPage({ studentName, date, completedAssessments }: ReportPageProps) {
    const { t } = useLocale();
    
    const handlePrint = () => {
        window.print();
    }

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 print:hidden">
                <p className="text-muted-foreground">{t.reportSaveAsPdf}</p>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2" />
                        {t.printOrSave}
                    </Button>
                     <Button asChild>
                        <Link href="/student/dashboard">{t.backToDashboard}</Link>
                    </Button>
                </div>
            </div>
            <Card id="report-content" className="p-4 sm:p-8 print:shadow-none print:border-none">
                <CardHeader className="text-center space-y-4">
                    <Logo className="justify-center" />
                    <CardTitle className="text-2xl">{t.consolidatedReport}</CardTitle>
                    <CardDescription>
                        {t.consolidatedReportDesc}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="grid grid-cols-2">
                           <strong className="text-muted-foreground">{t.studentName}:</strong>
                           <p>{studentName}</p>
                        </div>
                         <div className="grid grid-cols-2">
                           <strong className="text-muted-foreground">{t.dateOfReport}:</strong>
                           <p>{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                     <Separator />

                    {completedAssessments.map(result => {
                         const assessmentDetails = assessmentData[result.id];
                         if(!assessmentDetails) return null;

                         return (
                            <div key={result.id} className="space-y-4 rounded-lg border bg-card p-6 break-inside-avoid">
                                <h3 className="font-bold text-lg text-center">{result.name}</h3>
                                <div className="flex flex-col sm:flex-row justify-around items-center text-center gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t.totalScore}</p>
                                        <p className="text-4xl font-bold">{result.score}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t.interpretation}</p>
                                        <p className="text-xl font-semibold text-primary">{result.interpretation}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-bold text-base mb-4">{t.responses}</h4>
                                    <div className="space-y-4">
                                        {assessmentDetails.questions.map((q, index) => {
                                            const answerValue = result.answers.find(a => a.questionIndex === index)?.value;
                                            const answerText = assessmentDetails.options.find(o => o.value === answerValue)?.text;
                                            return (
                                                <div key={index} className="text-sm p-3 rounded-md bg-muted/50">
                                                    <p className="font-medium">{index + 1}. {q.text}</p>
                                                    <p className="text-muted-foreground pl-4 pt-1">{t.answer}: <span className="font-semibold text-foreground">{answerText || t.notAnswered}</span></p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                         )
                    })}
                     
                </CardContent>
                 <CardFooter className="text-center text-xs text-muted-foreground pt-6">
                    <p>{t.reportDisclaimer}</p>
                 </CardFooter>
            </Card>
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print-hidden {
                        display: none;
                    }
                    #report-content {
                        box-shadow: none;
                        border: none;
                    }
                    main {
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    )
}
