import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      rating: 5,
      text: 'Test RIASEC giúp tôi hiểu rõ hơn về bản thân và chọn được ngành phù hợp. Roadmap cá nhân hóa rất chi tiết!',
      name: 'Nguyễn Minh Anh',
      title: 'Sinh viên năm 3',
    },
    {
      rating: 5,
      text: 'Diễn đàn rất hữu ích, tôi đã học được nhiều kinh nghiệm từ các anh chị đi trước. Cảm ơn CareerPath!',
      name: 'Trần Văn Đức',
      title: 'Fresh Graduate',
    },
    {
      rating: 5,
      text: 'Tôi thường xuyên đọc tin tức nghề nghiệp ở đây để cập nhật xu hướng thị trường. Nội dung rất chất lượng.',
      name: 'Lê Thị Hoa',
      title: 'Chuyên viên HR',
    },
  ];

  const renderStars = (rating: number) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400">
          ⭐
        </span>
      ));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Người Dùng Nói Gì Về CareerPath
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hàng ngàn người đã tin tướng và thành công cùng chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
