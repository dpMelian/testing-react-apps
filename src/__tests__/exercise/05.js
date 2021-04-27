// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {waitForElementToBeRemoved} from '@testing-library/react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const {username, password} = buildLoginForm()

const server = setupServer(
  rest.post(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
      if(!req.body.password && req.body.username){
        return res(ctx.status(400), ctx.json({message: 'password required'}))
      }
      if(!req.body.username && req.body.password){
        return res(ctx.status(400), ctx.json({message: 'username required'}))
      }
      if(!req.body.username && !req.body.password){
        return res(ctx.status(400), ctx.json({message: 'username and password required'}))
      }
      return res(ctx.json({username: req.body.username}))
    }
  ),
)

beforeAll(() => server.listen())
afterAll(() => server.close())

test(`if logging in displays the user's username`, async () => {
  render(<Login />)

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => 
    screen.getByLabelText(/loading.../i)
  )
  expect(screen.getByText(username)).toBeInTheDocument()
})

test('if login without password displays error', async () => {
  render(<Login />)

  userEvent.type(screen.getByLabelText(/username/i), username)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() =>
    screen.getByLabelText(/loading.../i)
  )

  expect(screen.getByRole('alert')).toHaveTextContent('password required')
})

test('if login without username displays error', async () => {
  render(<Login />)

  userEvent.type(screen.getByLabelText(/password/i), password)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() =>
    screen.getByLabelText(/loading.../i)
  )

  expect(screen.getByRole('alert')).toHaveTextContent('username required')
})

test('if login without username and password displays error', async () => {
  render(<Login />)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() =>
    screen.getByLabelText(/loading.../i)
  )

  expect(screen.getByRole('alert')).toHaveTextContent('username and password required')
})
