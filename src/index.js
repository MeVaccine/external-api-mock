const fastify = require('fastify')({
	logger: true,
})

const PORT = process.env.PORT || 5050

fastify.get('/', (request, reply) => {
	reply.send({ success: true, timestamp: new Date() })
})

const start = async () => {
	try {
		console.info(`Running on port ${PORT}`)
		await fastify.listen(PORT)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}
start()
