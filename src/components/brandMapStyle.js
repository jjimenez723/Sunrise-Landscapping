const OPENFREEMAP_SOURCE = {
  type: "vector",
  url: "https://tiles.openfreemap.org/planet",
};

export const BRAND_MAP_THEME = Object.freeze({
  ground: "#f7f6f0",
  greenery: "#dce8d5",
  greenerySoft: "#e9efe2",
  water: "#d8e5ee",
  waterEdge: "#b7ced3",
  building: "#e9e4da",
  road: "#fffdf8",
  roadOutline: "#d7d8cf",
  majorRoad: "#f1cda9",
  majorRoadOutline: "#dfaa78",
  highway: "#f4b87e",
  highwayOutline: "#d9864c",
  text: "#293128",
  textMuted: "#687267",
  textOnWater: "#577582",
  halo: "#f7f6f0",
});

const labelField = ["coalesce", ["get", "name:en"], ["get", "name"]];

function classFilter(classes) {
  return ["in", ["get", "class"], ["literal", classes]];
}

function roadWidth(width, outline = false) {
  const outlineOffset = outline ? 2 : 0;

  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    10,
    width * 0.45 + outlineOffset,
    14,
    width + outlineOffset,
    18,
    width * 1.75 + outlineOffset,
  ];
}

function roadLayer(id, classes, color, width, outline = false) {
  return {
    id,
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    filter: classFilter(classes),
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": color,
      "line-width": roadWidth(width, outline),
    },
  };
}

export function createBrandMapStyle(theme = BRAND_MAP_THEME) {
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sprite: "https://tiles.openfreemap.org/sprites/ofm_f384/ofm",
    sources: { openmaptiles: OPENFREEMAP_SOURCE },
    layers: [
      {
        id: "brand-background",
        type: "background",
        paint: { "background-color": theme.ground },
      },
      {
        id: "brand-landcover-wood",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        filter: ["==", ["get", "class"], "wood"],
        paint: { "fill-color": theme.greenery, "fill-opacity": 0.85 },
      },
      {
        id: "brand-landcover-grass",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        filter: classFilter(["grass", "grassland"]),
        paint: { "fill-color": theme.greenerySoft, "fill-opacity": 0.85 },
      },
      {
        id: "brand-park",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "park",
        paint: {
          "fill-color": theme.greenery,
          "fill-opacity": 0.75,
          "fill-outline-color": theme.greenerySoft,
        },
      },
      {
        id: "brand-water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        paint: { "fill-color": theme.water },
      },
      {
        id: "brand-waterway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "waterway",
        layout: { "line-cap": "round" },
        paint: {
          "line-color": theme.waterEdge,
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.7, 16, 4],
        },
      },
      {
        id: "brand-buildings",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 13,
        paint: { "fill-color": theme.building, "fill-opacity": 0.75 },
      },
      roadLayer("brand-highway-outline", ["motorway", "trunk"], theme.highwayOutline, 7, true),
      roadLayer("brand-highway", ["motorway", "trunk"], theme.highway, 7),
      roadLayer("brand-major-road-outline", ["primary", "secondary", "tertiary"], theme.majorRoadOutline, 5, true),
      roadLayer("brand-major-road", ["primary", "secondary", "tertiary"], theme.majorRoad, 5),
      roadLayer("brand-minor-road-outline", ["minor", "service", "track", "path"], theme.roadOutline, 3, true),
      roadLayer("brand-minor-road", ["minor", "service", "track", "path"], theme.road, 3),
      {
        id: "brand-road-labels",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "transportation_name",
        minzoom: 13,
        layout: {
          "symbol-placement": "line",
          "text-field": labelField,
          "text-font": ["Open Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 17, 12],
          "text-max-angle": 30,
        },
        paint: {
          "text-color": theme.textMuted,
          "text-halo-color": theme.halo,
          "text-halo-width": 1.5,
        },
      },
      {
        id: "brand-water-labels",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "water_name",
        layout: {
          "text-field": labelField,
          "text-font": ["Open Sans Italic"],
          "text-size": 12,
        },
        paint: {
          "text-color": theme.textOnWater,
          "text-halo-color": theme.water,
          "text-halo-width": 1.2,
        },
      },
      {
        id: "brand-place-labels",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        filter: classFilter(["city", "town", "village", "suburb", "neighbourhood", "neighborhood"]),
        layout: {
          "text-field": labelField,
          "text-font": ["Open Sans Semibold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 11, 14, 14, 17, 16],
          "text-padding": 4,
        },
        paint: {
          "text-color": theme.text,
          "text-halo-color": theme.halo,
          "text-halo-width": 2,
        },
      },
    ],
  };
}
