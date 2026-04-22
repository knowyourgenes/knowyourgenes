import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. Genetic Counsellor, KYG or Staff Scientist',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'userId',
      title: 'Linked User ID (optional)',
      type: 'string',
      description: 'Prisma User.id if this author is also a counsellor in KYG',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
