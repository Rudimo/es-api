'use strict';

let express = require('express');
let router  = express.Router();

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

/**
 * User related routes
 */
router.get('/', (req, res) => {
    client.ping({
        requestTimeout: 30000,
    }, function (error) {
        if (error) {
            res.error('elasticsearch cluster is down!');
        } else {
            res.send('All is well');
        }
    });
});

/**
 * API routes
 */
router.put('/create', async (req, res) => {
    try {
        const query = req.body;

        await client.create(query);
        res.send('OK');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/get', async (req, res) => {
    try {
        const query = req.query;

        const response = await client.get(query);
        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/search', async (req, res) => {
    try {
        const query = req.body;

        const response = await client.search(query);
        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/searchAll', async (req, res) => {
    try {

        const response = await client.search();
        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.post('/analize', async (req, res) => {
    try {
        const query = req.body;

        const analData = await client.indices.analyze(query);

        res.send(analData);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/explain', async (req, res) => {
    try {
        const query = req.body;

        const data = await client.explain(query);

        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.put('/index/create', async (req, res) => {
    try {
        const query = req.body;

        const data = await client.create(query);
        // const data = await client.indices.putMapping(query);
        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

// {
//     "index": "index",
//     "body": {
//     "settings": {
//         "analysis": {
//             "analyzer": {
//                 "my_analyzer": {
//                     "type": "custom",
//                         "tokenizer": "standard",
//                         "filter": [
//                         "lowercase",
//                         "russian_morphology",
//                         "english_morphology",
//                         "my_stopwords"
//                     ]
//                 }
//             },
//             "filter": {
//                 "my_stopwords": {
//                     "type": "stop",
//                         "stopwords": "а,без,более,бы,был,была,были,было,быть,в,вам,вас,весь,во,вот,все,всего,всех,вы,где,да,даже,для,до,его,ее,если,есть,еще,же,за,здесь,и,из,или,им,их,к,как,ко,когда,кто,ли,либо,мне,может,мы,на,надо,наш,не,него,нее,нет,ни,них,но,ну,о,об,однако,он,она,они,оно,от,очень,по,под,при,с,со,так,также,такой,там,те,тем,то,того,тоже,той,только,том,ты,у,уже,хотя,чего,чей,чем,что,чтобы,чье,чья,эта,эти,это,я,a,an,and,are,as,at,be,but,by,for,if,in,into,is,it,no,not,of,on,or,such,that,the,their,then,there,these,they,this,to,was,will,with"
//                 }
//             }
//         }
//     }
// }

// router.put('/put-mapping', async (req, res) => {
//     try {
//         const index = req.query.index;
//         const type = req.query.type;
//         const id = req.query.id;
//         const analyzeType = req.query.analyzeType;
//
//
//         const data = await client.indices.putMapping({
//             index,
//             type,
//             body: {
//                 properties: {
//                     text: {
//                         type: "text",
//                         index: true,
//                         search_analyzer: analyzeType,
//                         analyzer: analyzeType,
//                         term_vector: "with_positions_offsets_payloads"
//                     }
//                 }
//             }
//         });
//
//         res.send(data);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

// router.get('/get-mapping', async (req, res) => {
//     try {
//         const index = req.query.index;
//         const type = req.query.type;
//         const id = req.query.id;
//         const analyzeType = req.query.analyzeType;
//
//
//         const data = await client.indices.getMapping({
//             id,
//             index,
//             type,
//             body: {
//                 properties: {
//                     body: {
//                         type: "text",
//                         index: true,
//                         search_analyzer: analyzeType,
//                         analyzer: analyzeType,
//                         term_vector: "with_positions_offsets_payloads"
//                     }
//                 }
//             }
//         });
//
//         res.send(data);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

/**
 * Export routes
 */
module.exports = router;
