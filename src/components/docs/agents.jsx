
AI Agent Instructions for NocturneAI Platform Development

========================================================

IMPORTANT: READ THIS FIRST - PLATFORM ARCHITECTURE
==================================================

This project runs on the Base44 platform, which has a UNIQUE file structure that differs from standard React applications. Understanding this is CRITICAL for successful development.

PLATFORM STRUCTURE EXPLANATION
==============================

Standard React Project vs Base44 Platform:

WRONG (Standard React):
```
project-root/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   ├── index.js
│   └── ...
├── public/
├── package.json
└── ...
```

CORRECT (Base44 Platform):
```
base44-platform/
├── entities/           <- JSON schema files (not in src/)
├── pages/             <- React page components (not in src/)  
├── components/        <- React components (not in src/)
├── layout.js          <- Main layout wrapper (not Layout.js in src/)
└── integrations/      <- External API integrations
```

KEY DIFFERENCES YOU MUST UNDERSTAND
===================================

1. NO src/ DIRECTORY:
   - Files are directly in root directories
   - Do NOT create src/ folder
   - Do NOT reference src/ in imports

2. IMPORT PATHS:
   - Use @/components/... instead of ./src/components/...
   - Use @/api/entities/... instead of ./src/entities/...
   - Use @/pages/... instead of ./src/pages/...

3. FILE NAMING CONVENTIONS:
   - Pages: pages/PageName.js (not pages/PageName/index.js)
   - Components: components/category/ComponentName.jsx
   - Entities: entities/EntityName.json
   - Layout: layout.js (lowercase, not Layout.js)

4. ENTITY SYSTEM:
   - Entities are JSON schemas that define database structure
   - Located in entities/ directory as .json files
   - Automatically generate SDK functions for CRUD operations
   - Import with: import { EntityName } from '@/api/entities/EntityName'

5. INTEGRATION SYSTEM:
   - External APIs are in integrations/ directory
   - Import with: import { FunctionName } from '@/api/integrations/PackageName'

FILE STRUCTURE RULES FOR THIS PROJECT
=====================================

ALLOWED FILE PATHS ONLY:
- entities/EntityName.json
- pages/PageName.js
- components/category/ComponentName.jsx
- layout.js
- globals.css

FORBIDDEN PATHS:
- src/anything
- public/anything
- Any other root directory files except layout.js and globals.css

CURRENT PROJECT STRUCTURE
=========================

entities/ (Database Models - JSON Schema)
├── AIPromoter.json          # AI virtual promoter definitions
├── Lead.json                # Customer/lead management
├── Campaign.json            # Marketing campaigns
├── Interaction.json         # Customer interaction tracking
├── Venue.json               # Venue/location management
├── EventQR.json            # QR ticketing system
├── UsageTracking.json      # Platform usage analytics
├── PurchaseTracking.json   # Revenue tracking
├── CustomerLoyalty.json    # Gamification system
├── LeadGroup.json          # Customer segmentation
├── ConversationFlow.json   # AI conversation logic
├── PaymentLink.json        # Payment processing
├── SecurityRestrictions.json # Access control
├── PricingPlan.json        # Subscription management
├── MessagePackage.json     # Message credit system
├── LoyaltyTransaction.json # Points tracking
├── LeadProfile.json        # Customer intelligence
├── LeadRating.json         # Customer scoring
└── User.json               # User settings and config

pages/ (Main Application Views)
├── Dashboard.js            # Main control center
├── Leads.js               # Customer management
├── Campaigns.js           # Campaign management  
├── Promoters.js           # AI promoter management
├── Conversations.js       # Message center
├── Analytics.js           # Business intelligence
├── Ticketing.js           # Event ticketing
├── Loyalty.js             # Gamification dashboard
├── Venues.js              # Venue management
├── Settings.js            # Platform configuration
├── Pricing.js             # Subscription plans  
├── Help.js                # Support and help
└── Documentation.js       # Technical documentation

components/ (Reusable UI Components)
├── ui/                    # Base Shadcn/UI components
├── dashboard/             # Dashboard-specific components
│   ├── StatsGrid.js
│   ├── RevenueChart.js
│   ├── CampaignPerformance.js
│   ├── PromoterPerformance.js
│   ├── RecentActivity.js
│   ├── TopLeads.js
│   ├── AIControlCenter.js
│   ├── NotificationCenter.js
│   └── QuickActions.js
├── leads/                 # Lead management components
│   ├── LeadsStats.js
│   ├── LeadsTable.js
│   ├── LeadsToolbar.js
│   ├── ImportLeadsDialog.jsx
│   ├── LeadEditPanel.jsx
│   ├── IntelligentLeadCreationDialog.jsx
│   └── LeadGroupsManager.jsx
├── campaigns/             # Campaign management
├── promoters/             # AI promoter components  
├── conversations/         # Chat and messaging
├── analytics/             # Analytics and reporting
├── ticketing/             # QR ticketing system
├── ai/                    # AI-related components
├── voice/                 # Voice message handling
├── integrations/          # Third-party integrations
├── help/                  # Help and support
├── lib/                   # Shared utilities
│   └── translations.js    # Multi-language support
└── docs/                  # Documentation files
    ├── README
    ├── TODO.md
    └── agents.md

