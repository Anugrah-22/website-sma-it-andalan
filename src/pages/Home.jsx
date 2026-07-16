import React from 'react';
import Hero from '../components/Hero';
import QuickLinks from '../components/QuickLinks';
import PrincipalStats from '../components/PrincipalStats';
import InformationCenter from '../components/InformationCenter';
import Gallery from '../components/Gallery';

export default function Home({ news, announcements, stats, gallery, db, appId }) {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <Hero db={db} appId={appId} />
            
            {/* 
                -mt-10 / md:-mt-16: Memberikan overlap yang halus (tidak menabrak)
                agar QuickLinks terlihat menyatu dengan Hero yang melengkung.
            */}
            <div className="relative z-20 px-4 w-full max-w-7xl mx-auto -mt-10 md:-mt-16">
                <QuickLinks />
            </div>

            {/* Main Content */}
            <div className="pt-6 md:pt-10">
                <PrincipalStats stats={stats} />
                <InformationCenter news={news} announcements={announcements} />
                <Gallery gallery={gallery} />
            </div>
        </div>
    );
}