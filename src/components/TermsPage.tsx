import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Shield, FileText, Lock, Scale, HelpCircle, CheckCircle, User, Image, AlertTriangle, ShieldAlert, Briefcase, Globe } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    { id: 'acceptance', icon: <CheckCircle className="text-[#C65D3B]" /> },
    { id: 'platform_role', icon: <Scale className="text-[#C65D3B]" /> },
    { id: 'orders', icon: <FileText className="text-[#C65D3B]" /> },
    { id: 'payments', icon: <Briefcase className="text-[#C65D3B]" /> },
    { id: 'verification', icon: <Shield className="text-[#C65D3B]" /> },
    { id: 'accounts', icon: <User className="text-[#C65D3B]" /> },
    { id: 'user_content', icon: <Image className="text-[#C65D3B]" /> },
    { id: 'prohibited', icon: <AlertTriangle className="text-[#C65D3B]" /> },
    { id: 'liability', icon: <ShieldAlert className="text-[#C65D3B]" /> },
    { id: 'indemnification', icon: <Lock className="text-[#C65D3B]" /> },
    { id: 'governing_law', icon: <Globe className="text-[#C65D3B]" /> },
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
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
          <p className="text-sm font-semibold text-amber-900">{t('terms.draftBadge')}</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/80">{t('terms.draftNote')}</p>
        </div>
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
