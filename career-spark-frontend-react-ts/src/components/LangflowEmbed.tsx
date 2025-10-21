import { useEffect } from 'react';

export default function LangflowEmbed() {
  useEffect(() => {
    const scriptId = 'langflow-embed-script';

    // Chỉ thêm script nếu chưa có
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Cleanup nếu component unmount
    return () => {
      // không xóa script để tránh load lại mỗi lần
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <langflow-chat
          window_title="CareerSpark AI Assistant"
          flow_id="b7fbf703-5ac6-46aa-9fba-ff1a8a02b112"
          host_url="http://careersparklangflowai0910.southeastasia.azurecontainer.io:7860"
          chat_position="top-left"
          height="600"
          width="400">
        </langflow-chat>
        `,
      }}
    />
  );
}
