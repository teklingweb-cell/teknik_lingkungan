'use client';

import { useState, useMemo } from 'react';
import type { MataKuliah } from '@/lib/types';

export default function CourseList({ courses }: { courses: MataKuliah[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Semua' | 'Wajib' | 'Pilihan' | 'Praktikum'>('Semua');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // search by name or code
      const q = search.toLowerCase();
      const matchesSearch = !q || course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
      
      // filter by category
      const cat = (course.category || '').toLowerCase();
      let matchesFilter = true;
      if (filter === 'Wajib') matchesFilter = cat.includes('wajib');
      if (filter === 'Pilihan') matchesFilter = cat.includes('pilihan');
      if (filter === 'Praktikum') matchesFilter = cat.includes('praktikum');

      return matchesSearch && matchesFilter;
    });
  }, [courses, search, filter]);

  if (!courses.length) {
    return <p className="academic-empty">Daftar mata kuliah belum tersedia.</p>;
  }

  return (
    <div>
      <div 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '32px', 
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(['Semua', 'Wajib', 'Pilihan', 'Praktikum'] as const).map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                backgroundColor: filter === cat ? 'var(--navy)' : 'rgba(0,0,0,0.05)',
                color: filter === cat ? '#fff' : 'var(--text-main)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Cari nama atau kode mata kuliah..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px', 
            border: '1px solid rgba(0,0,0,0.1)', 
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--navy)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
        />
      </div>
      
      {filteredCourses.length ? (
        <div className="course-list" role="list">
          {filteredCourses.map((course) => (
            <article key={course.id} className="course-row" role="listitem">
              <span className="course-code">{course.code}</span>
              <div className="course-content">
                <h3>{course.name}</h3>
                {course.description && <p>{course.description}</p>}
              </div>
              <div className="course-values">
                <span>Semester {course.semester}</span>
                <strong>{course.credits} SKS</strong>
                {course.category && <span>{course.category}</span>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="academic-empty" style={{ textAlign: 'center', marginTop: '32px' }}>
          Mata kuliah tidak ditemukan.
        </p>
      )}
    </div>
  );
}
