import { OpenApiGeneratorV31, OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  packageCreate,
  packageUpdate,
  counsellorCreate,
  counsellorUpdate,
  userRoleUpdate,
  agentCreate,
  agentUpdate,
  partnerCreate,
  partnerUpdate,
  orderStatusUpdate,
  orderAssignAgent,
  couponCreate,
  couponUpdate,
  serviceAreaCreate,
  serviceAreaUpdate,
  serviceAreaBulk,
} from '@/lib/validators';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------

const SuccessEnvelope = <T extends z.ZodTypeAny>(data: T) => z.object({ ok: z.literal(true), data });

const ErrorEnvelope = z.object({
  ok: z.literal(false),
  error: z.string(),
  issues: z.array(z.any()).optional(),
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  summary: 'Register a new consumer account (USER role)',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            password: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: 'User created', content: { 'application/json': { schema: z.any() } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorEnvelope } } },
  },
});

// ---------------------------------------------------------------------------
// Helper: register standard CRUD for a resource
// ---------------------------------------------------------------------------

function registerCrud<TCreate extends z.ZodTypeAny, TUpdate extends z.ZodTypeAny>(cfg: {
  tag: string;
  basePath: string;
  listDescription: string;
  create: TCreate;
  update: TUpdate;
  pathParam?: string;
}) {
  const param = cfg.pathParam ?? 'id';

  registry.registerPath({
    method: 'get',
    path: cfg.basePath,
    summary: cfg.listDescription,
    tags: [cfg.tag],
    responses: {
      200: { description: 'List', content: { 'application/json': { schema: SuccessEnvelope(z.array(z.any())) } } },
      401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorEnvelope } } },
      403: { description: 'Forbidden', content: { 'application/json': { schema: ErrorEnvelope } } },
    },
  });

  registry.registerPath({
    method: 'post',
    path: cfg.basePath,
    summary: `Create ${cfg.tag.toLowerCase()}`,
    tags: [cfg.tag],
    request: {
      body: { content: { 'application/json': { schema: cfg.create } } },
    },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
      422: { description: 'Validation error', content: { 'application/json': { schema: ErrorEnvelope } } },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: `${cfg.basePath}/{${param}}`,
    summary: `Update ${cfg.tag.toLowerCase()}`,
    tags: [cfg.tag],
    request: {
      params: z.object({ [param]: z.string() }) as any,
      body: { content: { 'application/json': { schema: cfg.update } } },
    },
    responses: {
      200: { description: 'Updated', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: `${cfg.basePath}/{${param}}`,
    summary: `Archive / deactivate ${cfg.tag.toLowerCase()}`,
    tags: [cfg.tag],
    request: { params: z.object({ [param]: z.string() }) as any },
    responses: {
      200: { description: 'Archived', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
    },
  });
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

registerCrud({
  tag: 'Packages',
  basePath: '/api/admin/packages',
  listDescription: 'List all packages',
  create: packageCreate,
  update: packageUpdate,
});
registerCrud({
  tag: 'Counsellors',
  basePath: '/api/admin/counsellors',
  listDescription: 'List all counsellors',
  create: counsellorCreate,
  update: counsellorUpdate,
});
registerCrud({
  tag: 'Agents',
  basePath: '/api/admin/agents',
  listDescription: 'List all collection agents',
  create: agentCreate,
  update: agentUpdate,
});
registerCrud({
  tag: 'Partners',
  basePath: '/api/admin/partners',
  listDescription: 'List all lab partners',
  create: partnerCreate,
  update: partnerUpdate,
});
registerCrud({
  tag: 'Coupons',
  basePath: '/api/admin/coupons',
  listDescription: 'List all coupons',
  create: couponCreate,
  update: couponUpdate,
});

// ---------------------------------------------------------------------------
// Users (list + role change only)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/admin/users',
  summary: 'List users (search + role filter)',
  tags: ['Users'],
  request: {
    query: z.object({
      q: z.string().optional(),
      role: z.enum(['USER', 'AGENT', 'COUNSELLOR', 'PARTNER', 'ADMIN']).optional(),
      skip: z.coerce.number().optional(),
      take: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'Paged users', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/admin/users/{id}/role',
  summary: "Change a user's role",
  tags: ['Users'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: userRoleUpdate } } },
  },
  responses: {
    200: { description: 'Role updated', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/admin/orders',
  summary: 'List orders with filters',
  tags: ['Orders'],
  request: {
    query: z.object({
      q: z.string().optional(),
      status: z.string().optional(),
      agentId: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      skip: z.coerce.number().optional(),
      take: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: { description: 'Paged orders', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/admin/orders/{id}/status',
  summary: 'Update order status (logs OrderEvent)',
  tags: ['Orders'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: orderStatusUpdate } } },
  },
  responses: {
    200: { description: 'Status updated', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/admin/orders/{id}/assign-agent',
  summary: 'Assign a collection agent to an order',
  tags: ['Orders'],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: orderAssignAgent } } },
  },
  responses: {
    200: { description: 'Agent assigned', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

// ---------------------------------------------------------------------------
// Service area (special bulk endpoint)
// ---------------------------------------------------------------------------

registry.registerPath({
  method: 'get',
  path: '/api/admin/service-area',
  summary: 'List all service-area pincodes',
  tags: ['ServiceArea'],
  responses: { 200: { description: 'List', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } } },
});

registry.registerPath({
  method: 'post',
  path: '/api/admin/service-area',
  summary: 'Create single pincode OR bulk upsert (pass {pincodes: [...]})',
  tags: ['ServiceArea'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.union([serviceAreaCreate, serviceAreaBulk]),
        },
      },
    },
  },
  responses: {
    201: { description: 'Created / upserted', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/admin/service-area/{pincode}',
  summary: 'Update a pincode (toggle active, rename area, etc.)',
  tags: ['ServiceArea'],
  request: {
    params: z.object({ pincode: z.string() }),
    body: { content: { 'application/json': { schema: serviceAreaUpdate } } },
  },
  responses: { 200: { description: 'Updated', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/admin/service-area/{pincode}',
  summary: 'Hard-delete a pincode (only if no orders reference it)',
  tags: ['ServiceArea'],
  request: { params: z.object({ pincode: z.string() }) },
  responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: SuccessEnvelope(z.any()) } } } },
});

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

export function getOpenApiSpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'KYG Admin API',
      version: '0.1.0',
      description:
        'Admin-only endpoints. All require an authenticated session with role ADMIN (most) or COUNSELLOR/PARTNER (scoped). Sign in via /login first - session cookie is reused here.',
    },
    servers: [{ url: '/' }],
    tags: [
      { name: 'Auth', description: 'Sign-up & NextAuth callbacks' },
      { name: 'Packages', description: 'Test catalog CRUD' },
      { name: 'Counsellors', description: 'Genetic counsellor directory' },
      { name: 'Agents', description: 'Collection agents' },
      { name: 'Partners', description: 'Lab partners that run the tests' },
      { name: 'Users', description: 'User list + role assignment' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Coupons', description: 'Promo codes' },
      { name: 'ServiceArea', description: 'Delhi NCR pincodes' },
    ],
  });
}
