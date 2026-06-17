import * as kv from './kv_store.tsx';

const EVENTS_PREFIX = 'events_420cbc7d:';
const CASE_STUDIES_PREFIX = 'case_studies_420cbc7d:';

// Initial Q1 2026 Finance Events
const initialEvents = [
  {
    id: 'financial-modeling',
    title: 'Advanced Financial Modeling and Dashboards With Excel',
    dates: 'March 17-19, 2026',
    duration: '3 Days',
    time: '9:00 AM - 5:00 PM',
    location: 'Nairobi, Kenya',
    capacity: '25 Participants',
    seatsRemaining: 10,
    category: 'Finance Services',
    featured: true,
    description: 'Master advanced Excel techniques for financial modeling, forecasting, and dashboard creation. Build sophisticated models that drive data-driven decision-making and deliver measurable ROI.',
    outcomes: [
      'Create dynamic financial models and forecasts',
      'Build interactive dashboards for executive reporting',
      'Master advanced Excel functions and formulas',
      'Develop scenario analysis and sensitivity models',
      'Implement best practices for model design and documentation',
      'Improve financial reporting efficiency by up to 40%',
    ],
    whoShouldAttend: [
      'Finance Managers and Directors',
      'Financial Analysts and Controllers',
      'Business Analysts',
      'Accountants and Auditors',
      'Anyone working with financial data and reporting',
    ],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'power-query-bi',
    title: 'Data Analysis with Power Query and Power BI',
    dates: 'April 2026 (Dates TBD)',
    duration: '3 Days',
    time: '9:00 AM - 5:00 PM (Tentative)',
    location: 'Nairobi, Kenya',
    capacity: '25 Participants',
    seatsRemaining: null,
    category: 'Finance Services',
    featured: false,
    description: 'Transform raw data into actionable insights using Power Query and Power BI. Learn to automate data extraction, transformation, and visualization for powerful business intelligence.',
    outcomes: [
      'Master Power Query for data transformation',
      'Create stunning interactive Power BI dashboards',
      'Automate repetitive data preparation tasks',
      'Build dynamic visualizations and reports',
      'Implement DAX formulas for advanced analytics',
      'Connect to multiple data sources seamlessly',
    ],
    whoShouldAttend: [
      'Data Analysts and Business Intelligence Professionals',
      'Finance and Operations Teams',
      'Managers requiring data-driven insights',
      'Anyone working with large datasets',
      'Excel users looking to upgrade their skills',
    ],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'intermediate-advanced-excel',
    title: 'Intermediate to Advanced Excel',
    dates: 'April 2026 (Dates TBD)',
    duration: '3 Days',
    time: '9:00 AM - 5:00 PM (Tentative)',
    location: 'Nairobi, Kenya',
    capacity: '25 Participants',
    seatsRemaining: null,
    category: 'Finance Services',
    featured: false,
    description: 'Elevate your Excel skills from intermediate to advanced level. Master complex formulas, data analysis tools, automation with macros, and professional reporting techniques.',
    outcomes: [
      'Master VLOOKUP, INDEX-MATCH, and array formulas',
      'Use PivotTables and PivotCharts effectively',
      'Automate tasks with macros and VBA basics',
      'Implement data validation and conditional formatting',
      'Create professional charts and dashboards',
      'Improve productivity through Excel shortcuts and best practices',
    ],
    whoShouldAttend: [
      'Office Professionals with basic Excel knowledge',
      'Administrators and Coordinators',
      'Anyone looking to enhance Excel productivity',
      'Team members preparing for advanced training',
      'Professionals seeking to improve efficiency',
    ],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Case Studies
const initialCaseStudies = [
  {
    id: 'zep-re-excel-training',
    client: 'ZEP-RE (PTA Reinsurance Company)',
    industry: 'Reinsurance & Financial Services',
    program: 'In-House Intermediate-Advanced Excel Training',
    challenge: 'Training Needs & Business Challenge',
    challengeDetails: 'ZEP-RE\'s finance team was spending excessive time on manual data processing and financial reporting. Their existing Excel skills were limited to basic functions, resulting in inefficient workflows, delayed reporting cycles, and increased risk of errors in critical financial documents. As a regional reinsurance leader, they needed their team to leverage advanced Excel capabilities to handle complex financial analysis, automate repetitive tasks, and create sophisticated reports that meet international standards.',
    solution: 'Our Approach',
    solutionDetails: 'We designed and delivered a comprehensive 5-day in-house training program tailored specifically to ZEP-RE\'s reinsurance workflows. The curriculum covered advanced formulas, pivot tables, data analysis tools, automated reporting templates, and dashboard creation. Our NITA-certified trainers worked directly with their finance team to understand their specific use cases and incorporated real ZEP-RE data scenarios into the training exercises.',
    outcomes: [
      {
        metric: '40%',
        description: 'Reduction in financial reporting time',
      },
      {
        metric: '25',
        description: 'Finance professionals trained',
      },
      {
        metric: '60%',
        description: 'Decrease in manual data entry errors',
      },
      {
        metric: 'ROI',
        description: 'Achieved within first quarter post-training',
      },
    ],
    impact: 'The training transformed ZEP-RE\'s finance operations. Teams now complete monthly closing processes 40% faster, automated reporting has freed up staff for strategic analysis, and management has real-time visibility into key financial metrics through custom dashboards. The measurable ROI was evident immediately, with time savings translating to increased productivity and reduced operational costs.',
    testimonial: {
      quote: 'The in-house intermediate-advanced Excel training transformed our team\'s productivity. Our financial reporting time reduced by 40%, and the ROI was evident within the first quarter. Highly professional delivery.',
      role: 'Head of Finance, ZEP-RE',
    },
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'multi-industry-consortium',
    client: 'Multi-Industry Consortium',
    industry: 'Technology, Aviation, Logistics, Agriculture & Engineering',
    participants: 'Soliton Telmec, Tropic Air, OML Africa Logistics, Qualibasic Seeds, PowerGroup Technologies',
    program: 'Advanced Financial Modeling and Dashboards With Excel (Open Course)',
    challenge: 'Training Needs & Business Challenge',
    challengeDetails: 'Finance professionals from diverse industries faced common challenges: inability to create dynamic financial models, reliance on static spreadsheets for forecasting, limited dashboard visualization capabilities, and difficulty presenting complex financial data to non-finance stakeholders. Each organization needed their teams to move beyond basic Excel usage to sophisticated financial modeling that could support strategic decision-making, scenario planning, and executive reporting across their respective sectors.',
    solution: 'Our Approach',
    solutionDetails: 'Our 3-day Advanced Financial Modeling open course brought together professionals from multiple industries, creating a rich learning environment with cross-sector knowledge sharing. The curriculum covered building dynamic financial models, advanced forecasting techniques, scenario and sensitivity analysis, executive dashboard creation, and data visualization best practices. Real-world case studies from technology, aviation, logistics, agriculture, and engineering sectors ensured relevance for all participants.',
    outcomes: [
      {
        metric: '35%',
        description: 'Improvement in forecasting accuracy',
      },
      {
        metric: '30+',
        description: 'Finance professionals from 5 industries',
      },
      {
        metric: '50%',
        description: 'Faster executive report preparation',
      },
      {
        metric: '100%',
        description: 'Participants reported immediate applicability',
      },
    ],
    impact: 'Participants returned to their organizations equipped with advanced modeling skills that immediately enhanced their analytical capabilities. Companies reported more accurate financial forecasts, improved strategic planning processes, and enhanced executive decision-making through better data visualization. The cross-industry networking also created valuable peer connections for ongoing knowledge sharing.',
    testimonial: {
      quote: 'Outstanding training program! The Advanced Financial Modeling course equipped our team with cutting-edge Excel skills. Our financial models are now more robust, and our analysis more insightful. Great ROI on this investment.',
      role: 'Senior Financial Analyst, PowerGroup Technologies',
    },
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function seedInitialData() {
  try {
    // Check if data already exists
    const existingEvents = await kv.getByPrefix(EVENTS_PREFIX);
    const existingCaseStudies = await kv.getByPrefix(CASE_STUDIES_PREFIX);

    let seededEvents = 0;
    let seededCaseStudies = 0;

    // Seed events if none exist
    if (existingEvents.length === 0) {
      for (const event of initialEvents) {
        await kv.set(`${EVENTS_PREFIX}${event.id}`, event);
        seededEvents++;
      }
    }

    // Seed case studies if none exist
    if (existingCaseStudies.length === 0) {
      for (const caseStudy of initialCaseStudies) {
        await kv.set(`${CASE_STUDIES_PREFIX}${caseStudy.id}`, caseStudy);
        seededCaseStudies++;
      }
    }

    return {
      success: true,
      message: `Seeded ${seededEvents} events and ${seededCaseStudies} case studies`,
      seededEvents,
      seededCaseStudies,
    };
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
}

// Manual seed function that always seeds (for re-seeding)
export async function reseedInitialData() {
  try {
    let seededEvents = 0;
    let seededCaseStudies = 0;

    // Seed all events
    for (const event of initialEvents) {
      await kv.set(`${EVENTS_PREFIX}${event.id}`, event);
      seededEvents++;
    }

    // Seed all case studies
    for (const caseStudy of initialCaseStudies) {
      await kv.set(`${CASE_STUDIES_PREFIX}${caseStudy.id}`, caseStudy);
      seededCaseStudies++;
    }

    return {
      success: true,
      message: `Re-seeded ${seededEvents} events and ${seededCaseStudies} case studies`,
      seededEvents,
      seededCaseStudies,
    };
  } catch (error) {
    console.error('Error re-seeding initial data:', error);
    throw error;
  }
}