layout.js                  # Main application layout wrapper

DEVELOPMENT RULES AND GUIDELINES
===============================

1. ENTITY DEVELOPMENT:
   - Entities are JSON schema files defining data structure
   - Always include required fields array
   - Use proper JSON schema types and validation
   - Built-in fields (id, created_date, updated_date, created_by) are automatic

Example Entity:
```json
{
  "name": "ExampleEntity",
  "type": "object", 
  "properties": {
    "title": {
      "type": "string",
      "description": "The title"
    },
    "status": {
      "type": "string", 
      "enum": ["active", "inactive"],
      "default": "active"
    }
  },
  "required": ["title"]
}
```

2. ENTITY SDK USAGE:
   ```javascript
   import { EntityName } from '@/api/entities/EntityName';
   
   // CRUD Operations
   const items = await EntityName.list();
   const filtered = await EntityName.filter({status: 'active'}, '-created_date', 100);
   const newItem = await EntityName.create({title: "New Item"});
   const updated = await EntityName.update(id, {status: 'inactive'});
   await EntityName.delete(id);
   
   // User Operations
   import { User } from '@/api/entities';
   const currentUser = await User.me();
   await User.updateMyUserData({settings: {...}});
   ```

3. COMPONENT DEVELOPMENT:
   - Always export default
   - Component name must match filename
   - Use functional components with hooks
   - Import UI components from @/components/ui/
   - Use Tailwind CSS for styling
   - Use Lucide React for icons (verify icon exists before using)

4. PAGE DEVELOPMENT:
   - Pages are full-screen React components
   - Handle loading states and error handling
   - Responsive design is mandatory
   - Use proper error boundaries

5. INTEGRATION USAGE:
   ```javascript
   import { InvokeLLM, UploadFile, SendEmail } from '@/api/integrations';
   
   const aiResponse = await InvokeLLM({
     prompt: "Your prompt here",
     add_context_from_internet: true,
     response_json_schema: {type: "object", properties: {...}}
   });
   ```

6. LAYOUT SYSTEM:
   - layout.js receives children (current page) and currentPageName props
   - Use for navigation, headers, footers, common UI elements
   - Contains sidebar navigation with createPageUrl() for routing

STYLING AND UI GUIDELINES
=========================

