import { MAPBOX_ACCESS_TOKEN } from '@env';
import MapboxGL from '@rnmapbox/maps';

// Set the access token for Mapbox
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// Optionally, you can set other config here (like telemetry, etc) 