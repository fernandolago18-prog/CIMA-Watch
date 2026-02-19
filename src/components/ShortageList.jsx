
import React from 'react';
import ShortageCard from './ShortageCard';

const ShortageList = ({ shortages, loading, progress, managedCNs, onToggleManaged, notes, onUpdateNote }) => {
    if (loading && shortages.length === 0) {
        return (
            <div className="loading-state">
                <p>Cargando datos de CIMA...</p>
                {progress && progress.total > 0 && (
                    <div style={{ padding: '0 1rem' }}>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${Math.min((progress.current / progress.total) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            Cargando página {progress.current} de {progress.total}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    if (!loading && shortages.length === 0) {
        return (
            <div className="empty-state">
                <p>No se encontraron resultados para su búsqueda.</p>
            </div>
        );
    }

    return (
        <div className="shortage-grid">
            {shortages.map((item) => (
                <ShortageCard
                    key={item.cn}
                    shortage={item}
                    isManaged={managedCNs ? managedCNs.has(item.cn || item.nregistro) : false}
                    onToggleManaged={onToggleManaged}
                    note={notes ? notes[item.cn || item.nregistro] : ''}
                    onUpdateNote={onUpdateNote}
                />
            ))}
        </div>
    );
};

export default ShortageList;
