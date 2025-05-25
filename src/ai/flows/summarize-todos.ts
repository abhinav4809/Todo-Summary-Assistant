'use server';

/**
 * @fileOverview Summarizes a list of to-do items using GenAI.
 *
 * - summarizeTodos - A function that summarizes the to-do list.
 * - SummarizeTodosInput - The input type for the summarizeTodos function.
 * - SummarizeTodosOutput - The return type for the summarizeTodos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTodosInputSchema = z.object({
  todos: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      completed: z.boolean(),
    })
  ).describe('An array of to-do items.'),
});
export type SummarizeTodosInput = z.infer<typeof SummarizeTodosInputSchema>;

const SummarizeTodosOutputSchema = z.object({
  summary: z.string().describe('A summary of the pending to-do items.'),
});
export type SummarizeTodosOutput = z.infer<typeof SummarizeTodosOutputSchema>;

export async function summarizeTodos(input: SummarizeTodosInput): Promise<SummarizeTodosOutput> {
  return summarizeTodosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTodosPrompt',
  input: {schema: SummarizeTodosInputSchema},
  output: {schema: SummarizeTodosOutputSchema},
  prompt: `You are a personal assistant tasked with summarizing a user's to-do list.\n\nHere is the to-do list:\n\n{{#each todos}}\n- {{description}} (Completed: {{completed}})\n{{/each}}\n\nPlease provide a concise summary of the pending to-do items. Focus on what the user still needs to do.\n`,
});

const summarizeTodosFlow = ai.defineFlow(
  {
    name: 'summarizeTodosFlow',
    inputSchema: SummarizeTodosInputSchema,
    outputSchema: SummarizeTodosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
