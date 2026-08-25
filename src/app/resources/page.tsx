import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { INITIAL_BLOG_ARTICLES, INITIAL_FAQS } from '@/lib/data/mockData';
import { Button } from '@/components/ui/Button';

export default function ResourcesPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Knowledge Base & Guides
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">
          Technology Resources & Articles
        </h1>
        <p className="text-[#475569] text-base font-normal">
          Technical comparisons, SaaS MVP guides, and delivery answers written by our engineering network.
        </p>
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#0B1F3A]">Technical Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_BLOG_ARTICLES.map((article) => (
            <div key={article.id} className="mnc-card-interactive flex flex-col justify-between overflow-hidden">
              <div>
                <img src={article.coverImage} alt={article.title} className="w-full h-56 object-cover" />
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
                    <span className="text-[#2563EB]">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1F3A]">{article.title}</h3>
                  <p className="text-xs text-[#475569] line-clamp-2 font-normal">{article.excerpt}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link href={`/insights/${article.slug}`}>
                  <Button variant="outline" size="sm" className="w-full justify-between" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    Read Article
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-8 border-t border-[#E2E8F0]">
        <h2 className="text-2xl font-bold text-[#0B1F3A]">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_FAQS.map((faq) => (
            <div key={faq.id} className="mnc-card p-6 space-y-2">
              <h3 className="text-base font-bold text-[#0B1F3A]">{faq.question}</h3>
              <p className="text-xs text-[#475569] leading-relaxed font-normal">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
