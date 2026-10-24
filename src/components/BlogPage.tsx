import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { BLOG_POSTS, langOf } from '../data/blogPosts';

export const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = langOf(i18n.language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl text-[#2A241E]">{t('blog.title')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-[#5C534C]">{t('blog.subtitle')}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="flex flex-col overflow-hidden rounded-3xl border border-[#E7DDD0] bg-white">
            <Link to={`/blog/${post.id}`} className="block aspect-video overflow-hidden bg-[#EFE6D8]">
              <img src={post.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3 text-xs text-[#8A7D72]">
                <span className="rounded-full bg-[#F6E4DC] px-2 py-1 font-semibold uppercase tracking-wide text-[#C65D3B]">
                  {t(`blog.categories.${post.category}`)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.date).toLocaleDateString(lang)}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-2xl leading-snug text-[#2A241E]">
                <Link to={`/blog/${post.id}`} className="hover:text-[#C65D3B]">
                  {post.title[lang]}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5C534C]">{post.excerpt[lang]}</p>
              <Link
                to={`/blog/${post.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C65D3B]"
              >
                {t('blog.readMore')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
