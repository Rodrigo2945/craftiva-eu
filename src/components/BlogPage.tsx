import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, ChevronLeft, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: 'tips' | 'stories' | 'news' | 'guides';
  image: string;
  content: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'blog.posts.post1.title',
    excerpt: 'blog.posts.post1.excerpt',
    author: 'Maria Silva',
    date: '2026-03-25',
    category: 'guides',
    image: 'https://picsum.photos/seed/gift/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '2',
    title: 'blog.posts.post2.title',
    excerpt: 'blog.posts.post2.excerpt',
    author: 'João Santos',
    date: '2026-03-20',
    category: 'stories',
    image: 'https://picsum.photos/seed/pottery/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '3',
    title: 'blog.posts.post3.title',
    excerpt: 'blog.posts.post3.excerpt',
    author: 'Ana Oliveira',
    date: '2026-03-15',
    category: 'tips',
    image: 'https://picsum.photos/seed/wood/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '4',
    title: 'blog.posts.post4.title',
    excerpt: 'blog.posts.post4.excerpt',
    author: 'Ricardo Pereira',
    date: '2026-03-10',
    category: 'guides',
    image: 'https://picsum.photos/seed/personalized/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '5',
    title: 'blog.posts.post5.title',
    excerpt: 'blog.posts.post5.excerpt',
    author: 'Sofia Costa',
    date: '2026-03-05',
    category: 'tips',
    image: 'https://picsum.photos/seed/decor/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '6',
    title: 'blog.posts.post6.title',
    excerpt: 'blog.posts.post6.excerpt',
    author: 'Miguel Rocha',
    date: '2026-03-01',
    category: 'guides',
    image: 'https://picsum.photos/seed/photo/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '7',
    title: 'blog.posts.post7.title',
    excerpt: 'blog.posts.post7.excerpt',
    author: 'Inês Martins',
    date: '2026-02-25',
    category: 'tips',
    image: 'https://picsum.photos/seed/eco/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '8',
    title: 'blog.posts.post8.title',
    excerpt: 'blog.posts.post8.excerpt',
    author: 'Pedro Alves',
    date: '2026-02-20',
    category: 'news',
    image: 'https://picsum.photos/seed/trends/800/600',
    content: 'Conteúdo completo aqui...'
  },
  {
    id: '9',
    title: 'blog.posts.post9.title',
    excerpt: 'blog.posts.post9.excerpt',
    author: 'Catarina Dias',
    date: '2026-02-15',
    category: 'stories',
    image: 'https://picsum.photos/seed/community/800/600',
    content: 'Conteúdo completo aqui...'
  }
];

export const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          {t('blog.title')}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          {t('blog.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_POSTS.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="aspect-video overflow-hidden relative">
              <img 
                src={post.image} 
                alt={t(post.title)} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                  {t(`blog.categories.${post.category}`)}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(post.date).toLocaleDateString(i18n.language)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {t(post.title)}
              </h2>
              
              <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                {t(post.excerpt)}
              </p>

              <button className="mt-auto flex items-center gap-2 text-emerald-600 font-bold text-sm group/btn">
                <span>{t('blog.readMore')}</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {MOCK_POSTS.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">{t('blog.noPosts')}</p>
        </div>
      )}
    </div>
  );
};
