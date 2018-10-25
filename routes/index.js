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
        const title = req.body.title;
        const id = req.body.id;
        const index = req.body.index;
        const type = req.body.type;

        await client.create({
            index,
            type,
            id,
            body: {
                title,
                tags: ['y', 'z'],
                published: true,
                published_at: '2013-01-01',
                counter: 1
            }
        });
        res.send('OK');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/get', async (req, res) => {
    try {
        const index = req.query.index;
        const id = req.query.id;
        const type = req.query.type;

        const response = await client.get({
            index,
            type,
            id
        });
        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/search', async (req, res) => {
    try {
        const index = req.query.index;
        const type = req.query.type;

        const response = await client.search({
            index,
            type,
            body: {
                query: {
                    match: {
                        body: ''
                    }
                }
            }
        });
        res.send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/analize', async (req, res) => {
    try {
        const index = req.query.index;
        const type = req.query.type;
        const id = req.query.id;
        const analyzeType = req.query.analyzeType;

        const response = await client.get({
            index,
            type,
            id
        });

        const analData = await client.indices.analyze({
            analyzer : analyzeType,
            text : response._source.title
        });

        res.send(analData);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.put('/put-mapping', async (req, res) => {
    try {
        const index = req.query.index;
        const type = req.query.type;
        const id = req.query.id;
        const analyzeType = req.query.analyzeType;


        const data = await client.indices.putMapping({
            index,
            type,
            body: {
                properties: {
                    text: {
                        type: "text",
                        index: true,
                        search_analyzer: analyzeType,
                        analyzer: analyzeType,
                        term_vector: "with_positions_offsets_payloads"
                    }
                }
            }
        });

        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/get-mapping', async (req, res) => {
    try {
        const index = req.query.index;
        const type = req.query.type;
        const id = req.query.id;
        const analyzeType = req.query.analyzeType;


        const data = await client.indices.getMapping({
            id,
            index,
            type,
            body: {
                properties: {
                    body: {
                        type: "text",
                        index: true,
                        search_analyzer: analyzeType,
                        analyzer: analyzeType,
                        term_vector: "with_positions_offsets_payloads"
                    }
                }
            }
        });

        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/explain', async (req, res) => {
    try {

        const id = req.body.id;
        const index = req.body.index;
        const type = req.body.type;
        const query = req.body.query;

        const data = await client.explain({
            index,
            type,
            id,
            body: {
                query
            },
        });

        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.put('/index/create', async (req, res) => {
    try {
        const index = req.body.index;

        const data = await client.indices.putSettings({
            index,
            body: {
                settings: {
                    analysis: {
                        analyzer: {
                            tai_analyzer: {
                                type: "custom",
                                tokenizer: "standard",
                                filter: [
                                    "lowercase",
                                    "russian_morphology",
                                    "english_morphology",
                                    "my_stopwords",
                                    // "word_list",
                                    // "word_list_path"
                                ]
                            }
                        },
                        filter: {
                            my_stopwords: {
                                type: "stop",
                                stopwords: "а,без,более,бы,был,была,были,было,быть,в,вам,вас,весь,во,вот,все,всего,всех,вы,где,да,даже,для,до,его,ее,если,есть,еще,же,за,здесь,и,из,или,им,их,к,как,ко,когда,кто,ли,либо,мне,может,мы,на,надо,наш,не,него,нее,нет,ни,них,но,ну,о,об,однако,он,она,они,оно,от,очень,по,под,при,с,со,так,также,такой,там,те,тем,то,того,тоже,той,только,том,ты,у,уже,хотя,чего,чей,чем,что,чтобы,чье,чья,эта,эти,это,я,a,an,and,are,as,at,be,but,by,for,if,in,into,is,it,no,not,of,on,or,such,that,the,their,then,there,these,they,this,to,was,will,with"
                            }
                        }
                    }
                },
            }
        });
        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * Export routes
 */
module.exports = router;
