//QUERY URL
var sparqlquery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX hg: <http://rdf.histograph.io/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>

SELECT ?street ?name ?wkt WHERE {
  ?street a hg:Street .
  ?street rdfs:label ?name .
  ?street geo:hasGeometry ?geo .
  ?geo geo:asWKT ?wkt .
}
`;

var encodedquery = encodeURIComponent(sparqlquery);
var host = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

module.exports.data = host;
