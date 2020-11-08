const request = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

// Promise to resolve before running the test
beforeEach(setupDatabase)
// beforeEach(async function() {
// 	await User.deleteMany()
// 	await new User(userOne).save()
// })


// afterEach(() => {
// 	console.log('afterEach')
// })

test('Should signup a new user', async () => {
	const response = await request(app).post('/users').send({
		name: 'Andrew',
		email: 'andrew@example.com',
		password: 'MyPass777!'
	}).expect(201)

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	// Assertions about the response, if user was stored correctly
	expect(response.body).toMatchObject({
		user: {
			name: 'Andrew',
			email: 'andrew@example.com'
		}, 
		token: user.tokens[0].token
	})
	
	// Assert that password is not stored as plain text in database
	expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
	const response = await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)
	
	const user = await User.findById(userOneId)
	expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in non-existing user', async () => {
	await request(app).post('/users/login').send({
		email: userOne.email, 
		password: 'thisisnotmypass'
	}).expect(400)
})

test('Should get profile for authenticated user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Should delete account for authenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

	// Assert that the deleted user no longer exists
	const user = await User.findById(userOneId)
	expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401)
})

test('Should upload profile image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200)
	const user = await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer)) // Check if buffer
})

test('Should update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'Jess',
			age: 18
		})
		.expect(200)
	
	const user = await User.findById(userOneId)
	expect({
		name: user.name,
		age: user.age
	}).toEqual({
		name: 'Jess', 
		age: 18
	})
})

test('Should not update invalid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: 'Boston'
		})
		.expect(400)
})

test('Should not signup user with invalid email', async () => {
	await request(app)
		.post('/users')
		.send({
			name: 'John',
			email: 'failTest.com',
			password: 'funny12'
		})
		.expect(400)
})

test('Should not signup user with invalid password', async () => {
	await request(app)
		.post('/users')
		.send({
			name: 'Johny',
			email: 'passTest@example.com',
			password: 'pass'
		})
		.expect(400)
})

test('Should not update user if unauthenticated', async () => {
	await request(app)
		.patch('/users/me')
		.send({
			name: 'Nammie'
		})
		.expect(401)
})

test('Should not update user with invalid email', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			email: 'user.com'
		})
		.expect(400)
	const user = await User.findById(userOneId)
	expect(user.email).not.toEqual('user.com')
})

test('Should not update user with invalid password', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			password: '123'
		})
		.expect(400)
	const user = await User.findById(userOneId)
	const isSame = await bcrypt.compare('123', user.password)
	expect(isSame).toBe(false)
})