1. DESIGN SYSTEM:
   - Color Scheme: Dark theme with purple/pink gradients
   - Primary Colors: Purple (#8b5cf6), Pink (#ec4899), Slate (#0f172a)
   - Use glow-effect class for special highlights
   - Use neon-text class for important headings

2. RESPONSIVE DESIGN:
   - Mobile-first approach
   - Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
   - Test on all screen sizes
   - Sidebar should collapse on mobile

3. COMPONENT LIBRARY:
   - Use Shadcn/UI components from @/components/ui/
   - Available components: Button, Card, Input, Dialog, Tabs, Badge, etc.
   - Consistent styling across all components

4. ANIMATIONS:
   - Use Framer Motion for complex animations
   - CSS transitions for simple hover effects
   - Loading states with Skeleton components

MULTILINGUAL SUPPORT
====================

The platform supports Hebrew and English with RTL support:

```javascript
import { useTranslation } from '@/components/lib/translations';

const { t } = useTranslation();
const text = t('English Text', 'Hebrew Text');
```

RTL Support:
- Use dir="rtl" for Hebrew content
- Test layouts in both directions
- Icons and alignments should flip appropriately

ERROR HANDLING AND BEST PRACTICES
=================================

1. ERROR HANDLING:
   - Don't use try/catch unless specifically needed
   - Let errors bubble up for proper error tracking
   - Show user-friendly error messages
   - Use loading states for async operations

2. PERFORMANCE:
   - Lazy load heavy components
   - Optimize images and assets
   - Use React.memo for expensive components
   - Implement proper pagination for large data sets

3. ACCESSIBILITY:
   - Use semantic HTML
   - Proper ARIA labels
   - Keyboard navigation support
   - Color contrast compliance

4. SECURITY:
   - Never expose API keys in frontend code
   - Validate all user inputs
   - Use proper authentication checks
   - Follow GDPR compliance requirements

COMMON DEVELOPMENT TASKS
========================

ADDING A NEW ENTITY:
1. Create entities/EntityName.json with proper schema
2. Use the entity in components with import { EntityName } from '@/api/entities/EntityName'
3. Implement CRUD operations as needed

CREATING A NEW PAGE:
1. Create pages/PageName.js
2. Export default function matching filename
3. Add navigation link in layout.js
4. Use createPageUrl('PageName') for routing

ADDING NEW COMPONENT:
1. Create components/category/ComponentName.jsx
2. Export default component
3. Import and use in pages or other components

MODIFYING EXISTING FEATURES:
1. Identify affected files using directory structure above
2. Test thoroughly across different screen sizes
3. Ensure RTL compatibility for Hebrew users

INTEGRATION WITH EXTERNAL APIS:
1. Use existing integrations from @/api/integrations/Core
2. Don't create new integration files (not allowed)
3. Handle API responses properly
4. Implement proper error handling

DEBUGGING COMMON ISSUES
=======================

1. IMPORT ERRORS:
   - Check file path starts with entities/, pages/, or components/
   - Use @/ prefix for imports
   - Verify component/entity name matches filename

2. ENTITY NOT FOUND:
   - Ensure entity JSON file exists in entities/
   - Check JSON syntax is valid
   - Verify entity name matches file name

3. LAYOUT ISSUES:
   - Remember layout.js receives children and currentPageName
   - Use createPageUrl() for navigation
   - Test responsive behavior

4. COMPONENT NOT RENDERING:
   - Ensure default export
   - Check for JavaScript syntax errors
   - Verify all imports are correct

5. STYLING ISSUES:
   - Use Tailwind classes correctly
   - Check responsive breakpoints
   - Verify color scheme consistency

TESTING AND QUALITY ASSURANCE
=============================

Before considering any task complete:

1. FUNCTIONALITY TESTING:
   - Test all user interactions
   - Verify data persistence
   - Check error handling

2. RESPONSIVE TESTING:
   - Test on mobile (320px+)
   - Test on tablet (768px+)  
   - Test on desktop (1024px+)

3. ACCESSIBILITY TESTING:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

4. MULTILINGUAL TESTING:
   - Test Hebrew RTL layout
   - Verify translations work
   - Check text overflow in both languages

PROJECT-SPECIFIC CONTEXT
========================

BUSINESS DOMAIN:
This is a nightlife marketing platform for clubs, bars, and entertainment venues. Key concepts:

- AI Promoters: Virtual agents that chat with customers via WhatsApp/social media
- Leads: Potential customers with rich profiles and scoring
- Campaigns: Marketing campaigns run by AI promoters  
- Venues: Physical locations (clubs, bars, events)
- QR Ticketing: Digital tickets with QR codes for events
- Loyalty System: Gamification with points and tiers

USER TYPES:
- Venue Owners: Manage multiple locations and events
- Marketing Managers: Create campaigns and analyze performance
- Promoters: Oversee AI promoter performance
- Customers: End users who interact with AI promoters

KEY FEATURES:
- Real-time conversation monitoring
- Customer intelligence and profiling
- Multi-platform messaging (WhatsApp, Facebook, Instagram)
- Advanced analytics and reporting
- QR code generation and scanning
- Loyalty points and gamification

TECHNICAL PRIORITIES:
1. Mobile responsiveness (many users on mobile)
2. Real-time updates (conversations, notifications)
3. Performance (large datasets, real-time features)
4. Multilingual support (Hebrew/English)
5. Security and compliance (customer data protection)

CURRENT DEVELOPMENT STATUS
==========================

STABLE FEATURES:
- Basic dashboard and navigation
- Lead management with import/export
- AI promoter creation and management
- Campaign creation and tracking
- Basic analytics and reporting
- Multi-language support
- QR ticketing system

IN DEVELOPMENT:
- Advanced AI conversation builder
- Real-time conversation monitoring
- Voice message support
- Advanced customer segmentation
- Mobile application

KNOWN ISSUES:
- See TODO.md for comprehensive bug list
- Mobile layout needs improvements
- Performance optimization needed
- Some integrations still in development

WHEN WORKING ON THIS PROJECT
============================

DO:
- Follow the Base44 platform file structure exactly
- Use the entity system for all data operations
- Implement responsive design from the start
- Test Hebrew RTL layout
- Use existing UI components from Shadcn
- Keep security and privacy in mind
- Write clean, readable code with proper comments
- Test across different browsers and devices

DON'T:
- Create src/ directory or reference it
- Use unauthorized file paths
- Ignore mobile responsiveness
- Skip RTL testing for Hebrew
- Create custom UI components when Shadcn alternatives exist
- Expose sensitive information in frontend
- Use try/catch unnecessarily
- Break existing functionality when making changes

GETTING HELP
============

1. Check existing components for patterns and examples
2. Review entity schemas to understand data structure  
3. Look at similar features in other pages
4. Check TODO.md for known issues and planned features
5. Review this agents.md file when unsure about structure

Remember: This platform has a unique architecture. Always double-check file paths and import statements before proceeding with development tasks.

SUCCESS METRICS
===============

Your development work should aim to:
- Maintain 99.9% uptime
- Keep page load times under 2 seconds
- Achieve mobile responsiveness score of 95%+
- Maintain code quality and readability
- Follow established patterns and conventions
- Ensure cross-browser compatibility
- Support both Hebrew and English users seamlessly

END OF INSTRUCTIONS
===================

Good luck with development! Remember to always start by understanding the existing code structure and patterns before making changes.
