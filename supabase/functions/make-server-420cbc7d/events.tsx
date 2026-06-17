import { Context } from 'npm:hono';
import * as kv from './kv_store.tsx';

const EVENTS_PREFIX = 'events_420cbc7d:';

export interface Event {
  id: string;
  title: string;
  dates: string;
  duration: string;
  time: string;
  location: string;
  capacity: string;
  seatsRemaining: number | null;
  category: string;
  featured: boolean;
  description: string;
  outcomes: string[];
  whoShouldAttend: string[];
  paymentLink: string;
  brochureUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllEvents(c: Context) {
  try {
    const events = await kv.getByPrefix(EVENTS_PREFIX);
    const sortedEvents = events
      .filter((event: any) => event != null)
      .sort((a: Event, b: Event) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    return c.json(sortedEvents);
  } catch (error) {
    console.log('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
}

export async function getPublishedEvents(c: Context) {
  try {
    const events = await kv.getByPrefix(EVENTS_PREFIX);
    const publishedEvents = events
      .filter((event: any) => event != null && event.published)
      .sort((a: Event, b: Event) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    return c.json(publishedEvents);
  } catch (error) {
    console.log('Error fetching published events:', error);
    return c.json({ error: 'Failed to fetch published events' }, 500);
  }
}

export async function getEventById(c: Context) {
  try {
    const { id } = c.req.param();
    const event = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }
    return c.json(event);
  } catch (error) {
    console.log('Error fetching event:', error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
}

export async function createEvent(c: Context) {
  try {
    const body = await c.req.json();
    const eventId = body.id || `event-${Date.now()}`;
    const now = new Date().toISOString();
    const newEvent: Event = {
      id: eventId,
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
    await kv.set(`${EVENTS_PREFIX}${eventId}`, newEvent);
    return c.json(newEvent, 201);
  } catch (error) {
    console.log('Error creating event:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
}

export async function updateEvent(c: Context) {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const existingEvent = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!existingEvent) {
      return c.json({ error: 'Event not found' }, 404);
    }
    const updatedEvent: Event = {
      ...existingEvent,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`${EVENTS_PREFIX}${id}`, updatedEvent);
    return c.json(updatedEvent);
  } catch (error) {
    console.log('Error updating event:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
}

export async function deleteEvent(c: Context) {
  try {
    const { id } = c.req.param();
    const existingEvent = await kv.get(`${EVENTS_PREFIX}${id}`);
    if (!existingEvent) {
      return c.json({ error: 'Event not found' }, 404);
    }
    await kv.del(`${EVENTS_PREFIX}${id}`);
    return c.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.log('Error deleting event:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
}
