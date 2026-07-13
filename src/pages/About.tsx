import { Github, Mail, MapPin, Briefcase, Heart, Code2, Sparkles } from 'lucide-react';
import { siteConfig } from '../data/posts';
import Footer from '../sections/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#0a0a0a] transition-colors duration-300 pt-14">
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-8 text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-400 to-green-600 mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{siteConfig.author.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {siteConfig.author}
          </h1>
          <p className="text-[#4ade80] font-medium mb-2">{siteConfig.nickname}</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{siteConfig.subtitle}</p>

          <div className="flex justify-center gap-3">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href={siteConfig.social.email}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>

        {/* About Content */}
        <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4ade80]" />
            关于我
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              嗨，我是 <strong className="text-gray-900 dark:text-white">王沛钊</strong>，
              正在准备秋招，目标方向是 Java 后端开发和 AI 应用工程化。
            </p>
            <p>
              我关注 <strong className="text-gray-900 dark:text-white">Java 后端开发</strong>、工程化实践和 <strong className="text-gray-900 dark:text-white">AI Agent</strong> 方向，正在通过项目复盘、技术文章和持续迭代来沉淀能力。
            </p>
            <p>
              我相信好的代码不仅要能运行，更要优雅、可维护。在这里，我记录学习笔记、项目经验和技术思考，希望这些内容也能对你有所帮助。
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <MapPin className="w-4 h-4" />
              <span>中国</span>
              <span className="mx-2">|</span>
              <Briefcase className="w-4 h-4" />
              <span>寻找 Java 后端实习/全职机会</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#4ade80]" />
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Java', 'SpringBoot', 'Redis', 'Kafka', 'MySQL', 'AI Agent', 'LangChain4j', 'DDD', 'WebSocket', 'Docker', 'Git'].map(tech => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-[#4ade80]/20 p-8 text-center">
          <Heart className="w-6 h-6 text-[#4ade80] mx-auto mb-3" />
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic">
            "无所谓，跳探戈不像人生，一步跳错了，继续跳就行了"
          </blockquote>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
            — OverThinker
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
