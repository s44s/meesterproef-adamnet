// Sparql queries:

var sparqlqueries = {
  url: function (query) {
    return `https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=${this.encodedquery(query)}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`;
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
    var beginTimestamp = `${data.valMin}-01-01`;
    var endTimestamp = `${data.valMax}-12-31`;
    var wkt = data.wkt;

    return `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX void: <http://rdfs.org/ns/void#>
      PREFIX hg: <http://rdf.histograph.io/>
      PREFIX geo: <http://www.opengis.net/ont/geosparql#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>

      SELECT ?title ?img ?start ?end ?street ?streetLabel WHERE {
        # basic data
        ?cho dc:title ?title .
        ?cho foaf:depiction ?img .

        # temporal filter
        ?cho sem:hasBeginTimeStamp ?orgStart .
        ?cho sem:hasEndTimeStamp ?orgEnd .
        BIND (xsd:date(str(?orgStart)) AS ?start)
        BIND (xsd:date(str(?orgEnd)) AS ?end)
        FILTER BOUND (?start)
        FILTER BOUND (?end)
        FILTER (?start >= xsd:date("${beginTimestamp}") && ?end <= xsd:date("${endTimestamp}") )

        # spatial filter
        ?cho dct:spatial ?street .
        ?street a hg:Street ;
        geo:hasGeometry/geo:asWKT ?streetWkt ;
        rdfs:label ?streetLabel .
        BIND (bif:st_geomfromtext("${wkt}") as ?x)
        BIND (bif:st_geomfromtext(?streetWkt) AS ?y)
        FILTER(bif:GeometryType(?y)!='POLYGON' && bif:st_intersects(?x, ?y))
      }
      ORDER BY ?start
    `;

    // FILTER ((?end > xsd:date("${beginTimestamp}") && ?end < xsd:date("${endTimestamp}")) || (?start > xsd:date("${beginTimestamp}") && ?start < xsd:date("${endTimestamp}")))



    // return `
    //   PREFIX dc: <http://purl.org/dc/elements/1.1/>
    //   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //   PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    //   PREFIX dct: <http://purl.org/dc/terms/>
    //   PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
    //   PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    //   SELECT ?title ?img ?street ?type ?beginTimestamp WHERE {
    //     VALUES ?street {
    //       ${uris.join('')}
    //     }
    //     ?cho dc:title ?title .
    //     ?cho foaf:depiction ?img .
    //     ?cho dct:spatial ?street .
    //     ?cho dc:type ?type .
    //
    //     ?cho sem:hasBeginTimeStamp ?beginTimestamp .
    //     ?cho sem:hasEndTimeStamp ?end .
    //
    //     FILTER (datatype(?beginTimestamp) = xsd:date)
    //     FILTER (datatype(?end) = xsd:date)
    //
    //     FILTER (?beginTimestamp > xsd:date("${beginTimestamp}") && ?end < xsd:date("${endTimestamp}") )
    //   }
    //   ORDER BY ?beginTimestamp
    // `;
  }
};

module.exports = sparqlqueries;
