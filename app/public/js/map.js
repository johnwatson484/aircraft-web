const image = new ol.style.Circle({
  radius: 5,
  fill: new ol.style.Fill({ color: 'red' }),
  stroke: new ol.style.Stroke({ color: 'red', width: 1 })
})

const styles = {
  Point: new ol.style.Style({
    image: image
  }),
  LineString: new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'red', width: 5 })
  })
}

const styleFunction = (feature) => {
  return styles[feature.getGeometry().getType()]
}

const displayMap = (route) => { // eslint-disable-line no-unused-vars
  const features = new ol.format.GeoJSON().readFeatures(route.geoJson)
  const source = new ol.source.Vector()
  features.forEach(feature => {
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
    source.addFeature(feature)
  })
  const layer = new ol.layer.Vector({ source, style: styleFunction })
  const map = new ol.Map({ // eslint-disable-line no-unused-vars
    target: 'map',
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM() }),
      layer
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(route.center),
      zoom: 11
    })
  })
}
