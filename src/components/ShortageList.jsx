
import React from 'react';
import ShortageCard from './ShortageCard';

const ShortageList = ({ shortages, loading }) => {
    if (loading && shortages.length === 0) {
        return <div className="loading-state">Cargando datos de CIMA...</div>;
    }

    if (!loading && shortages.length === 0) {
        return (
            <div className="empty-state">
                <p>No se encontraron resultados para su búsqueda.</p>
            </div>
        );
    }

    return (
        <>
            <div className="shortage-grid">
                {shortages.map((item) => (
                    <ShortageCard key={item.cn} shortage={item} />
                ))}
            </div>


        </>
    );
};

export default ShortageList;
