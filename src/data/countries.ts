export interface CountryFeature {
  type: "Feature";
  properties: {
    name: string;
    code: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface CountryCollection {
  type: "FeatureCollection";
  features: CountryFeature[];
}

export const countries: CountryCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "United States",
        "code": "US"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-95.7129, 37.0902]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "United Kingdom",
        "code": "GB"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-3.4360, 55.3781]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Japan",
        "code": "JP"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [138.2529, 36.2048]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Australia",
        "code": "AU"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [133.7751, -25.2744]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Brazil",
        "code": "BR"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-51.9253, -14.2350]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "China",
        "code": "CN"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [104.1954, 35.8617]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "India",
        "code": "IN"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [78.9629, 20.5937]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Russia",
        "code": "RU"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [105.3188, 61.5240]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Germany",
        "code": "DE"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.4515, 51.1657]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "France",
        "code": "FR"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [2.2137, 46.2276]
      }
    }
  ]
}; 