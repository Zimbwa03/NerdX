import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPublicSiteOrigin } from '../services/api/config';

type SeoMeta = {
  title: string;
  description: string;
  robots?: string;
};

const DEFAULT_META: SeoMeta = {
  title: 'NerdX - AI-Powered Learning for ZIMSEC & Cambridge Students',
  description:
    'NerdX helps students learn faster with AI tutoring, virtual labs, exam practice, progress tracking, and verified teachers.',
  robots: 'index,follow',
};

function getSeoMeta(pathname: string): SeoMeta {
  if (pathname === '/') {
    return DEFAULT_META;
  }

  if (pathname === '/login') {
    return {
      title: 'Log In - NerdX',
      description: 'Log in to NerdX to continue your AI-powered study sessions, lessons, and exam preparation.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname === '/register') {
    return {
      title: 'Create Account - NerdX',
      description: 'Create your NerdX account to access AI tutoring, virtual labs, exam prep, and teacher support.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-email') {
    return {
      title: 'Account Access - NerdX',
      description: 'Manage your NerdX account access, password reset, and email verification.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname.startsWith('/app')) {
    return {
      title: 'NerdX App',
      description: 'Your NerdX dashboard for learning, progress, tutoring, and study tools.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname.startsWith('/school')) {
    return {
      title: 'NerdX School Portal',
      description: 'Secure school and teacher portal for NerdX partner institutions.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname.startsWith('/admin')) {
    return {
      title: 'NerdX Admin',
      description: 'Administrative access for NerdX operations.',
      robots: 'noindex,nofollow',
    };
  }

  return {
    title: 'NerdX',
    description: DEFAULT_META.description,
    robots: 'noindex,nofollow',
  };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = getSeoMeta(location.pathname);
    const canonicalUrl = `${getPublicSiteOrigin()}${location.pathname}`;

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', meta.robots || DEFAULT_META.robots || 'index,follow');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', `${getPublicSiteOrigin()}/logo.png`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', `${getPublicSiteOrigin()}/logo.png`);
    upsertLink('canonical', canonicalUrl);
  }, [location.pathname]);

  return null;
}
