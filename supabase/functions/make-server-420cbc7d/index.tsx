import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const EVENTS_PREFIX = 'events_420cbc7d:';
const CASE_STUDIES_PREFIX = 'case_studies_420cbc7d:';
const TESTIMONIALS_PREFIX = 'testimonial:';

function verifyAdminAuth(c: any): boolean {
  const master = c.req.header('X-Kaizari-Master');
  const auth = c.req.header('X-Kaizari-Auth');
  return master === 'KAIZARI_ADMIN_2026' || auth === 'KAIZARI_ADMIN_2026';
}

// ── Seed Data ──────────────────────────────────────────────────────────��[...]
const SEED_EVENTS: any[] = [];

const SEED_CASE_STUDIES = [
  {
    id: 'zep-re-excel-training',
    client: 'ZEP-RE (PTA Reinsurance Company)',
    industry: 'Reinsurance & Financial Services',
    participants: '25',
    program: 'In-House Intermediate-Advanced Excel Training',
    challenge: 'Training Needs & Business Challenge',
    challengeDetails: "ZEP-RE's finance team was spending excessive time on manual data processing and financial reporting. Their existing Excel skills were limited to basic functions, resulting i[...]",
    solution: 'Our Approach',
    solutionDetails: "We designed and delivered a comprehensive 5-day in-house training program tailored specifically to ZEP-RE's reinsurance workflows.",
    outcomes: [
      { metric: '40%', description: 'Reduction in financial reporting time' },
      { metric: '25', description: 'Finance professionals trained' },
      { metric: '60%', description: 'Decrease in manual data entry errors' },
      { metric: 'ROI', description: 'Achieved within first quarter post-training' },
    ],
    impact: "The training transformed ZEP-RE's finance operations. Teams now complete monthly closing processes 40% faster.",
    testimonial: {
      quote: "The in-house intermediate-advanced Excel training transformed our team's productivity. Our financial reporting time reduced by 40%, and the ROI was evident within the first quarter.[...]",
      role: 'Head of Finance, ZEP-RE',
    },
    published: true,
  },
  {
    id: 'multi-industry-consortium',
    client: 'Multi-Industry Consortium',
    industry: 'Technology, Aviation, Logistics, Agriculture & Engineering',
    participants: 'Soliton Telmec, Tropic Air, OML Africa Logistics, Qualibasic Seeds, PowerGroup Technologies',
    program: 'Advanced Financial Modeling and Dashboards With Excel (Open Course)',
    challenge: 'Training Needs & Business Challenge',
    challengeDetails: 'Finance professionals from diverse industries faced common challenges: inability to create dynamic financial models, reliance on static spreadsheets for forecasting, and lim[...]',
    solution: 'Our Approach',
    solutionDetails: 'Our 3-day Advanced Financial Modeling open course brought together professionals from multiple industries, creating a rich learning environment with cross-sector knowledge sh[...]',
    outcomes: [
      { metric: '35%', description: 'Improvement in forecasting accuracy' },
      { metric: '30+', description: 'Finance professionals from 5 industries' },
      { metric: '50%', description: 'Faster executive report preparation' },
      { metric: '100%', description: 'Participants reported immediate applicability' },
    ],
    impact: 'Participants returned to their organizations equipped with advanced modeling skills that immediately enhanced their analytical capabilities.',
    testimonial: {
      quote: 'Outstanding training program! The Advanced Financial Modeling course equipped our team with cutting-edge Excel skills.',
      role: 'Senior Financial Analyst, PowerGroup Technologies',
    },
    published: true,
  },
];

async function autoSeed() {
  try {
    const existingEvents = await kv.getByPrefix(EVENTS_PREFIX);
    const existingCS = await kv.getByPrefix(CASE_STUDIES_PREFIX);
    const now = new Date().toISOString();
    if (existingEvents.filter((e: any) => e != null).length === 0) {
      for (const event of SEED_EVENTS) {
        await kv.set(`${EVENTS_PREFIX}${event.id}`, { ...event, createdAt: now, updatedAt: now });
      }
      console.log('Auto-seeded initial events');
    }
    if (existingCS.filter((cs: any) => cs != null).length === 0) {
      for (const cs of SEED_CASE_STUDIES) {
        await kv.set(`${CASE_STUDIES_PREFIX}${cs.id}`, { ...cs, createdAt: now, updatedAt: now });
      }
      console.log('Auto-seeded initial case studies');
    }
  } catch (err) {
    console.log('Auto-seed error (non-fatal):', err);
  }
}

