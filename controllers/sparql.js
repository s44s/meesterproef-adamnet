// Sparql queries:

var sparqlqueries = {
  url: function (query) {
    return `https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=${this.encodedquery(query)}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`;
  },
  encodedquery: function (query) {
    return encodeURIComponent(query);
  },
  getAllStreets: `
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
  `,
  getLocationAndTimestamp: function (data) {
    var beginTimestamp = data.valMin;
    var endTimestamp = data.valMax;
    var uris = data.selectedStreets.map(function (street) {
      return `<${street}>`;
    });

    return `
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      SELECT * WHERE {
        VALUES ?street {
          ${uris.join('')}
        }
        ?cho dc:title ?title .
        ?cho foaf:depiction ?img .
        ?cho dct:spatial ?street .

        ?cho sem:hasBeginTimeStamp ?start .
        ?cho sem:hasEndTimeStamp ?end .

        FILTER (datatype(?start) = xsd:date)
        FILTER (datatype(?end) = xsd:date)

        FILTER (?start > xsd:date("${beginTimestamp}") && ?end < xsd:date("${endTimestamp}") )
      }
    `;
  }
};

module.exports = sparqlqueries;
