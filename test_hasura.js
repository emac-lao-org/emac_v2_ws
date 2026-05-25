const http = require('http');

const data = JSON.stringify({
  query: `
  query getManifests {
    emac_manifests {
      id
      status
      wg_stt
      wt_stt
      wd_stt
      wr_stt
    }
  }
  `
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/v1/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    const counts = {};
    if(json.data) {
      json.data.emac_manifests.forEach(m => {
        const sum = m.wg_stt + m.wt_stt + m.wd_stt + m.wr_stt;
        const key = `sum:${sum} => wg:${m.wg_stt}, wt:${m.wt_stt}, wd:${m.wd_stt}, wr:${m.wr_stt}, status:${m.status}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      console.log(JSON.stringify(counts, null, 2));
    } else {
      console.log("Error:", json);
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
