const { send } = require('@sendgrid/mail')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
	userOneId, 
	userOne,
	userTwoId,
	userTwo,
	taskOne,
	taskTwo,
	taskThree, 
	setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
	const response = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'From my test'
		})
		.expect(201)
	const task = await Task.findById(response.body._id)
	expect(task).not.toBeNull()
	expect(task.description).toEqual('From my test')
	expect(task.completed).toEqual(false)
})

test('Should not create task with invalid input', async () => {
	await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			completed: 'true'
		})
		.expect(400)
})

test('Should fetch user tasks', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	// Assert to check the number of tasks for a user. In this case, it's 2
	expect(response.body.length).toEqual(2)
	// Assert to check the completed property is set to false by default
	expect(response.body[0].completed).toBe(false)
	// Assert to check if taskTwo is added in the database
	expect(response.body[1].description).toEqual('Second task')
	expect(response.body[1].completed).toEqual(true)
	// console.log(response.body)
})

test('Should not delete other users tasks', async () => {
	await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404)
	const task = await Task.findById(taskOne._id)
	expect(task).not.toBeNull()
})

test('Should be able to delete task if authenticated', async () => {
	await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	const task = await Task.findById(taskOne._id)
	expect(task).toBeNull()
})

test('Should not delete task if unauthenticated', async () => {
	await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.send()
		.expect(401)
})

test('Should not update task with invalid input', async () => {
	await request(app)
		.patch(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			completed: 'Done'
		})
		.expect(400)
})

test('Should not update other users\' task', async () => {
	await request(app)
		.patch(`/tasks/${taskThree._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'New Task Three'
		})
		.expect(404)
})

test('Should fetch user task by id', async () => {
	const response = await request(app)
		.get(`/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	expect(response.body.description).toBe(taskOne.description)
})

test('Should not fetch task by id if unauthenticated', async () => {
	await request(app)
		.get(`/tasks/${taskOne._id}`)
		.send()
		.expect(401)
})

test('Should not fetch other users\' task by id', async () => {
	await request(app)
		.get(`/tasks/${taskThree._id}`)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(404)
})

test('Should fetch only completed task(s)', async () => {
	const response = await request(app)
			.get('/tasks?completed=true')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body.length).toBe(1)
})

test('Should fetch only incomplete task(s)', async () => {
	const response = await request(app)
			.get('/tasks?completed=false')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body.length).toBe(1)
})

test('Should sort task by description desc', async () => {
	const response = await request(app)
			.get('/tasks?sortBy=description:desc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].description).toBe('Second task')
})

test('Should sort task by description asc', async () => {
	const response = await request(app)
			.get('/tasks?sortBy=description:asc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].description).toBe('First task')
})

test('Should sort task by completed asc', async () => {
	const response = await request(app)
			.get('/tasks?sortBy=completed:asc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].completed).toBe(false)
	expect(response.body[1].completed).toBe(true)
})

test('Should sort task by completed desc', async () => {
	const response = await request(app)
			.get('/tasks?sortBy=completed:desc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].completed).toBe(true)
	expect(response.body[1].completed).toBe(false)
})

test('Should sort task by createdAt asc', async () => {
	const response = await request(app)
			.get('/tasks?sortBy=createdAt:asc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].description).toBe('First task')
	expect(response.body[1].description).toBe('Second task')
})

test('Should sort task by UpdatedAt desc', async () => {
	await Task.findByIdAndUpdate(taskOne._id, {description: 'Just updated task'})
	// await Task.findOneAndUpdate(taskOne, {description: 'Just updated task'})
	const response = await request(app)
			.get('/tasks?sortBy=updatedAt:desc')
			.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
			.send()
			.expect(200)
	expect(response.body[0].description).toBe('Just updated task')
	expect(response.body[1].description).toBe('Second task')
})

test('Should fetch page of tasks', async () => {
	const response = await request(app)
		.get('/tasks?limit=1')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	expect(response.body.length).toBe(1)
})