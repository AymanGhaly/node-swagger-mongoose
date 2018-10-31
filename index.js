const hapi = require('hapi');
const mongoose = require('mongoose');
const docSchema = require('./model/schema.js')
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Vision = require('vision');
const Inert = require('inert');
const JOI = require('joi');



const server = hapi.server({
    port: 4000,
    host: 'localhost'
});


mongoose.connection.once('open', () => {
    console.log('connected to database');
});

mongoose.connect("mongodb://<username>:<password>@ds245523.mlab.com:45523/<databaseName>");



const init = async () => {

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'API Documentation',
                    version: Pack.version
                }
            }
        }
    ]);

    server.route([
        {
            method: 'GET',
            path: '/doc',
            handler: function (request, reply) {
                return docSchema.find();
            },
            config: {
                description: "return all docs",
                tags: ['api', 'v1', "return all docs"]
            }
        },
        {
            method: 'GET',
            path: '/doc/{id}',
            handler: function (request, reply) {
                return docSchema.findById(request.params.id);
            },
            config: {
                description: "find doc by id",
                tags: ['api', 'v1', "find doc by id"],
                validate: {
                    params: {
                        id: JOI.string().alphanum().required()
                    }
                }

            }
        },
        {
            method: 'GET',
            path: '/doc/type/{id}',
            handler: function (request, reply) {
                return docSchema.find({ type: request.params.id });
            },
            config: {
                description: "get doc by doc type",
                tags: ['api', 'v1', "get doc by doc type"],
                validate: {
                    params: {
                        id: JOI.string().alphanum().required()
                    }
                }

            }
        }
        ,
        {
            method: 'POST',
            path: '/doc',
            handler: function (request, reply) {
                const { data, type } = request.payload
                const docSchemaData = new docSchema({
                    data, type
                });
                return docSchemaData.save();
            },
            config: {
                description: "add new doc",
                tags: ['api', 'v1', "add new doc"],
                validate: {
                    payload: {
                        data: JOI.object(),
                        type: JOI.string()
                    }
                }
            }
        },
        {
            method: 'PUT',
            path: '/doc',
            handler: function (request, reply) {
                const updateData = request.payload.data
                return docSchema.findByIdAndUpdate(request.payload.id, { data: updateData });
            },
            config: {
                description: "update existing doc",
                tags: ['api', 'v1', "update existing doc"],
                validate: {
                    payload: {
                        id: JOI.string().alphanum().required(),
                        data: JOI.object()
                    }
                }
            }
        },
        {
            method: 'DELETE',
            path: '/doc/{id}',
            handler: function (request, reply) {
                return docSchema.findOneAndRemove({_id:request.params.id});
            },
            config: {
                description: "delete existing doc",
                tags: ['api', 'v1', "delete existing doc"],
                validate: {
                    params: {
                        id: JOI.string().alphanum().required()
                    }
                }
            }
        }
    ]);


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};




init();