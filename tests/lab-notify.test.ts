import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Proves the lab-notification flow that was previously missing:
 * when an order is paid, the processing lab is linked onto the order AND
 * informed, exactly once, without ever throwing into the payment path.
 *
 * Prisma and the mailer are mocked, so these run with no database.
 */

// vi.mock is hoisted above imports, so the mock objects must be created via
// vi.hoisted (not plain top-level consts) to avoid the temporal-dead-zone.
const { prisma, sendMail } = vi.hoisted(() => ({
  prisma: {
    order: { findUnique: vi.fn(), updateMany: vi.fn() },
    lab: { findFirst: vi.fn() },
    notification: { create: vi.fn() },
    orderEvent: { create: vi.fn() },
  },
  sendMail: vi.fn(),
}));
vi.mock('@/server/prisma', () => ({ prisma }));
vi.mock('@/lib/mailer', () => ({ sendMail, isMailConfigured: () => true }));

import { linkLabAndNotify, LAB_NOTIFY_TEMPLATE } from '@/features/lab';

function makeOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order_1',
    orderNumber: 'KYG-2026-000001',
    labId: null,
    partnerId: null,
    fulfillmentMode: 'AT_HOME_PHLEBOTOMIST',
    slotDate: new Date('2026-08-01T00:00:00.000Z'),
    slotWindow: 'MORNING',
    couponCode: null,
    package: { name: 'Ancestors In Me' },
    user: { name: 'Asha K', email: 'asha@example.com' },
    address: { city: 'Gurugram', pincode: '122001' },
    ...overrides,
  };
}

function makeLab(overrides: Record<string, unknown> = {}) {
  return {
    id: 'lab_saket',
    partnerId: 'partner_neotech',
    name: 'Neotech Saket',
    contactEmail: 'saket@neotech.in',
    partner: { name: 'Neotech Diagnostics', contactEmail: 'partnerships@neotech.in' },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  prisma.order.updateMany.mockResolvedValue({ count: 1 });
  prisma.notification.create.mockResolvedValue({ id: 'notif_1' });
  prisma.orderEvent.create.mockResolvedValue({ id: 'evt_1' });
  sendMail.mockResolvedValue({ ok: true, delivered: true, providerId: 'smtp-msg-1' });
});

describe('linkLabAndNotify', () => {
  it('links the lab and emails it when an order is paid (the core fix)', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(makeLab());

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('notified');
    expect(res.labId).toBe('lab_saket');

    // Order got linked to lab + partner, guarded on labId:null (race-safe).
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 'order_1', labId: null },
      data: { labId: 'lab_saket', partnerId: 'partner_neotech' },
    });

    // The lab was actually emailed, at its own contact address.
    expect(sendMail).toHaveBeenCalledTimes(1);
    const mailArg = sendMail.mock.calls[0][0];
    expect(mailArg.to).toBe('saket@neotech.in');
    expect(mailArg.subject).toContain('KYG-2026-000001');
    expect(mailArg.text).toContain('Ancestors In Me');

    // A comms-log Notification row was written as SENT.
    expect(prisma.notification.create).toHaveBeenCalledTimes(1);
    const notif = prisma.notification.create.mock.calls[0][0].data;
    expect(notif.template).toBe(LAB_NOTIFY_TEMPLATE);
    expect(notif.channel).toBe('EMAIL');
    expect(notif.to).toBe('saket@neotech.in');
    expect(notif.status).toBe('SENT');
  });

  it('is idempotent: does nothing if a lab is already linked', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder({ labId: 'lab_saket' }));

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('skipped');
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(prisma.notification.create).not.toHaveBeenCalled();
  });

  it('is race-safe: does not double-send when the concurrent claim loses', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(makeLab());
    prisma.order.updateMany.mockResolvedValue({ count: 0 }); // other path linked first

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('skipped');
    expect(sendMail).not.toHaveBeenCalled();
    expect(prisma.notification.create).not.toHaveBeenCalled();
  });

  it('records a skip (no crash) when no active lab is configured', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(null); // no default and no active lab

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('no-lab');
    expect(prisma.orderEvent.create).toHaveBeenCalledTimes(1);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('still links the lab and logs FAILED when the email send fails', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(makeLab());
    sendMail.mockResolvedValue({ ok: false, delivered: false, error: 'smtp down' });

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('notified'); // payment path must not break
    expect(prisma.order.updateMany).toHaveBeenCalled();
    const notif = prisma.notification.create.mock.calls[0][0].data;
    expect(notif.status).toBe('FAILED');
    expect(notif.errorMessage).toBe('smtp down');
  });

  it('logs QUEUED when SMTP is unconfigured (mailer skips send)', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(makeLab());
    sendMail.mockResolvedValue({ ok: true, delivered: false, skipped: true });

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('notified');
    const notif = prisma.notification.create.mock.calls[0][0].data;
    expect(notif.status).toBe('QUEUED');
    expect(notif.sentAt).toBeNull();
  });

  it('falls back to the partner contact email when the lab has none', async () => {
    prisma.order.findUnique.mockResolvedValue(makeOrder());
    prisma.lab.findFirst.mockResolvedValue(makeLab({ contactEmail: null }));

    await linkLabAndNotify('order_1');

    expect(sendMail.mock.calls[0][0].to).toBe('partnerships@neotech.in');
  });

  it('never throws: returns error status if the DB read blows up', async () => {
    prisma.order.findUnique.mockRejectedValue(new Error('db unreachable'));

    const res = await linkLabAndNotify('order_1');

    expect(res.status).toBe('error');
    expect(res.detail).toContain('db unreachable');
  });
});
