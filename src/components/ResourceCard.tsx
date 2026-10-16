import React from 'react';
import { ResourceItem } from '@/types';
import { StatusBadge } from './StatusBadge';

interface ResourceCardProps {
  resource: ResourceItem;
  onSelect?: (resource: ResourceItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  return (
    <article className="resource-card">
      <div className="resource-card-badges">
        <StatusBadge type="lifecycle" value={resource.lifecycle} />
        <StatusBadge type="access" value={resource.access} />
        {resource.fileUrl && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'rgba(180, 83, 9, 0.12)',
              color: '#b45309',
              border: '1px solid rgba(180, 83, 9, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
            }}
          >
            PDF Sespimma 2025
          </span>
        )}
      </div>

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
            <span>Berkas Digital Tersedia ({resource.fileFormat} • {resource.fileSize})</span>
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
        <button
          type="button"
          onClick={() => onSelect(resource)}
          className="btn-secondary"
          style={{
            marginTop: '14px',
            backgroundColor: resource.fileUrl ? 'var(--color-primary-light)' : 'var(--color-surface-hover)',
            color: 'var(--color-primary)',
            borderColor: resource.fileUrl ? 'var(--color-primary)' : 'var(--color-border)',
            fontWeight: resource.fileUrl ? 700 : 500,
            justifyContent: 'center',
          }}
        >
          {resource.fileUrl ? 'Buka & Baca Berkas PDF' : 'Lihat Rincian Metadata'}
        </button>
      )}
    </article>
  );
};
