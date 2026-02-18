
import { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';
import { getAllShortages } from './services/cimaService';
import Header from './components/Header';
import Filters from './components/Filters';
import ShortageList from './components/ShortageList';
import CatalogUpload from './components/CatalogUpload';
import { isCriticalShortage } from './utils/shortageUtils';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [shortages, setShortages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Catalog State - Initialize from localStorage if available
  const [catalogCNs, setCatalogCNs] = useState(() => {
    const saved = localStorage.getItem('catalogCNs');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved catalog", e);
        return new Set();
      }
    }
    return new Set();
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [showCatalogOnly, setShowCatalogOnly] = useState(false);

  // Auto-enable filter if catalog was loaded from storage
  useEffect(() => {
    if (catalogCNs.size > 0) {
      // Optional: decide if we want to auto-enable filter on load.
      // For now, let's keep it off by default or remember it too. 
      // User didn't ask to remember filter state, just the file.
    }
  }, []);

  /* 
     Load ALL data at once. 
     Pagination is handled internally by the service now. 
     This ensures Search and Catalog Matching work on the full dataset.
  */
  const loadData = useCallback(async () => {
    // Forced update to ensure latest logic is loaded
    setLoading(true);
    setError(null);
    try {
      const data = await getAllShortages();
      if (data && data.resultados) {
        setShortages(data.resultados);
      }
    } catch {
      setError('Error al cargar los datos de desabastecimiento. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCatalogLoaded = (cnSet) => {
    setCatalogCNs(cnSet);
    // Persist to localStorage
    localStorage.setItem('catalogCNs', JSON.stringify([...cnSet]));

    if (cnSet.size > 0) {
      setShowCatalogOnly(true); // Auto-switch to filter view if file loaded
    } else {
      setShowCatalogOnly(false);
    }
  };

  const handleClearCatalog = () => {
    setCatalogCNs(new Set());
    localStorage.removeItem('catalogCNs');
    setShowCatalogOnly(false);
  };

  // Derived state for filtered list
  const filteredShortages = useMemo(() => {
    const now = Date.now();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;

    return shortages.map(item => {
      // Enrich item with 'inCatalog' flag
      // Normalize API CN to digits only to match CatalogUpload logic
      // Prioritize item.cn as it's the standard field, fallback to nregistro
      const rawCN = item.cn || item.nregistro;
      const apiCN = rawCN ? String(rawCN).replace(/\D/g, '') : '';

      return {
        ...item,
        normalizedCN: apiCN, // Store for search
        inCatalog: catalogCNs.has(apiCN)
      };
    }).filter(item => {
      // Logic 1: Remove Stale Data
      const startMs = Number(item.fini);
      let hasIndefiniteEnd = false;

      // Determine if end date is basically "unknown"
      if (!item.ffin) {
        hasIndefiniteEnd = true;
      } else {
        const endYear = new Date(item.ffin).getFullYear();
        if (endYear > 2040) hasIndefiniteEnd = true;
      }

      if (startMs && (now - startMs > oneYearMs) && hasIndefiniteEnd) {
        return false;
      }

      // Search logic
      const trimmedQuery = searchQuery.trim();
      const lowerQuery = trimmedQuery.toLowerCase();
      const normalizedQuery = trimmedQuery.replace(/\D/g, '');

      const nameMatch = item.nombre && item.nombre.toLowerCase().includes(lowerQuery);

      // Fix: Use startsWith for CN search as requested by user
      const cnMatch = (item.nregistro && String(item.nregistro).startsWith(trimmedQuery)) ||
        (item.cn && String(item.cn).startsWith(trimmedQuery));

      const normalizedCnMatch = item.normalizedCN && normalizedQuery && item.normalizedCN.startsWith(normalizedQuery);

      if (!nameMatch && !cnMatch && !normalizedCnMatch) return false;

      // Filter: Catalog Only
      if (showCatalogOnly && !item.inCatalog) {
        return false;
      }

      // Filter: Critical Only
      if (showCriticalOnly) {
        return isCriticalShortage(item);
      }

      return true;
    });
  }, [shortages, searchQuery, showCriticalOnly, catalogCNs, showCatalogOnly]);



  return (
    <ErrorBoundary>
      <div className="container">
        <Header />

        <main className="main-content">
          <CatalogUpload onCatalogLoaded={handleCatalogLoaded} />

          <div className="controls-row">
            <Filters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showCriticalOnly={showCriticalOnly}
              setShowCriticalOnly={setShowCriticalOnly}
            />



            {catalogCNs.size > 0 && (
              <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label className={`toggle-btn ${showCatalogOnly ? 'active' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                  <input
                    type="checkbox"
                    checked={showCatalogOnly}
                    onChange={(e) => setShowCatalogOnly(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>Ver solo mis medicamentos afectados ({catalogCNs.size})</span>
                </label>
                <button
                  onClick={handleClearCatalog}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                  title="Borrar archivo guardado"
                >
                  Borrar Archivo
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="error-banner glass-panel">
              <span>{error}</span>
            </div>
          )}

          <ShortageList
            shortages={filteredShortages}
            loading={loading}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
