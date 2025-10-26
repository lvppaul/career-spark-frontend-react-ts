import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { USER_ROUTES } from '@/router/constants';
import LangflowEmbed from '@/components/LangflowEmbed';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="">
              <h3 className="text-lg font-semibold mb-4">CareerSpark</h3>
              <p className="text-gray-300 text-sm">
                Khám phá tiềm năng nghề nghiệp của bạn với bài test RIASEC và
                các roadmap phát triển sự nghiệp.
              </p>
            </div>
            <div className="ml-18">
              <h4 className="font-semibold mb-4">Dịch vụ</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to={USER_ROUTES.TEST_RIASEC}
                    className="hover:text-white transition-colors"
                  >
                    Test RIASEC
                  </Link>
                </li>

                <li>
                  <Link
                    to={USER_ROUTES.FORUM}
                    className="hover:text-white transition-colors"
                  >
                    Diễn đàn
                  </Link>
                </li>
                <li>
                  <Link
                    to={USER_ROUTES.NEWS}
                    className="hover:text-white transition-colors"
                  >
                    Tin tức
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kết nối</h4>
              <div className="flex space-x-6 items-center">
                <a
                  href="https://www.facebook.com/profile.php?id=61581338765446&locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.03H8.08v-2.9h2.36V9.41c0-2.33 1.4-3.62 3.54-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.9h-2.18v7.03C18.34 21.19 22 17.06 22 12.07z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@_careerspark_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M16.5 3h2.5v3.2c.8.4 1.5 1.1 2 1.9-.9.5-1.9.8-3 .8-1.2 0-2.3-.4-3.2-1.1v6.9c0 2.7-2.2 4.9-4.9 4.9-2.7 0-4.9-2.2-4.9-4.9S8.6 8.9 11.3 8.9c.5 0 1 .1 1.5.3V6.5c-.6-.2-1.2-.3-1.8-.3-3.2 0-5.8 2.6-5.8 5.8S8 17.7 11.2 17.7c3.2 0 5.8-2.6 5.8-5.8V6.1h-1.5V3z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/_careerspark_/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.4-3.4a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2zM12 15.3A3.3 3.3 0 1 1 15.3 12 3.3 3.3 0 0 1 12 15.3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 CareerSpark. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Langflow chat: render only for authenticated users with role 'User' */}
      {isAuthenticated && isUser() && <LangflowEmbed />}
    </div>
  );
};

export default MainLayout;