async function ensureAdminUser() {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const adminEmail = 'admin@kaizarildinternational.com';
    const adminPassword = 'KaizariAdmin2026!';

    const { data: list } = await supabaseAdmin.auth.admin.listUsers();
    const exists = list?.users?.some((u: any) => u.email === adminEmail);
    if (!exists) {
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: 'Kaizari Admin' },
      });
      console.log('Admin user created:', adminEmail);
    }
  } catch (err) {
    console.log('ensureAdminUser error (non-fatal):', err);
  }
}

// ── Setup Admin ─────────────────────────────────────────────────────────��[...]
// Creates the default admin account. Safe to call multiple times (idempotent).
async function setupAdminRoute(c: any) {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const email = 'admin@kaizarildinternational.com';
    const password = 'KaizariAdmin2026!';

    // Check if user already exists
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const alreadyExists = existing?.users?.some((u: any) => u.email === email);

    if (alreadyExists) {
      return c.json({ success: true, message: 'Admin account already exists', email });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Kaizari Admin' },
    });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true, message: 'Admin account created', email });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
}

// ── API routes (no prefix) ───────────────────────────────────────────────────
const api = new Hono();

api.get('/health', (c) => c.json({ status: 'ok' }));
api.post('/setup-admin', setupAdminRoute);

// Events
api.get('/events/published', async (c) => {
  try {
    const events = await kv.getByPrefix(EVENTS_PREFIX);
    const published = events
      .filter((e: any) => e != null && e.published)
      .sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    return c.json(published);
  } catch (err) {
    console.log('events/published error:', err);
    return c.json({ error: 'Failed to fetch published events' }, 500);
  }
});

api.get('/events/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const event = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!event) return c.json({ error: 'Event not found' }, 404);
    return c.json(event);
  } catch (err) {
    console.log('events/:id error:', err);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

api.get('/events', async (c) => {
  try {
    const events = await kv.getByPrefix(EVENTS_PREFIX);
    const sorted = events
      .filter((e: any) => e != null)
      .sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    return c.json(sorted);
  } catch (err) {
    console.log('events error:', err);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

api.post('/events/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const existing = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!existing) return c.json({ error: 'Event not found' }, 404);
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`${EVENTS_PREFIX}${id}`, updated);
    return c.json(updated);
  } catch (err) {
    console.log('events/:id POST error:', err);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

api.post('/events', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const id = body.id || `event-${Date.now()}`;
    const now = new Date().toISOString();
    const event = {
      id,
      title: body.title || '',
      dates: body.dates || '',
      duration: body.duration || '',
      time: body.time || '',
      location: body.location || '',
      capacity: body.capacity || '',
      seatsRemaining: body.seatsRemaining ?? null,
      category: body.category || '',
      featured: body.featured || false,
      description: body.description || '',
      outcomes: body.outcomes || [],
      whoShouldAttend: body.whoShouldAttend || [],
      paymentLink: body.paymentLink || '',
      brochureUrl: body.brochureUrl || '',
      published: body.published || false,
      createdAt: now,
      updatedAt: now,
    };
    await kv.set(`${EVENTS_PREFIX}${id}`, event);
    return c.json(event, 201);
  } catch (err) {
    console.log('events POST error:', err);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

api.delete('/events/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    const existing = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!existing) return c.json({ error: 'Event not found' }, 404);
    await kv.del(`${EVENTS_PREFIX}${id}`);
    return c.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.log('events/:id DELETE error:', err);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

// Case Studies
api.get('/case-studies/published', async (c) => {
  try {
    const all = await kv.getByPrefix(CASE_STUDIES_PREFIX);
    const published = all
      .filter((cs: any) => cs != null && cs.published)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json(published);
  } catch (err) {
    console.log('case-studies/published error:', err);
    return c.json({ error: 'Failed to fetch case studies' }, 500);
  }
});

api.get('/case-studies/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const cs = await kv.get(`${CASE_STUDIES_PREFIX}${id}`);
    if (!cs) return c.json({ error: 'Not found' }, 404);
    return c.json(cs);
  } catch (err) {
    console.log('case-studies/:id error:', err);
    return c.json({ error: 'Failed to fetch case study' }, 500);
  }
});

api.get('/case-studies', async (c) => {
  try {
    const all = await kv.getByPrefix(CASE_STUDIES_PREFIX);
    const sorted = all
      .filter((cs: any) => cs != null)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json(sorted);
  } catch (err) {
    console.log('case-studies error:', err);
    return c.json({ error: 'Failed to fetch case studies' }, 500);
  }
});

api.post('/case-studies/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const existing = await kv.get(`${CASE_STUDIES_PREFIX}${id}`);
    if (!existing) return c.json({ error: 'Not found' }, 404);
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`${CASE_STUDIES_PREFIX}${id}`, updated);
    return c.json(updated);
  } catch (err) {
    console.log('case-studies/:id POST error:', err);
    return c.json({ error: 'Failed to update case study' }, 500);
  }
});

api.post('/case-studies', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const id = body.id || `case-study-${Date.now()}`;
    const now = new Date().toISOString();
    const cs = {
      id,
      client: body.client || '',
      industry: body.industry || '',
      participants: body.participants || '',
      program: body.program || '',
      challenge: body.challenge || '',
      challengeDetails: body.challengeDetails || '',
      solution: body.solution || '',
      solutionDetails: body.solutionDetails || '',
      outcomes: body.outcomes || [],
      impact: body.impact || '',
      testimonial: body.testimonial || { quote: '', role: '' },
      published: body.published || false,
      createdAt: now,
      updatedAt: now,
    };
    await kv.set(`${CASE_STUDIES_PREFIX}${id}`, cs);
    return c.json(cs, 201);
  } catch (err) {
    console.log('case-studies POST error:', err);
    return c.json({ error: 'Failed to create case study' }, 500);
  }
});

