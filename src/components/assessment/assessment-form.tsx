
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Assessment, Answer } from '@/lib/types';
import { useApp } from '@/context/app-provider';
import { useRouter } from 'next/navigation';

type AssessmentFormProps = {
  assessment: Assessment;
};

export function AssessmentForm({ assessment }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { addAssessmentResult } = useApp();
  const router = useRouter();


  // Dynamically create a Zod schema based on the number of questions
  const schema = z.object(
    Object.fromEntries(
      assessment.questions.map((_, index) => [
        `q${index}`,
        z.string({ required_error: 'Please select an option.' }),
      ])
    )
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const totalSteps = assessment.questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    const fieldName = `q${currentStep}` as const;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    let totalScore = 0;
    const submittedAnswers: Answer[] = [];

    for (let i = 0; i < totalSteps; i++) {
        const answerValue = parseInt(data[`q${i}` as keyof typeof data]);
        totalScore += answerValue;
        submittedAnswers.push({ questionIndex: i, value: answerValue });
    }

    const resultInterpretation =
      assessment.interpretation.find(interp => totalScore >= interp.minScore)?.text || 'N/A';
    
    addAssessmentResult({
        id: assessment.id,
        name: assessment.name,
        score: totalScore,
        interpretation: resultInterpretation,
        answers: submittedAnswers,
        date: new Date().toISOString()
    });

    // Redirect to dashboard after completion
    router.push('/student/dashboard');
  };

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Question {currentStep + 1} of {totalSteps}</CardTitle>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name={`q${currentStep}`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-semibold">
                    {assessment.questions[currentStep].text}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {assessment.options.map((option, index) => (
                        <FormItem
                          key={index}
                          className="flex items-center space-x-3 space-y-0 p-3 rounded-md border border-transparent has-[:checked]:border-primary has-[:checked]:bg-accent"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.value.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer w-full">
                            {option.text}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              {currentStep === totalSteps - 1 ? 'Finish Assessment' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
