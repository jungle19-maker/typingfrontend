import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ title, description, keywords, url }) => {
    const siteTitle = 'KeySkill';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Practice online typing exams for Indian government jobs. Improve speed and accuracy.'} />
            <meta name="keywords" content={keywords || 'typing test, typing exam, government typing, ssc typing, delhi police typing, hindi typing'} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || window.location.href} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || window.location.href} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />

            <link rel="canonical" href={url || window.location.href} />
        </Helmet>
    );
};

export default SEOHelmet;
