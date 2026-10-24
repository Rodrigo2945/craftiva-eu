import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { findBlogPost, langOf } from '../data/blogPosts';

export const BlogPostPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const post = findBlogPost(id);
  const lang = langOf(i18n.language);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">{t('blog.notFound')}</h1>
        <Link to="/blog" className="mt-6 inline-flex text-sm font-semibold text-[#C65D3B]">
          {t('blog.back')}
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/blog" className="text-sm font-semibold text-[#C65D3B]">
        {t('blog.back')}
      </Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#C65D3B]">
        {t(`blog.categories.${post.category}`)}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-[#2A241E]">{post.title[lang]}</h1>
      <p className="mt-3 text-sm text-[#8A7D72]">
        {post.author} · {new Date(post.date).toLocaleDateString(lang)}
      </p>
      <img
        src={post.image}
        alt=""
        className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"
      />
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#3C342C]">
        {post.body[lang].map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
};
