---
*** Begin Patch
*** Update File: src/app/pages/admin/AdminContent.tsx
@@
-import { ChevronLeft, FileText, Calendar, Award, Megaphone, Image } from 'lucide-react';
-import AdminBlogSection from './sections/AdminBlogSection';
+import { ChevronLeft, FileText, Calendar, Award, Megaphone, Image } from 'lucide-react';
+import AdminBlogSection from './sections/AdminBlogSection';
 import AdminEventsSection from './sections/AdminEventsSection';
 import AdminCaseStudiesSection from './sections/AdminCaseStudiesSection';
 import AdminMarqueeSection from './sections/AdminMarqueeSection';
 import AdminLogosSection from './sections/AdminLogosSection';
+import AdminTestimonialsSection from './sections/AdminTestimonialsSection';
@@
-type TabType = 'blog' | 'events' | 'case-studies' | 'marquee' | 'logos';
+type TabType = 'blog' | 'events' | 'case-studies' | 'marquee' | 'logos' | 'testimonials';
@@
     },
     {
       id: 'logos' as TabType,
       label: 'Client Logos',
       icon: Image,
       activeColor: 'bg-teal-50 border-teal-200 text-teal-700',
       inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
     },
+    {
+      id: 'testimonials' as TabType,
+      label: 'Testimonials',
+      icon: Award,
+      activeColor: 'bg-amber-50 border-amber-200 text-amber-700',
+      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
+    },
   ];
@@
-          {activeTab === 'blog' && <AdminBlogSection />}
-          {activeTab === 'events' && <AdminEventsSection />}
-          {activeTab === 'case-studies' && <AdminCaseStudiesSection />}
-          {activeTab === 'marquee' && <AdminMarqueeSection />}
-          {activeTab === 'logos' && <AdminLogosSection />}
+          {activeTab === 'blog' && <AdminBlogSection />}
+          {activeTab === 'events' && <AdminEventsSection />}
+          {activeTab === 'case-studies' && <AdminCaseStudiesSection />}
+          {activeTab === 'marquee' && <AdminMarqueeSection />}
+          {activeTab === 'logos' && <AdminLogosSection />}
+          {activeTab === 'testimonials' && <AdminTestimonialsSection />}
         </div>
*** End Patch
