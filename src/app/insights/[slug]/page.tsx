'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_BLOG_ARTICLES } from '@/lib/data/mockData';
import { Button } from '@/components/ui/Button';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const article = INITIAL_BLOG_ARTICLES.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Article Not Found</h1>
        <Link href="/insights"><Button variant="primary" size="md">Back to Insights</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 font-sans">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-[#2563EB] uppercase">{article.category} • {article.publishedDate} • {article.readTime}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">{article.title}</h1>
        <div className="flex items-center gap-3 pt-2">
          <img src={article.authorAvatar} alt={article.authorName} className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" />
          <span className="text-xs text-[#475569] font-bold">{article.authorName}</span>
        </div>
      </div>

      <img src={article.coverImage} alt={article.title} className="w-full h-80 object-cover rounded-2xl border border-[#E2E8F0] shadow-xs" />

      <div className="mnc-card p-8 text-[#475569] text-sm leading-relaxed space-y-4 font-normal">
        <p className="text-base font-semibold text-[#0B1F3A]">{article.excerpt}</p>
        <p>{article.content}</p>
      </div>
    </div>
  );
}
