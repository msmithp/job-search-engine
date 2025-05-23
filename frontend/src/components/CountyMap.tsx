/** CountyMap.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The CountyMap component is a Leaflet map for a blank county map. It uses the
 * DensityMap component with a null skill value to display all counties in
 * gray. It is used in the Dashboard component when the user has not selected
 * a skill from the dropdown.
 */


import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { StateData } from "src/static/types";
import { DensityMap, MapBoundsControl } from "../components";


interface CountyMapProps {
    stateData: StateData,
}

function CountyMap({ stateData } : CountyMapProps) {
    let processedFeatures = [];

    // Process GeoJSON features prior to display
    for (let i = 0; i < counties.features.length; i++) {
        const feature = counties.features[i];
        const stateCode = feature.properties.STATECODE;

        // Filter out counties not in state
        if (stateCode !== stateData.stateCode) {
            continue;
        }

        // FIPS code of current county (e.g., "24021")
        const fips = feature.properties.GEOID;

        const properties = {
            NAME: feature.properties.NAME,
            STATECODE: stateData.stateCode,
            COUNTYFIPS: fips,
            SKILL: null,
            JOBS: 0,
            DENSITY: 0
        };

        // Add amended GeoJSON feature to new processedFeatures list
        processedFeatures.push({
            type: feature.type,
            properties: properties,
            geometry: feature.geometry
        });
    }

    const geoData = {
        type: counties.type,
        name: counties.name,
        crs: counties.crs,
        features: processedFeatures
    } as GeoJSON.FeatureCollection;

    return (
        <div>
            <MapContainer zoom={6} scrollWheelZoom={false} className="dashboardMap">
                <TileLayer 
                        attribution='&copy; 
                        <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; 
                        <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; 
                        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
                <DensityMap geoData={geoData} skill={null} />
                <MapBoundsControl geoData={geoData} />
            </MapContainer>
        </div>
    )
}

export default CountyMap;
