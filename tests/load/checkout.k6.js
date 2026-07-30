/**
 * Full-stack HTTP load test for the checkout endpoints (k6).
 *
 * NOTE ON AUTH: /api/checkout requires a next-auth **JWT** session. k6 can't
 * mint that, so you must supply a real session cookie captured from a logged-in
 * browser (DevTools → Application → Cookies → authjs.session-token), plus valid
 * packageId + addressId for that user. Leave Razorpay keys unset so the app runs
 * in RAZORPAY_MOCK mode and no real payment is attempted.
 *
 * Run:
 *   k6 run \
 *     -e BASE_URL=http://localhost:3000 \
 *     -e SESSION_COOKIE='authjs.session-token=...' \
 *     -e PACKAGE_ID=pkg_xxx -e ADDRESS_ID=addr_xxx \
 *     tests/load/checkout.k6.js
 *
 * Ramps 0→100 virtual users. Thresholds fail the run if p95 > 800ms or errors > 1%.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SESSION_COOKIE = __ENV.SESSION_COOKIE || '';
const PACKAGE_ID = __ENV.PACKAGE_ID || '';
const ADDRESS_ID = __ENV.ADDRESS_ID || '';

export const options = {
  scenarios: {
    ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 25 },
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const headers = { 'Content-Type': 'application/json', Cookie: SESSION_COOKIE };
  const body = JSON.stringify({
    packageId: PACKAGE_ID,
    addressId: ADDRESS_ID,
    slotDate: '2026-08-15',
    slotWindow: 'MORNING',
    fulfillmentMode: 'AT_HOME_PHLEBOTOMIST',
  });

  const res = http.post(`${BASE_URL}/api/checkout`, body, { headers });
  check(res, {
    'checkout 200': (r) => r.status === 200,
    'has razorpay orderId': (r) => {
      try {
        return !!r.json('data.razorpay.orderId');
      } catch {
        return false;
      }
    },
  });
  sleep(1);
}
