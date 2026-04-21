import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const Homepage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-stone-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-8"
            >
              <Sparkles size={16} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">
                Artesãos Europeus Verificados
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Autenticidade <br/>
              <span className="text-orange-600 italic">Europeia</span> ao Teu Alcance
            </h1>
            
            <p className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Conectamos-te com artesãos talentosos de toda a Europa. 
              Produtos únicos, feitos à mão, com qualidade garantida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Explorar Produtos
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-900 font-semibold px-8 py-4 rounded-full border-2 border-stone-200 transition-all active:scale-95"
              >
                Torna-te Seller
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
          >
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-orange-600 mb-2">500+</div>
              <div className="text-sm text-stone-600">Artesãos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-orange-600 mb-2">12</div>
              <div className="text-sm text-stone-600">Países EU</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-orange-600 mb-2">100%</div>
              <div className="text-sm text-stone-600">Verificado</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-stone-900 mb-16">
            Porquê Craftiva?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
                100% Verificado
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Todos os artesãos são verificados. Origem europeia garantida, sem intermediários.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
                Qualidade Artesanal
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Produtos únicos, feitos à mão com paixão. Cada peça conta uma história.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
                Comunidade Europeia
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Apoia artesãos locais e preserva tradições centenárias de toda a Europa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Pronto para Descobrir?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Explora centenas de produtos únicos criados por artesãos talentosos de toda a Europa.
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            Ver Todos os Produtos
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
