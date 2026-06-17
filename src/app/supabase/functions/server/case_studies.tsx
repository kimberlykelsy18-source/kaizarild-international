import { Context } from 'npm:hono';
import * as kv from './kv_store.tsx';

const CASE_STUDIES_PREFIX = 'case_studies_420cbc7d:';

export interface CaseStudyOutcome {
  metric: string;
  description: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  role: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  participants?: string;
  program: string;
  challenge: string;
  challengeDetails: string;
  solution: string;
  solutionDetails: string;
  outcomes: CaseStudyOutcome[];
  impact: string;
  testimonial: CaseStudyTestimonial;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all case studies
export async function getAllCaseStudies(c: Context) {
  try {
    const caseStudies = await kv.getByPrefix(CASE_STUDIES_PREFIX);
    // getByPrefix returns an array of values directly, not { value: ... } objects
    const sortedCaseStudies = caseStudies
      .filter((cs: any) => cs != null) // Filter out any null/undefined values
      .sort((a: CaseStudy, b: CaseStudy) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(sortedCaseStudies);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return c.json({ error: 'Failed to fetch case studies' }, 500);
  }
}

// Get published case studies only
export async function getPublishedCaseStudies(c: Context) {
  try {
    const caseStudies = await kv.getByPrefix(CASE_STUDIES_PREFIX);
    // getByPrefix returns an array of values directly, not { value: ... } objects
    const publishedCaseStudies = caseStudies
      .filter((cs: any) => cs != null && cs.published) // Filter out null and unpublished
      .sort((a: CaseStudy, b: CaseStudy) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(publishedCaseStudies);
  } catch (error) {
    console.error('Error fetching published case studies:', error);
    return c.json({ error: 'Failed to fetch published case studies' }, 500);
  }
}

// Get single case study by ID
export async function getCaseStudyById(c: Context) {
  try {
    const { id } = c.req.param();
    const caseStudy = await kv.get(`${CASE_STUDIES_PREFIX}${id}`);
    
    if (!caseStudy) {
      return c.json({ error: 'Case study not found' }, 404);
    }
    
    return c.json(caseStudy);
  } catch (error) {
    console.error('Error fetching case study:', error);
    return c.json({ error: 'Failed to fetch case study' }, 500);
  }
}

// Create new case study
export async function createCaseStudy(c: Context) {
  try {
    const body = await c.req.json();
    
    const caseStudyId = body.id || `case-study-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newCaseStudy: CaseStudy = {
      id: caseStudyId,
      client: body.client || '',
      industry: body.industry || '',
      participants: body.participants || '',
      program: body.program || '',
      challenge: body.challenge || 'Training Needs & Business Challenge',
      challengeDetails: body.challengeDetails || '',
      solution: body.solution || 'Our Approach',
      solutionDetails: body.solutionDetails || '',
      outcomes: body.outcomes || [],
      impact: body.impact || '',
      testimonial: body.testimonial || { quote: '', role: '' },
      published: body.published || false,
      createdAt: now,
      updatedAt: now,
    };
    
    await kv.set(`${CASE_STUDIES_PREFIX}${caseStudyId}`, newCaseStudy);
    
    return c.json(newCaseStudy, 201);
  } catch (error) {
    console.error('Error creating case study:', error);
    return c.json({ error: 'Failed to create case study' }, 500);
  }
}

// Update case study
export async function updateCaseStudy(c: Context) {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    const existingCaseStudy = await kv.get(`${CASE_STUDIES_PREFIX}${id}`);
    
    if (!existingCaseStudy) {
      return c.json({ error: 'Case study not found' }, 404);
    }
    
    const updatedCaseStudy: CaseStudy = {
      ...existingCaseStudy,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`${CASE_STUDIES_PREFIX}${id}`, updatedCaseStudy);
    
    return c.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error updating case study:', error);
    return c.json({ error: 'Failed to update case study' }, 500);
  }
}

// Delete case study
export async function deleteCaseStudy(c: Context) {
  try {
    const { id } = c.req.param();
    
    const existingCaseStudy = await kv.get(`${CASE_STUDIES_PREFIX}${id}`);
    
    if (!existingCaseStudy) {
      return c.json({ error: 'Case study not found' }, 404);
    }
    
    await kv.del(`${CASE_STUDIES_PREFIX}${id}`);
    
    return c.json({ message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Error deleting case study:', error);
    return c.json({ error: 'Failed to delete case study' }, 500);
  }
}