api.delete('/case-studies/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    await kv.del(`${CASE_STUDIES_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log('case-studies/:id DELETE error:', err);
    return c.json({ error: 'Failed to delete case study' }, 500);
  }
});

// Testimonials
api.get('/testimonials', async (c) => {
  try {
    const items = await kv.getByPrefix(TESTIMONIALS_PREFIX);
    const sorted = (items || [])
      .filter((t: any) => t != null)
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return c.json(sorted);
  } catch (err) {
    console.log('testimonials error:', err);
    return c.json({ error: 'Failed to fetch testimonials' }, 500);
  }
});

api.post('/testimonials', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const item = {
      id,
      company: body.company || '',
      role: body.role || '',
      content: body.content || '',
      program: body.program || '',
      published: !!body.published,
      createdAt: body.createdAt || now,
      updatedAt: now,
    };
    await kv.set(`testimonial:${id}`, item);
    return c.json(item, 201);
  } catch (err) {
    console.log('testimonials POST error:', err);
    return c.json({ error: 'Failed to save testimonial' }, 500);
  }
});

api.delete('/testimonials/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    await kv.del(`testimonial:${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log('testimonials DELETE error:', err);
    return c.json({ error: 'Failed to delete testimonial' }, 500);
  }
});

// Blogs
api.get('/blogs', async (c) => {
  try {
    const blogs = await kv.getByPrefix('blog:');
    return c.json(blogs.sort((a: any, b: any) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
    ));
  } catch (err) {
    console.log('blogs error:', err);
    return c.json({ error: 'Failed to fetch blogs' }, 500);
  }
});

api.post('/blogs', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const post = { ...body, id, updatedAt: new Date().toISOString(), createdAt: body.createdAt || new Date().toISOString() };
    await kv.set(`blog:${id}`, post);
    return c.json(post);
  } catch (err) {
    console.log('blogs POST error:', err);
    return c.json({ error: 'Failed to save blog' }, 500);
  }
});

