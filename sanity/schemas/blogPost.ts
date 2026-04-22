import { defineField, defineType } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Genetic Literacy', value: 'genetic-literacy' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Research', value: 'research' },
          { title: 'Stories', value: 'stories' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'readMinutes',
      title: 'Read time (minutes)',
      type: 'number',
      validation: (r) => r.min(1).max(60),
      initialValue: 5,
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Pin to the top of the blog listing',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'heroImage',
      date: 'publishedAt',
    },
    prepare({ title, subtitle, media, date }) {
      const d = date ? new Date(date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Draft';
      return { title, subtitle: `${subtitle ?? 'uncategorised'} · ${d}`, media };
    },
  },
});
