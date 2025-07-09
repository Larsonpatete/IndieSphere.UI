import React, { useState, useEffect, useRef, memo, useCallback, forwardRef, useImperativeHandle } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

// Define the interface for the ref methods
export interface GlobeContainerRef {
  highlightCountry: (polygon: any) => void;
}

// Define the props interface
interface GlobeContainerProps {
  onCountryClick: (polygon: any) => void;
}

// Create component with forwardRef to expose methods
const GlobeContainer = forwardRef<GlobeContainerRef, GlobeContainerProps>(({ onCountryClick }, ref) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState({ features: [] });

  // Fetch countries only once
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  // Set up globe only once
  useEffect(() => {
    if (globeRef.current && countries.features.length > 0) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.2;
    }
  }, [countries.features]);

  // These functions NEVER change
  const polygonCapColor = useCallback(() => 'rgba(255, 255, 255, 0.2)', []);
  const polygonSideColor = useCallback(() => 'rgba(255, 255, 255, 0.08)', []);
  const polygonStrokeColor = useCallback(() => '#aaa', []);
  const polygonLabel = useCallback((polygon: any) => `<b>${polygon.properties.NAME}</b>`, []);

  // Expose highlight method via ref
  useImperativeHandle(ref, () => ({
    highlightCountry: (polygon: any) => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
        globeRef.current.pointOfView({
          lat: polygon.properties.LABEL_Y,
          lng: polygon.properties.LABEL_X,
          altitude: 1.5
        }, 1000);
      }
    }
  }));

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features}
      polygonCapColor={polygonCapColor}
      polygonSideColor={polygonSideColor}
      polygonStrokeColor={polygonStrokeColor}
      onPolygonClick={onCountryClick}
      polygonLabel={polygonLabel}
    />
  );
});

// Add memo AFTER forwardRef
export default memo(GlobeContainer);