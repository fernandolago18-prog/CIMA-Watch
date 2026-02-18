
import React, { useState } from 'react';
import { AlertTriangle, Calendar, Info, CheckCircle, XCircle } from 'lucide-react';
import { isCriticalShortage } from '../utils/shortageUtils';

const ShortageCard = ({ shortage }) => {
    const [expanded, setExpanded] = useState(false);

    const isActive = shortage.activo;
    const isCritical = isCriticalShortage(shortage);

    const isLongObservation = shortage.observ && shortage.observ.length > 200;
    const observationText = isLongObservation && !expanded
        ? `${shortage.observ.substring(0, 200)}...`
        : shortage.observ;

    return (
        <div className={`shortage-card glass-panel ${isCritical ? 'critical-border' : ''} ${shortage.inCatalog ? 'catalog-match' : ''}`}>
            <div className="card-header">
                <span className="cn-badge">Código Nacional: {shortage.cn}</span>
                <div className="status-badges">
                    {shortage.inCatalog && (
                        <span className="status-pill status-catalog" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
                            En mi Hospital
                        </span>
                    )}
                    {isActive ? (
                        <span className="status-pill status-active"><Info size={12} /> Activo</span>
                    ) : (
                        <span className="status-pill status-resolved"><CheckCircle size={12} /> Resuelto</span>
                    )}
                    {isCritical && (
                        <span className="status-pill status-critical"><AlertTriangle size={12} /> Crítico</span>
                    )}
                </div>
            </div>

            <h3 className="medicine-name">{shortage.nombre}</h3>

            <div className="card-body">
                <div className="date-row">
                    <span className="date-item" title="Fecha Inicio">
                        <Calendar size={14} className="icon-muted" />
                        {new Date(shortage.fini).toLocaleDateString()}
                    </span>
                    <span className="arrow">→</span>
                    <span className="date-item" title="Fecha Fin Estimada">
                        {shortage.ffin && new Date(shortage.ffin).getFullYear() < 2050
                            ? new Date(shortage.ffin).toLocaleDateString()
                            : 'Sin fecha estimada'}
                    </span>
                </div>

                {shortage.observ && (
                    <div
                        className={`observations ${expanded ? 'expanded' : ''}`}
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        <p>
                            <Info size={14} className="icon-info" />
                            <span style={{ whiteSpace: 'pre-wrap' }}>{observationText}</span>
                        </p>
                        {isLongObservation && (
                            <button
                                type="button"
                                className="expand-hint"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(prev => !prev);
                                }}
                            >
                                {expanded ? 'Ver menos' : 'Ver más'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShortageCard;
