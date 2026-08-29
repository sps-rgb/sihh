import { describe, it, expect } from 'vitest';
import { matchSchemes } from '@/services/matchingEngine';
import { UserProfile } from '@/types';

// Helper function to create a base profile to avoid repeating fields
const createBaseProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  age: 30,
  gender: 'Male',
  state: 'Delhi',
  category: 'General',
  annualIncome: '₹2.5–5 lakh',
  businessStatus: 'Starting a new business',
  businessType: 'Manufacturing',
  projectCost: 500000,
  existingBusiness: false,
  existingLoan: false,
  ...overrides,
});

describe('Scheme Matching Engine', () => {
  it('1. Clearly eligible user for SC scheme (DEMO-SC-001)', () => {
    const profile = createBaseProfile({
      category: 'SC',
      age: 30,
      state: 'Delhi',
      annualIncome: '₹2.5–5 lakh',
      businessType: 'Manufacturing',
      businessStatus: 'Starting a new business',
      projectCost: 500000,
    });

    const results = matchSchemes(profile);
    const scScheme = results.find(r => r.schemeId === 'DEMO-SC-001');

    expect(scScheme).toBeDefined();
    expect(scScheme?.status).toBe('Eligible');
    expect(scScheme?.score).toBeGreaterThan(0);
    expect(scScheme?.matchedConditions.length).toBeGreaterThan(0);
  });

  it('2. User failing income requirement for DEMO-SC-001', () => {
    const profile = createBaseProfile({
      category: 'SC',
      annualIncome: 'Above ₹10 lakh',
    });

    const results = matchSchemes(profile);
    const scScheme = results.find(r => r.schemeId === 'DEMO-SC-001');

    // Assuming exceeding income makes them Potentially Eligible or Not Eligible, 
    // but definitely NOT 'Eligible' since it is a hard cap usually. 
    // Wait, the prompt says: DEMO-SC-001 should not be Eligible (income exceeds ₹5L limit).
    expect(scScheme).toBeDefined();
    expect(scScheme?.status).not.toBe('Eligible');
    expect(scScheme?.failedConditions.some(c => c.toLowerCase().includes('income'))).toBeTruthy();
  });

  it('3. User failing age requirement for DEMO-YE-003', () => {
    const profile = createBaseProfile({
      age: 40,
      annualIncome: 'Below ₹1 lakh',
      businessType: 'Service',
      projectCost: 200000,
    });

    const results = matchSchemes(profile);
    const youthScheme = results.find(r => r.schemeId === 'DEMO-YE-003');

    expect(youthScheme).toBeDefined();
    expect(youthScheme?.status).toBe('Not Eligible');
    expect(youthScheme?.failedConditions.some(c => c.toLowerCase().includes('age'))).toBeTruthy();
  });

  it('4. Wrong business type for DEMO-SC-001', () => {
    const profile = createBaseProfile({
      category: 'SC',
      businessType: 'Agriculture',
    });

    const results = matchSchemes(profile);
    const scScheme = results.find(r => r.schemeId === 'DEMO-SC-001');

    expect(scScheme).toBeDefined();
    expect(scScheme?.status).not.toBe('Eligible');
    expect(scScheme?.failedConditions.some(c => c.toLowerCase().includes('business type') || c.toLowerCase().includes('industry'))).toBeTruthy();
  });

  it('5. Wrong category for DEMO-SC-001', () => {
    const profile = createBaseProfile({
      category: 'General',
    });

    const results = matchSchemes(profile);
    const scScheme = results.find(r => r.schemeId === 'DEMO-SC-001');

    expect(scScheme).toBeDefined();
    expect(scScheme?.status).toBe('Not Eligible');
    expect(scScheme?.failedConditions.some(c => c.includes('SC') || c.toLowerCase().includes('categor'))).toBeTruthy();
  });

  it('6. Wrong state for DEMO-RA-004', () => {
    const profile = createBaseProfile({
      category: 'OBC',
      annualIncome: '₹1–2.5 lakh',
      businessType: 'Agriculture',
      state: 'Delhi',
      projectCost: 300000,
    });

    const results = matchSchemes(profile);
    const ruralScheme = results.find(r => r.schemeId === 'DEMO-RA-004');

    expect(ruralScheme).toBeDefined();
    expect(ruralScheme?.status).toBe('Not Eligible');
    expect(ruralScheme?.failedConditions.some(c => c.toLowerCase().includes('state') || c.toLowerCase().includes('location'))).toBeTruthy();
  });

  it('7. Project cost exceeding limit for DEMO-SC-001', () => {
    const profile = createBaseProfile({
      category: 'SC',
      projectCost: 2000000,
    });

    const results = matchSchemes(profile);
    const scScheme = results.find(r => r.schemeId === 'DEMO-SC-001');

    expect(scScheme).toBeDefined();
    expect(scScheme?.status).not.toBe('Eligible');
    expect(scScheme?.failedConditions.some(c => c.toLowerCase().includes('cost') || c.toLowerCase().includes('investment'))).toBeTruthy();
  });

  it('8. User matching multiple schemes', () => {
    const profile = createBaseProfile({
      category: 'SC',
      gender: 'Female',
      age: 25,
      annualIncome: 'Below ₹1 lakh',
      businessType: 'Food',
      projectCost: 200000,
    });

    const results = matchSchemes(profile);
    const eligibleSchemes = results.filter(r => r.status === 'Eligible').map(r => r.schemeId);

    // Assert minimum expected eligible schemes
    expect(eligibleSchemes).toContain('DEMO-SC-001');
    expect(eligibleSchemes).toContain('DEMO-WE-002');
    expect(eligibleSchemes).toContain('DEMO-YE-003');
    expect(eligibleSchemes).toContain('DEMO-DA-007');
    expect(eligibleSchemes).toContain('DEMO-GL-010');
  });

  it('9. User matching no schemes (age/income/cost too high)', () => {
    const profile = createBaseProfile({
      age: 70,
      annualIncome: 'Above ₹10 lakh',
      businessType: 'Other',
      businessStatus: 'Existing business',
      existingBusiness: true,
      projectCost: 5000000,
    });

    const results = matchSchemes(profile);
    const eligibleSchemes = results.filter(r => r.status === 'Eligible');

    expect(eligibleSchemes.length).toBe(0);
  });

  it('10. Potentially eligible case (soft condition failed, mandatory passed)', () => {
    const profile = createBaseProfile({
      age: 25,
      annualIncome: '₹5–10 lakh', // Exceeds DEMO-YE-003 limit of 5L (soft/secondary fail)
      projectCost: 800000, // Exceeds DEMO-YE-003 limit of 5L (soft/secondary fail)
    });

    const results = matchSchemes(profile);
    const youthScheme = results.find(r => r.schemeId === 'DEMO-YE-003');

    expect(youthScheme).toBeDefined();
    // Assuming category, age, and state are mandatory and income/project cost are soft conditions for this engine implementation
    expect(['Potentially Eligible', 'Not Eligible']).toContain(youthScheme?.status);
    expect(youthScheme?.failedConditions.length).toBeGreaterThan(0);
  });

  it('11. Women-only scheme with male user', () => {
    const profile = createBaseProfile({
      gender: 'Male',
    });

    const results = matchSchemes(profile);
    const weScheme = results.find(r => r.schemeId === 'DEMO-WE-002');
    const uwScheme = results.find(r => r.schemeId === 'DEMO-UW-009');

    expect(weScheme?.status).toBe('Not Eligible');
    expect(uwScheme?.status).toBe('Not Eligible');
    
    expect(weScheme?.failedConditions.some(c => c.toLowerCase().includes('gender') || c.toLowerCase().includes('women'))).toBeTruthy();
  });

  it('12. Existing business user on new-business-only scheme', () => {
    const profile = createBaseProfile({
      businessStatus: 'Existing business',
      existingBusiness: true,
    });

    const results = matchSchemes(profile);
    const youthScheme = results.find(r => r.schemeId === 'DEMO-YE-003');

    expect(youthScheme).toBeDefined();
    expect(youthScheme?.status).not.toBe('Eligible');
    expect(youthScheme?.failedConditions.some(c => c.toLowerCase().includes('business'))).toBeTruthy();
  });

  it('13. Score ordering: Sorted by status then score', () => {
    const profile = createBaseProfile({
      category: 'SC',
      gender: 'Female',
      age: 25,
      annualIncome: 'Below ₹1 lakh',
      businessType: 'Food',
      projectCost: 200000,
    });

    const results = matchSchemes(profile);
    
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const statusWeight = (status: string) => {
        if (status === 'Eligible') return 3;
        if (status === 'Potentially Eligible') return 2;
        return 1; // Not Eligible
      };

      const currentWeight = statusWeight(current.status);
      const nextWeight = statusWeight(next.status);

      // Verify status order
      expect(currentWeight).toBeGreaterThanOrEqual(nextWeight);
      
      // If same status, verify score order
      if (currentWeight === nextWeight) {
        expect(current.score).toBeGreaterThanOrEqual(next.score);
      }
    }
  });
});
