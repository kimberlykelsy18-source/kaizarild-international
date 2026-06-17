# Email Integration Guide

## Overview
All registration and contact forms in the website are currently configured to log submissions to the console. To enable actual email notifications to `admin@kaizarildinternational.com`, you need to integrate an email service.

## Forms That Need Email Integration

1. **Open Course Events Registration** (`/pages/OpenCourseEvents.tsx`)
2. **Contact Us Form** (`/pages/ContactUs.tsx`)
3. **Partner Hub Application** (`/pages/PartnerHub.tsx`)
4. **LMS Demo Request** (`/pages/LMSDemo.tsx`)

## Recommended Email Services

### Option 1: EmailJS (Easiest - No Backend Required)
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create an email service and template
3. Install EmailJS: `npm install @emailjs/browser`
4. Replace the `TODO` comments in each form's `handleSubmit` function with:

```typescript
import emailjs from '@emailjs/browser';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: 'admin@kaizarildinternational.com',
        ...formData
      },
      'YOUR_PUBLIC_KEY'
    );
    
    toast.success('Message sent successfully!');
    // Reset form...
  } catch (error) {
    toast.error('Failed to send message. Please try again.');
  }
};
```

### Option 2: Supabase Edge Functions
1. Set up Supabase project at [supabase.com](https://supabase.com)
2. Create an Edge Function for sending emails
3. Use Resend, SendGrid, or similar service within the Edge Function
4. Call the Edge Function from your forms

### Option 3: Formspree
1. Sign up at [formspree.io](https://formspree.io/)
2. Create forms for each submission type
3. Use their React integration:

```typescript
import { useForm } from '@formspree/react';

const [state, handleSubmit] = useForm("YOUR_FORM_ID");

if (state.succeeded) {
  toast.success('Message sent!');
}
```

### Option 4: Custom Backend API
Create your own backend with Node.js/Express and use Nodemailer:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

app.post('/api/send-email', async (req, res) => {
  await transporter.sendMail({
    to: 'admin@kaizarildinternational.com',
    subject: req.body.subject,
    html: generateEmailTemplate(req.body)
  });
});
```

## Implementation Steps

1. Choose your email service provider
2. Sign up and configure the service
3. Find the `TODO: Replace with actual email service integration` comments in:
   - `/pages/OpenCourseEvents.tsx` (line ~36)
   - `/pages/ContactUs.tsx` (line ~24)
   - `/pages/PartnerHub.tsx` (line ~32)
   - `/pages/LMSDemo.tsx` (line ~39)
4. Replace the console.log statements with your email service code
5. Test each form thoroughly
6. Update success/error messages as needed

## Email Template Suggestions

### Course Registration Email
**Subject:** New Course Registration: [Course Name]
**Body:**
- Full Name
- Email
- Phone
- Company
- Position
- Course: Advanced Financial Modeling (March 17-19, 2026)

### Contact Form Email
**Subject:** Website Contact: [Subject]
**Body:**
- Name
- Email
- Phone
- Company
- Industry
- Subject
- Message

### Partner Application Email
**Subject:** New Trainer Application: [Name]
**Body:**
- Full Name
- Email
- Phone
- NITA Certificate Number
- Years of Experience
- Specialization
- Industries
- CV Link
- Cover Letter

### LMS Demo Request Email
**Subject:** LMS Demo Request: [Company]
**Body:**
- Full Name
- Email
- Phone
- Company
- Position
- Company Size
- Industry
- Preferred Date/Time
- Specific Needs

## Testing Checklist

- [ ] Course registration emails arrive at admin@kaizarildinternational.com
- [ ] Contact form submissions are received
- [ ] Partner applications are delivered
- [ ] LMS demo requests are sent
- [ ] Success toasts appear on submission
- [ ] Error handling works for failed sends
- [ ] Forms reset after successful submission
- [ ] Email formatting is professional and readable

## Security Notes

- Never commit API keys to your repository
- Use environment variables for sensitive data
- Implement rate limiting to prevent spam
- Add reCAPTCHA for additional protection
- Validate all input data before sending

## Support

For assistance with email integration, contact your development team or refer to the documentation of your chosen email service provider.
