'use client';

import { useEffect } from 'react';

const SWAGGER_VERSION = '5.32.4';

export default function SwaggerViewer() {
  useEffect(() => {
    // Stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://unpkg.com/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui.css`;
    document.head.appendChild(link);

    // Bundle
    const script = document.createElement('script');
    script.src = `https://unpkg.com/swagger-ui-dist@${SWAGGER_VERSION}/swagger-ui-bundle.js`;
    script.async = true;
    script.onload = () => {
      // @ts-expect-error — SwaggerUIBundle is injected globally
      window.ui = window.SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        docExpansion: 'list',
        filter: true,
        tryItOutEnabled: true,
        withCredentials: true,
        requestInterceptor: (req: RequestInit & { credentials?: RequestCredentials }) => {
          req.credentials = 'include';
          return req;
        },
      });
    };
    document.body.appendChild(script);

    return () => {
      link.remove();
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div id="swagger-ui" />
    </div>
  );
}
