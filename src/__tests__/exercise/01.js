// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../../components/counter'

test('counter increments and decrements when the buttons are clicked', () => {
	var div = document.createElement("div");
	document.body.append(div);

	ReactDOM.render(<Counter />, div);

	var buttons = div.querySelectorAll("button");
	var increment, decrement;
	
	buttons.forEach((button) => {
		if(button.innerHTML.includes("Increment")){
			increment = button;
		} else if(button.innerHTML.includes("Decrement")){
			decrement = button;
		}
	});

	var message = div.firstChild.querySelector("div");

	expect(message.textContent).toBe("Current count: 0");

	increment.click();
	expect(message.textContent).toBe("Current count: 1");

	decrement.click();
	decrement.click();
	expect(message.textContent).toBe("Current count: -1");

	div.remove();
});

/* eslint no-unused-vars:0 */
