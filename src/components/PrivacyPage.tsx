import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Building2, Database, Target, Share2, Clock, UserCheck, Cookie, Flag } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    { id: 'controller', icon: <Building2 className="text-blue-500" /> },
    { id: 'data_collected', icon: <Database className="text-emerald-500" /> },
    { id: 'purposes', icon: <Target className="text-purple-500" /> },
    { id: 'sharing', icon: <Share2 className="text-pink-500" /> },
    { id: 'retention', icon: <Clock className="text-orange-500" /> },
    { id: 'rights', icon: <UserCheck className="text-teal-500" /> },
    { id: 'cookies', icon: <Cookie className="text-amber-500" /> },
    { id: 'illegal_content', icon: <Flag className="text-red-500" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t('privacy.title')}</h1>
        <p className="text-gray-500 font-medium">{t('privacy.lastUpdated')}</p>
      </motion.div>

      <div className="prose prose-emerald max-w-none">
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">{t('privacy.intro')}</p>

        <div className="space-y-12">
          {sections.map((section) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">
                  {t(`privacy.sections.${section.id}.title`)}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {t(`privacy.sections.${section.id}.content`)}
              </p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};
