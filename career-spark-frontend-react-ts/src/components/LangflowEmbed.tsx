import { useEffect } from 'react';

export default function LangflowEmbed() {
  useEffect(() => {
    const scriptId = 'langflow-embed-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {};
  }, []);

  // 🔹 Trỏ về domain FE (proxy qua Vercel)
  const hostUrl = 'https://career-spark-frontend-react-ts.vercel.app/langflow';

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <langflow-chat
          window_title="CareerSpark AI Assistant"
          flow_id="94281a39-525e-4162-ac28-8c1d071476b4"
          host_url="${hostUrl}"
          chat_position="top-left"
          height="600"
          width="400">
        </langflow-chat>
        `,
      }}
    />
  );
}
