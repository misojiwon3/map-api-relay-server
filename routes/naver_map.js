var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/places', (req, res) => {
  if (req.query.coord && req.query.boundary) {
    const query = req.query.query;
    const coord = req.query.coord;
    const count = req.query.count || 20;
    // '127.00042963027956;37.48553465960466;127.01708078384401;37.499239986813734'
    const boundary = req.query.boundary;
    
    console.log(query, coord, count);
    console.log(boundary);
  
    const options = {
      uri: 'https://map.naver.com/v5/api/around-here/place',
      qs: {
        categoryUsageId: 'app_aroundme_v2',
        query: query,
        searchCoord: coord,
        siteSort: 0,
        page: 1,
        displayCount: count,
        boundary: boundary,
        lang: 'ko'
      }
    }
  
    request.get(options, (error, response, body) => {
      // console.log(response.body);
      res.send(response.body);
    });
  } else {
    res.status(400).send({code: 101, message: 'InvalidQuery'});
  }
  
});

// 좌표 -> 주소
router.get('/addresses', (req, res) => {
  const options = {
    uri: 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc',
    qs: {
      request: 'coordsToaddr',
      coords: '127.0091519,37.4902400',
      output: 'json'
    },
    headers: {
      'X-NCP-APIGW-API-KEY-ID': 'h0ipucvs2c',
      'X-NCP-APIGW-API-KEY': 'y175BTaJqLHJAhRYfPb83JKt1FKVird0NsvlmoCa'
    }
  }
  request.get(options, (error, response, body) => {
    console.log(body);
    res.send(response.body);
  });
});

// 주소 -> 좌표
router.get('/gc', (req, res) => {
  const query = req.query.query
  console.log(query);

  const options = {
    uri: 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
    qs: {
      query: query
    },
    headers: {
      'X-NCP-APIGW-API-KEY-ID': 'h0ipucvs2c',
      'X-NCP-APIGW-API-KEY': 'y175BTaJqLHJAhRYfPb83JKt1FKVird0NsvlmoCa'
    }
  }
  request.get(options, (error, response, body) => {
    // console.log(response)
    const responseBody = JSON.parse(response.body);
    const result = {
      ...responseBody.meta,
      results: responseBody.addresses
    }
    console.log(result);
    res.send(result);
  });
});

module.exports = router;