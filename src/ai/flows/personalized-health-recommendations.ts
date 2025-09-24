// src/ai/flows/personalized-health-recommendations.ts
'use server';

/**
 * @fileOverview Generates personalized health recommendations based on user data and test results.
 *
 * - generateHealthRecommendations - A function that generates personalized health recommendations.
 * - HealthRecommendationsInput - The input type for the generateHealthRecommendations function.
 * - HealthRecommendationsOutput - The return type for the generateHealthRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  heightCm: z.number().describe('The height of the user in centimeters.'),
  weightKg: z.number().describe('The weight of the user in kilograms.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('The gender of the user.'),
  familyHistory: z.array(z.string()).describe('List of inherited diseases in the family history.'),
  regularMedications: z.string().describe('Regular medications the user is taking.'),
  durationOfPeriods: z.number().optional().describe('Duration of periods in days for female users.'),
  severityOfPeriods: z.enum(['Light', 'Moderate', 'Heavy']).optional().describe('Severity of periods for female users.'),
  irregularCyclesOrSpotting: z.boolean().optional().describe('Whether the user experiences irregular cycles or spotting.'),
  dietaryPreferences: z.enum(['Vegetarian', 'Non-vegetarian']).describe('Dietary preferences of the user.'),
  supplementUse: z.array(z.string()).describe('Supplements the user is taking (iron, vitamin B12, folic acid).'),
  fatigueLevel: z.number().min(1).max(10).describe('Fatigue level on a scale of 1 to 10.'),
  dizzinessLevel: z.number().min(1).max(10).describe('Dizziness level on a scale of 1 to 10.'),
  paleSkinOrNails: z.number().min(1).max(10).describe('Pale skin or nails level on a scale of 1 to 10.'),
  shortnessOfBreath: z.number().min(1).max(10).describe('Shortness of breath level on a scale of 1 to 10.'),
  hemoglobin: z.number().describe('Hemoglobin level of the user.'),
  glucose: z.number().describe('Glucose level of the user.'),
  crp: z.number().describe('CRP level of the user.'),
});
export type HealthRecommendationsInput = z.infer<typeof HealthRecommendationsInputSchema>;

const HealthRecommendationsOutputSchema = z.object({
  dietAdvice: z.string().describe('Personalized diet advice based on the user data and test results.'),
  exerciseRoutine: z.string().describe('Customized exercise routine suggestions based on the user profile.'),
  lifestyleTips: z.string().describe('General lifestyle tips for improving health.'),
});
export type HealthRecommendationsOutput = z.infer<typeof HealthRecommendationsOutputSchema>;

export async function generateHealthRecommendations(
  input: HealthRecommendationsInput
): Promise<HealthRecommendationsOutput> {
  return generateHealthRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthRecommendationsPrompt',
  input: {schema: HealthRecommendationsInputSchema},
  output: {schema: HealthRecommendationsOutputSchema},
  prompt: `You are an AI health assistant that provides personalized health recommendations.

  Based on the user's health data and test results, provide personalized diet advice, a customized exercise routine, and general lifestyle tips.

  User Health Data:
  - Age: {{{age}}}
  - Height (cm): {{{heightCm}}}
  - Weight (kg): {{{weightKg}}}
  - Gender: {{{gender}}}
  - Family History: {{#each familyHistory}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Regular Medications: {{{regularMedications}}}
  {{#if durationOfPeriods}}
  - Duration of Periods (days): {{{durationOfPeriods}}}
  {{/if}}
  {{#if severityOfPeriods}}
  - Severity of Periods: {{{severityOfPeriods}}}
  {{/if}}
  {{#if irregularCyclesOrSpotting}}
  - Irregular Cycles or Spotting: {{{irregularCyclesOrSpotting}}}
  {{/if}}
  - Dietary Preferences: {{{dietaryPreferences}}}
  - Supplement Use: {{#each supplementUse}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Fatigue Level (1-10): {{{fatigueLevel}}}
  - Dizziness Level (1-10): {{{dizzinessLevel}}}
  - Pale Skin or Nails (1-10): {{{paleSkinOrNails}}}
  - Shortness of Breath (1-10): {{{shortnessOfBreath}}}

  Test Results:
  - Hemoglobin: {{{hemoglobin}}}
  - Glucose: {{{glucose}}}
  - CRP: {{{crp}}}

  Provide the recommendations in a concise and easy-to-understand manner.

  Output:
  Diet Advice: ...
  Exercise Routine: ...
  Lifestyle Tips: ...`,
});

const generateHealthRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateHealthRecommendationsFlow',
    inputSchema: HealthRecommendationsInputSchema,
    outputSchema: HealthRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
