import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Promoters from "./Promoters";

import Leads from "./Leads";

import Campaigns from "./Campaigns";

import Analytics from "./Analytics";

import Settings from "./Settings";

import Conversations from "./Conversations";

import Pricing from "./Pricing";

import Ticketing from "./Ticketing";

import Loyalty from "./Loyalty";

import Help from "./Help";

import Documentation from "./Documentation";

import SocialProspecting from "./SocialProspecting";

import ProductionReadiness from "./ProductionReadiness";

import ProductionPlan from "./ProductionPlan";

import SocialIntegrations from "./SocialIntegrations";

import SystemCheck from "./SystemCheck";

import CustomerPortal from "./CustomerPortal";

import PublicCustomerPortal from "./PublicCustomerPortal";

import UserProfile from "./UserProfile";

import EventsPortal from "./EventsPortal";

import EventDetails from "./EventDetails";

import SuperAdmin from "./SuperAdmin";

import VoiceAISystem from "./VoiceAISystem";

import SEOControlCenter from "./SEOControlCenter";

import TicketingIntegrations from "./TicketingIntegrations";

import SharedTables from "./SharedTables";

import TicketingSales from "./TicketingSales";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Promoters: Promoters,
    
    Leads: Leads,
    
    Campaigns: Campaigns,
    
    Analytics: Analytics,
    
    Settings: Settings,
    
    Conversations: Conversations,
    
    Pricing: Pricing,
    
    Ticketing: Ticketing,
    
    Loyalty: Loyalty,
    
    Help: Help,
    
    Documentation: Documentation,
    
    SocialProspecting: SocialProspecting,
    
    ProductionReadiness: ProductionReadiness,
    
    ProductionPlan: ProductionPlan,
    
    SocialIntegrations: SocialIntegrations,
    
    SystemCheck: SystemCheck,
    
    CustomerPortal: CustomerPortal,
    
    PublicCustomerPortal: PublicCustomerPortal,
    
    UserProfile: UserProfile,
    
    EventsPortal: EventsPortal,
    
    EventDetails: EventDetails,
    
    SuperAdmin: SuperAdmin,
    
    VoiceAISystem: VoiceAISystem,
    
    SEOControlCenter: SEOControlCenter,
    
    TicketingIntegrations: TicketingIntegrations,
    
    SharedTables: SharedTables,
    
    TicketingSales: TicketingSales,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Promoters" element={<Promoters />} />
                
                <Route path="/Leads" element={<Leads />} />
                
                <Route path="/Campaigns" element={<Campaigns />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Conversations" element={<Conversations />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/Ticketing" element={<Ticketing />} />
                
                <Route path="/Loyalty" element={<Loyalty />} />
                
                <Route path="/Help" element={<Help />} />
                
                <Route path="/Documentation" element={<Documentation />} />
                
                <Route path="/SocialProspecting" element={<SocialProspecting />} />
                
                <Route path="/ProductionReadiness" element={<ProductionReadiness />} />
                
                <Route path="/ProductionPlan" element={<ProductionPlan />} />
                
                <Route path="/SocialIntegrations" element={<SocialIntegrations />} />
                
                <Route path="/SystemCheck" element={<SystemCheck />} />
                
                <Route path="/CustomerPortal" element={<CustomerPortal />} />
                
                <Route path="/PublicCustomerPortal" element={<PublicCustomerPortal />} />
                
                <Route path="/UserProfile" element={<UserProfile />} />
                
                <Route path="/EventsPortal" element={<EventsPortal />} />
                
                <Route path="/EventDetails" element={<EventDetails />} />
                
                <Route path="/SuperAdmin" element={<SuperAdmin />} />
                
                <Route path="/VoiceAISystem" element={<VoiceAISystem />} />
                
                <Route path="/SEOControlCenter" element={<SEOControlCenter />} />
                
                <Route path="/TicketingIntegrations" element={<TicketingIntegrations />} />
                
                <Route path="/SharedTables" element={<SharedTables />} />
                
                <Route path="/TicketingSales" element={<TicketingSales />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}