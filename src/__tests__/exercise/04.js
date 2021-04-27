// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from "faker";

test('submitting the form calls onSubmit with username and password', () => {
	let submittedData;

	const handleSubmit = data => (submittedData = data);

	// function handleSubmit(data){
	// 	submittedData = data;
	// }

	render(<Login onSubmit={handleSubmit}/>);

	const usernameField = screen.getByLabelText(/username/i);
	const passwordField = screen.getByLabelText(/password/i);

	const username = faker.internet.userName();
	const password = faker.internet.password();

	userEvent.type(usernameField, username);
	userEvent.type(passwordField, password);

	const submitButton = screen.getByRole("button", {name: /submit/i});
	userEvent.click(submitButton);

	expect(submittedData.username).toEqual(username);
	expect(submittedData.password).toEqual(password);
})

/*
eslint
  no-unused-vars: "off",
*/