api.delete('/blogs/:id', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { id } = c.req.param();
    await kv.del(`blog:${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log('blogs DELETE error:', err);
    return c.json({ error: 'Failed to delete blog' }, 500);
  }
});

// Categories
api.get('/categories', async (c) => {
  try {
    const cats = await kv.get('blog_categories') || ['General', 'Leadership', 'Finance', 'Technology', 'LMS'];
    return c.json(cats);
  } catch (err) {
    return c.json(['General', 'Leadership', 'Finance', 'Technology', 'LMS']);
  }
});

api.post('/categories', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { category } = await c.req.json();
    const cats = await kv.get('blog_categories') || ['General', 'Leadership', 'Finance', 'Technology', 'LMS'];
    if (category && !cats.includes(category)) {
      cats.push(category);
      await kv.set('blog_categories', cats);
    }
    return c.json(cats);
  } catch (err) {
    console.log('categories POST error:', err);
    return c.json({ error: 'Failed to update categories' }, 500);
  }
});

// Subcategories
api.get('/subcategories', async (c) => {
  try {
    const allContent = await kv.getByPrefix('subcategory_content_');
    const contentMap: Record<string, any> = {};
    allContent.forEach((item: any) => {
      const key = `${item.industryId}_${item.subcategorySlug}`;
      contentMap[key] = item;
    });
    return c.json(contentMap);
  } catch (err) {
    console.log('subcategories error:', err);
    return c.json({});
  }
});

api.get('/subcategories/:industryId/:subcategorySlug', async (c) => {
  try {
    const industryId = c.req.param('industryId');
    const subcategorySlug = c.req.param('subcategorySlug');
    const content = await kv.get(`subcategory_content_${industryId}_${subcategorySlug}`);
    if (!content) return c.json({ error: 'Content not found' }, 404);
    return c.json(content);
  } catch (err) {
    console.log('subcategories/:id error:', err);
    return c.json({ error: 'Failed to fetch subcategory' }, 500);
  }
});

api.post('/subcategories', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const { industryId, subcategorySlug } = body;
    const key = `subcategory_content_${industryId}_${subcategorySlug}`;
    const content = { ...body, updatedAt: new Date().toISOString(), createdAt: body.createdAt || new Date().toISOString() };
    await kv.set(key, content);
    return c.json(content);
  } catch (err) {
    console.log('subcategories POST error:', err);
    return c.json({ error: 'Failed to save subcategory' }, 500);
  }
});

api.delete('/subcategories/:industryId/:subcategorySlug', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const industryId = c.req.param('industryId');
    const subcategorySlug = c.req.param('subcategorySlug');
    await kv.del(`subcategory_content_${industryId}_${subcategorySlug}`);
    return c.json({ success: true });
  } catch (err) {
    console.log('subcategories DELETE error:', err);
    return c.json({ error: 'Failed to delete subcategory' }, 500);
  }
});

// Seed
api.post('/seed-initial-data', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const now = new Date().toISOString();
    let seededEvents = 0;
    let seededCaseStudies = 0;
    for (const event of SEED_EVENTS) {
      const existing = await kv.get(`${EVENTS_PREFIX}${event.id}`);
      if (!existing) {
        await kv.set(`${EVENTS_PREFIX}${event.id}`, { ...event, createdAt: now, updatedAt: now });
        seededEvents++;
      }
    }
    for (const cs of SEED_CASE_STUDIES) {
      const existing = await kv.get(`${CASE_STUDIES_PREFIX}${cs.id}`);
      if (!existing) {
        await kv.set(`${CASE_STUDIES_PREFIX}${cs.id}`, { ...cs, createdAt: now, updatedAt: now });
        seededCaseStudies++;
      }
    }
    return c.json({ success: true, seededEvents, seededCaseStudies });
  } catch (err) {
    return c.json({ error: 'Seed failed' }, 500);
  }
});

api.post('/reseed-initial-data', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const now = new Date().toISOString();
    for (const event of SEED_EVENTS) {
      await kv.set(`${EVENTS_PREFIX}${event.id}`, { ...event, createdAt: now, updatedAt: now });
    }
    for (const cs of SEED_CASE_STUDIES) {
      await kv.set(`${CASE_STUDIES_PREFIX}${cs.id}`, { ...cs, createdAt: now, updatedAt: now });
    }
    return c.json({ success: true, seededEvents: SEED_EVENTS.length, seededCaseStudies: SEED_CASE_STUDIES.length });
  } catch (err) {
    return c.json({ error: 'Reseed failed' }, 500);
  }
});

// ── Main app: mount api at both / and /make-server-420cbc7d ──────────────────
const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-Kaizari-Auth', 'X-Kaizari-Master'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// ── Marquee / Announcement Banner ──────────────────────────────────────────
const MARQUEE_KEY = 'marquee_420cbc7d:settings';

api.get('/marquee', async (c) => {
  try {
    const settings = await kv.get(MARQUEE_KEY);
    return c.json(settings || { enabled: false, message: '', variant: 'urgent' });
  } catch (err) {
    return c.json({ enabled: false, message: '', variant: 'urgent' });
  }
});

api.post('/marquee', async (c) => {
  if (!verifyAdminAuth(c)) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const body = await c.req.json();
    const settings = {
      enabled: !!body.enabled,
      message: String(body.message || ''),
      variant: body.variant === 'info' ? 'info' : 'urgent',
    };
    await kv.set(MARQUEE_KEY, settings);
    return c.json({ success: true, settings });
  } catch (err) {
    return c.json({ error: 'Failed to save marquee settings' }, 500);
  }
});
// ────────────────────────────────────────────────────────────────[...]

app.route('/make-server-420cbc7d', api);
app.route('/', api);

autoSeed();
ensureAdminUser();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Kaizari-Auth, X-Kaizari-Master',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  return app.fetch(req);
});
