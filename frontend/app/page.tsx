import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🇬🇧</span>
              <h1 className="text-2xl font-bold text-gray-900">EnglishApp</h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Học tiếng Anh hiệu quả
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hệ thống bài tập đa dạng với tracking progress chi tiết. Học anytime,
            anywhere với web và mobile app.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/exercises"
              className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border border-gray-300"
            >
              Xem bài tập
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Nhiều chủ đề</h3>
            <p className="text-gray-600">
              TOEIC, IELTS, Phrasal Verbs, Business English và nhiều hơn nữa
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">Smart Hints</h3>
            <p className="text-gray-600">
              Gợi ý thông minh: 50/50 hoặc reveal answer khi cần thiết
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Detailed Tracking</h3>
            <p className="text-gray-600">
              Track chi tiết mỗi câu trả lời, thời gian, và sử dụng hints
            </p>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-8">
            Danh mục bài tập
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: "TOEIC", icon: "📚", color: "bg-blue-100" },
              { name: "IELTS", icon: "🎯", color: "bg-green-100" },
              { name: "Phrasal Verbs", icon: "💬", color: "bg-yellow-100" },
              { name: "Business English", icon: "💼", color: "bg-purple-100" },
              { name: "Daily Conversation", icon: "🗣️", color: "bg-pink-100" },
            ].map((category) => (
              <div
                key={category.name}
                className={`${category.color} p-6 rounded-xl text-center`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 EnglishApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
