'use server';

/**
 * @fileOverview Generates initial pricing rules based on a product description.
 *
 * - generateInitialPricingRules - A function that generates initial pricing rules.
 * - GenerateInitialPricingRulesInput - The input type for the generateInitialPricingRules function.
 * - GenerateInitialPricingRulesOutput - The return type for the generateInitialPricingRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPricingRulesInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product, including its features, benefits, target audience, and current market price.'),
});
export type GenerateInitialPricingRulesInput = z.infer<typeof GenerateInitialPricingRulesInputSchema>;

const GenerateInitialPricingRulesOutputSchema = z.object({
  pricingRules: z
    .string()
    .describe('A JSON string containing an array of pricing rules, each with a condition and an action.'),
});
export type GenerateInitialPricingRulesOutput = z.infer<typeof GenerateInitialPricingRulesOutputSchema>;

export async function generateInitialPricingRules(
  input: GenerateInitialPricingRulesInput
): Promise<GenerateInitialPricingRulesOutput> {
  return generateInitialPricingRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPricingRulesPrompt',
  input: {schema: GenerateInitialPricingRulesInputSchema},
  output: {schema: GenerateInitialPricingRulesOutputSchema},
  prompt: `You are an expert in pricing strategy for e-commerce products.

  Based on the following product description, generate a set of initial pricing rules that can be used to dynamically adjust the price of the product. The pricing rules should consider factors such as cost, competitor prices, demand, and inventory levels.  The rules should also respect typical e-commerce pricing strategies.

  Product Description: {{{productDescription}}}

  Return the result as a JSON string. The JSON should be an array of pricing rule objects, where each object has a "condition" field and an "action" field.  The condition field should be a string that describes the condition under which the rule should be applied.  The action field should be a string that describes the action to be taken when the rule is applied.

  For example:

  [
    {
      "condition": "inventory < 10",
      "action": "increase price by 10%"
    },
    {
      "condition": "competitor_price < current_price * 0.9",
      "action": "lower price to match competitor"
    }
  ]
  `,
});

const generateInitialPricingRulesFlow = ai.defineFlow(
  {
    name: 'generateInitialPricingRulesFlow',
    inputSchema: GenerateInitialPricingRulesInputSchema,
    outputSchema: GenerateInitialPricingRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
