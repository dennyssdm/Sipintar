import React from 'react';
import { ResourceItem } from '@/types';
import { StatusBadge } from './StatusBadge';

interface ResourceCardProps {
  resource: ResourceItem;
  onSelect?: (resource: ResourceItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  const isHanjar = resource.category === 'Modul & Hanjar';
  const showCoverPreview = isHanjar || resource.hasDigitalFile;

  return (
    <article className="resource-card">
      <div className="resource-card-badges">
        <StatusBadge type="lifecycle" value={resource.lifecycle} />
        <StatusBadge type="access" value={resource.access} />
        {resource.fileUrl && (
          <span className="badge-sespimma-pdf">
            PDF Sespimma 2025
          </span>
        )}
      </div>

      {/* Visual Document Cover Preview on Every Hanjar */}
      {showCoverPreview && (
        <div
          className="resource-card-cover"
          onClick={() => onSelect && onSelect(resource)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onSelect) {
                onSelect(resource);
              }
            }
          }}
          title={`Klik untuk Pratinjau Dokumen: ${resource.title}`}
          aria-label={`Pratinjau Dokumen ${resource.title}`}
        >
          <div className="resource-card-cover-header">
            <span className="cover-institution-tag">SESPIMMA LEMDIKLAT POLRI</span>
            <span className={`resource-card-format-tag format-${(resource.fileFormat || 'pdf').toLowerCase()}`}>
              {resource.fileFormat || 'PDF'}
            </span>
          </div>

          <div className="resource-card-cover-center">
            <div className="cover-doc-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="cover-title-snippet">
              {resource.title}
            </div>
          </div>

          <div className="resource-card-cover-footer">
            <span className="cover-filesize">{resource.fileSize || 'Naskah Digital'}</span>
            <span className="resource-card-preview-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Baca Dokumen</span>
            </span>
          </div>
        </div>
      )}

      <h3 className="resource-card-title">{resource.title}</h3>

      <p className="resource-card-desc">{resource.description}</p>

      {resource.competencies && resource.competencies.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {resource.competencies.map((comp, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
              }}
            >
              {comp}
            </span>
          ))}
        </div>
      )}

      <div className="resource-card-meta">
        <div>
          <strong>Penyusun / Pengampu:</strong> {resource.authorOrInstructor}
        </div>
        <div>
          <strong>Unit / Sumber:</strong> {resource.unitOrSource}
        </div>
        <div>
          <strong>Pembaruan Terakhir:</strong> {resource.updatedAt}
        </div>
      </div>

      <div className="resource-file-status">
        {resource.hasDigitalFile ? (
          <span className="file-available" style={{ display: 'flex', alignContent: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Berkas Digital Siap ({resource.fileFormat} • {resource.fileSize})</span>
          </span>
        ) : (
          <span className="file-unavailable" style={{ display: 'flex', alignContent: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              {resource.physicalLocation
                ? `Fisik: ${resource.physicalLocation}`
                : 'Berkas digital belum diunggah (Hanya Metadata)'}
            </span>
          </span>
        )}
      </div>

      {onSelect && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onSelect(resource)}
            className="btn-primary"
            style={{
              flex: 1,
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '8px 12px',
              justifyContent: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>Baca Dokumen</span>
          </button>

          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                fontSize: '12px',
                padding: '8px 10px',
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}
              title="Buka berkas PDF resmi di tab baru"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(resource)}
              className="btn-secondary"
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
              }}
            >
              Rincian
            </button>
          )}
        </div>
      )}
    </article>
  );
};
