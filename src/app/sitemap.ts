
import { MetadataRoute } from 'next';
import { getPosts } from '@/app/admin/blog/_actions/post-actions';
import { getServices } from '@/app/admin/services/_actions/service-actions';
import { getProjects } from '@/app/admin/projects/_actions/project-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

  // Get all dynamic content
  const blogPosts = await getPosts();
  const services = await getServices();
  const projects = await getProjects();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: `${siteUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map(({ slug, date }) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map(({ slug }) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map(({ slug, completedDate }) => ({
    url: `${siteUrl}/portfolio/${slug}`,
    lastModified: new Date(), // Ideally, use a 'lastModified' date from the project data
    changeFrequency: 'weekly',
    priority: 0.9
  }));


  return [...staticPages, ...blogPostEntries, ...serviceEntries, ...projectEntries];
}
