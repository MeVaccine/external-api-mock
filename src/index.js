const nationalID = require('./data/nationalID.json')
// const validThaiID = require('thai-id-validator')
const path = require('path')
const fastify = require('fastify')({
	logger: true,
})

const PORT = process.env.PORT || 5050

function idValidator(id) {
	if (id == null || id.length !== 13 || !/^[0-9]\d+$/.test(id)) return !1
	let i,
		sum = 0
	for (i = 0, sum = 0; i < 12; i++) {
		sum += parseInt(id.charAt(i)) * (13 - i)
	}
	let check = (11 - (sum % 11)) % 10
	if (check === parseInt(id.charAt(12))) {
		return !0
	}
	return !1
}

fastify.register(require('fastify-static'), {
	root: path.resolve(__dirname, '..', 'public'),
})

// fastify.get('/', (request, reply) => {
// 	reply.send({ success: true, timestamp: new Date() })
// })

fastify.get('/nationid', (req, res) => {
	const { id, laserID } = req.query
	if (!idValidator(id)) {
		return res.status(400).send({ error: 'id is not valid Thai national id' })
	}
	if (!/JT\d{10}/.test(laserID)) {
		return res.status(400).send({ error: 'Laser ID is not valid' })
	}
	const idInfo = nationalID.find(el => el.id == id && el.laserID == laserID)
	if (!idInfo) return res.status(404).send({ error: 'Not Found' })
	res.send(idInfo)
})

fastify.listen(PORT, '0.0.0.0', function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	fastify.log.info(`server listening on ${address}`)
})
