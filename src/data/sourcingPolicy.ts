export const sourcingPolicy = {
  version: '2026-09-10',
  factors: [
    { id: 'authority', label: 'Authority for the claim', weight: 30, question: 'Is this the responsible institution or a strong original evidence source?' },
    { id: 'relevance', label: 'Audience relevance', weight: 30, question: 'Does it matter to the regulators, boards and executives we serve?' },
    { id: 'impact', label: 'Decision impact', weight: 25, question: 'Could it change a question, assessment or action?' },
    { id: 'contribution', label: 'Distinct contribution', weight: 15, question: 'Does it add something substantive to existing coverage?' },
  ],
} as const
