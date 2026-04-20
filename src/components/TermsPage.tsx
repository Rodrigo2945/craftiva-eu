import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Shield, FileText, Lock, Scale, HelpCircle, CheckCircle, User, Image, AlertTriangle, ShieldAlert, Briefcase, Globe } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    { id: 'acceptance', icon: <CheckCircle className="text-blue-500" /> },
    { id: 'platform_role', icon: <Scale className="text-emerald-500" /> },
    { id: 'accounts', icon: <User className="text-purple-500" /> },
    { id: 'user_content', icon: <Image className="text-pink-500" /> },
    { id: 'prohibited', icon: <AlertTriangle className="text-red-500" /> },
    { id: 'liability', icon: <ShieldAlert className="text-orange-500" /> },
    { id: 'indemnification', icon: <Briefcase className="text-teal-500" /> },
    { id: 'governing_law', icon: <Globe className="text-indigo-500" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          {t('terms.title')}
        </h1>
        <p className="text-gray-500 font-medium">
          {t('terms.lastUpdated')}
        </p>
      </motion.div>

      <div className="prose prose-emerald max-w-none">
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          {t('terms.intro')}
        </p>

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
                  {t(`terms.sections.${section.id}.title`)}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t(`terms.sections.${section.id}.content`)}
              </p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};
