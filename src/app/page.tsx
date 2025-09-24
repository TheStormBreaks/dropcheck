'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAppContext } from '@/context/app-context';


const supplementOptions = [
  { id: 'iron', label: 'Iron' },
  { id: 'vitamin-b12', label: 'Vitamin B12' },
  { id: 'folic-acid', label: 'Folic Acid' },
];

const formSchema = z.object({
  age: z.coerce.number().min(1, 'Age is required').max(120),
  height: z.coerce.number().min(1, 'Height is required'),
  heightUnit: z.enum(['cm', 'in']).default('cm'),
  weight: z.coerce.number().min(1, 'Weight is required'),
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  familyHistory: z.boolean().default(false),
  familyHistoryDetails: z.string().optional(),
  regularMedications: z.string().optional(),
  durationOfPeriods: z.coerce.number().optional(),
  severityOfPeriods: z.enum(['Light', 'Moderate', 'Heavy']).optional(),
  irregularCyclesOrSpotting: z.boolean().default(false),
  dietaryPreferences: z.enum(['Vegetarian', 'Non-vegetarian'], { required_error: 'Dietary preference is required' }),
  supplementUse: z.array(z.string()).default([]),
  fatigueLevel: z.number().min(1).max(10).default(5),
  dizzinessLevel: z.number().min(1).max(10).default(5),
  paleSkinOrNails: z.number().min(1).max(10).default(5),
  shortnessOfBreath: z.number().min(1).max(10).default(5),
  polyuria: z.number().min(1).max(10).default(1), // Frequent urination
  polydipsia: z.number().min(1).max(10).default(1), // Frequent thirst
  polyphagia: z.number().min(1).max(10).default(1), // Frequent hunger
  medicalHistory: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function RegistrationPage() {
  const router = useRouter();
  const { setUserProfile } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      height: 170,
      heightUnit: 'cm',
      weight: 65,
      weightUnit: 'kg',
      gender: undefined,
      familyHistory: false,
      familyHistoryDetails: '',
      regularMedications: '',
      irregularCyclesOrSpotting: false,
      dietaryPreferences: undefined,
      supplementUse: [],
      fatigueLevel: 5,
      dizzinessLevel: 5,
      paleSkinOrNails: 5,
      shortnessOfBreath: 5,
      polyuria: 1,
      polydipsia: 1,
      polyphagia: 1,
      medicalHistory: '',
    },
  });

  const watchGender = form.watch('gender');
  const watchFamilyHistory = form.watch('familyHistory');

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    console.log(values);
    
    // Convert height to cm and weight to kg if necessary
    const heightInCm = values.heightUnit === 'in' ? values.height * 2.54 : values.height;
    const weightInKg = values.weightUnit === 'lbs' ? values.weight * 0.453592 : values.weight;

    const profileData = {
      ...values,
      height: heightInCm,
      weight: weightInKg,
    };

    setUserProfile(profileData);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-4 h-12 w-12 text-primary" />
          <h1 className="font-headline text-4xl font-bold text-foreground">Welcome to DropCheck</h1>
          <p className="mt-2 text-lg text-muted-foreground">Create your health profile to get started.</p>
        </header>

        <Card className="shadow-2xl shadow-primary/5">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                {/* Personal Details */}
                <section>
                  <h2 className="font-headline text-2xl font-semibold">Personal Details</h2>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter your age" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="Male" /></FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="Female" /></FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="Other" /></FormControl>
                                <FormLabel className="font-normal">Other</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Height</FormLabel>
                           <div className="flex items-center gap-2">
                            <FormControl>
                              <Input type="number" placeholder="e.g. 170" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormField
                              control={form.control}
                              name="heightUnit"
                              render={({ field: unitField }) => (
                                <div className="flex items-center space-x-2">
                                  <span>cm</span>
                                  <Switch checked={unitField.value === 'in'} onCheckedChange={(checked) => unitField.onChange(checked ? 'in' : 'cm')} />
                                  <span>in</span>
                                </div>
                              )}
                            />
                           </div>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Weight</FormLabel>
                           <div className="flex items-center gap-2">
                            <FormControl>
                              <Input type="number" placeholder="e.g. 65" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormField
                              control={form.control}
                              name="weightUnit"
                              render={({ field: unitField }) => (
                                <div className="flex items-center space-x-2">
                                  <span>kg</span>
                                  <Switch checked={unitField.value === 'lbs'} onCheckedChange={(checked) => unitField.onChange(checked ? 'lbs' : 'kg')} />
                                  <span>lbs</span>
                                </div>
                              )}
                            />
                           </div>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
                
                {/* Health Status */}
                <section>
                  <h2 className="font-headline text-2xl font-semibold">Health & Lifestyle</h2>
                  <Separator className="my-4" />
                  <div className="space-y-8">
                     {watchGender === 'Female' && (
                        <div className="grid grid-cols-1 gap-8 rounded-lg border bg-secondary/50 p-6 md:grid-cols-2">
                          <h3 className="font-headline text-lg font-medium md:col-span-2">For Women</h3>
                           <FormField
                            control={form.control}
                            name="durationOfPeriods"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration of Periods (days)</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g. 5" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="severityOfPeriods"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Severity of Periods</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Light">Light</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Heavy">Heavy</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="irregularCyclesOrSpotting"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                                <div className="space-y-0.5">
                                  <FormLabel>Irregular Cycles or Spotting</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                     )}
                     <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="dietaryPreferences"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Dietary Preferences</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="Vegetarian" /></FormControl>
                                        <FormLabel className="font-normal">Vegetarian</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl><RadioGroupItem value="Non-vegetarian" /></FormControl>
                                        <FormLabel className="font-normal">Non-vegetarian</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="supplementUse"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Supplement Use</FormLabel>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {supplementOptions.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="supplementUse"
                                            render={({ field }) => {
                                            return (
                                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                    checked={field.value?.includes(item.label)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), item.label])
                                                        : field.onChange(field.value?.filter((value) => value !== item.label));
                                                    }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                </FormItem>
                                            );
                                            }}
                                        />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="regularMedications"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Regular Medications</FormLabel>
                                <FormControl><Textarea placeholder="List any regular medications you take..." {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                          control={form.control}
                          name="familyHistory"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                              <div className="space-y-0.5">
                                <FormLabel>Family history of inherited diseases?</FormLabel>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {watchFamilyHistory && (
                            <FormField
                                control={form.control}
                                name="familyHistoryDetails"
                                render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Please specify family history</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., Diabetes, Heart Disease..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="medicalHistory"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Other Medical History</FormLabel>
                                <FormControl><Textarea placeholder="Mention any other relevant history, like major blood loss or chronic diseases..." {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                  </div>
                </section>

                {/* Symptoms */}
                <section>
                  <h2 className="font-headline text-2xl font-semibold">Symptoms Checklist</h2>
                  <p className="text-muted-foreground">Rate the following symptoms on a scale of 1 (none) to 10 (severe).</p>
                  <Separator className="my-4" />
                  <div className="space-y-8">
                    <FormField control={form.control} name="fatigueLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fatigue: {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="dizzinessLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dizziness: {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="paleSkinOrNails" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pale Skin/Nails: {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="shortnessOfBreath" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shortness of Breath: {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <Separator />
                    <FormField control={form.control} name="polydipsia" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frequent Thirst (Polydipsia): {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="polyuria" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frequent Urination (Polyuria): {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="polyphagia" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frequent Hunger (Polyphagia): {field.value}</FormLabel>
                            <FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                        </FormItem>
                    )} />
                  </div>
                </section>

                <div className="flex justify-end pt-8">
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Saving Profile...' : 'Save and Proceed'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DropCheck Companion. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
