'use server';

/**
 * @fileOverview Classifies if a product is an essential good.
 *
 * - classifyEssentialGood - A function that classifies a product.
 * - ClassifyEssentialGoodInput - The input type for the classifyEssentialGood function.
 * - ClassifyEssentialGoodOutput - The return type for the classifyEssentialGood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyEssentialGoodInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z
    .string()
    .describe('A detailed description of the product.'),
});
export type ClassifyEssentialGoodInput = z.infer<typeof ClassifyEssentialGoodInputSchema>;

const ClassifyEssentialGoodOutputSchema = z.object({
  isEssential: z.boolean().describe('Whether the product is considered an essential good (e.g., life-saving items like medicine, baby formula, staple food).'),
});
export type ClassifyEssentialGoodOutput = z.infer<typeof ClassifyEssentialGoodOutputSchema>;

export async function classifyEssentialGood(
  input: ClassifyEssentialGoodInput
): Promise<ClassifyEssentialGoodOutput> {
  return classifyEssentialGoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyEssentialGoodPrompt',
  input: {schema: ClassifyEssentialGoodInputSchema},
  output: {schema: ClassifyEssentialGoodOutputSchema},
  prompt: `You are an AI classifier for an e-commerce platform. Your task is to identify "essential goods."
  Essential goods are items critical for life and well-being, especially during a crisis.
  Examples include: medicine, baby formula, staple foods (rice, bread, water), and basic sanitary products.
  Examples of non-essential goods: electronics, luxury items, entertainment, fashion apparel.

  Analyze the product name and description to determine if it is an essential good.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  `,
});

const classifyEssentialGoodFlow = ai.defineFlow(
  {
    name: 'classifyEssentialGoodFlow',
    inputSchema: ClassifyEssentialGoodInputSchema,
    outputSchema: ClassifyEssentialGoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
