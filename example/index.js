// Use strict
"use strict";


// Require dependencies
const MwcPay = require("@nicolasflamel/mwc-pay");


// Main function
(async () => {

	// Initialize MWC Pay
	const mwcPay = new MwcPay();

	// Display message
	console.log("Creating payment");

	// Create payment
	const payment = await mwcPay.createPayment("123.456", 5, 600, "http://example.com/completed", "http://example.com/received", "http://example.com/confirmed", "http://example.com/expired");

	// Check if creating payment failed due to invalid parameters
	if(payment === null) {

		// Display error
		console.log("Invalid parameters");
	}

	// Otherwise check if creating payment failed due to a server error
	else if(payment === false) {

		// Display error
		console.log("Server error");
	}

	// Otherwise
	else {

		// Display payment's payment ID, URL, and recipient payment proof address
		console.log(`Payment ID: ${payment["payment_id"]}`);
		console.log(`URL: ${payment["url"]}`);
		console.log(`Recipient payment proof address: ${payment["recipient_payment_proof_address"]}`);
		
		// Display message
		console.log("Getting payment info");
		
		// Get payment info
		const paymentInfo = await mwcPay.getPaymentInfo(payment["payment_id"]);
		
		// Check if getting payment info failed due to invalid parameters
		if(paymentInfo === null) {

			// Display error
			console.log("Invalid parameters");
		}

		// Otherwise check if getting payment info failed due to a server error
		else if(paymentInfo === false) {

			// Display error
			console.log("Server error");
		}

		// Otherwise
		else {
		
			// Display payment info's URL, price, required confirmations, received, confirmations, time remaining, status, and recipient payment proof address
			console.log(`URL: ${paymentInfo["url"]}`);
			console.log("Price: " + ((paymentInfo["price"] === null) ? "N/A" : paymentInfo["price"]));
			console.log(`Required confirmations: ${paymentInfo["required_confirmations"]}`);
			console.log("Received: " + ((paymentInfo["received"] === true) ? "true" : "false"));
			console.log(`Confirmations: ${paymentInfo["confirmations"]}`);
			console.log("Time remaining: " + ((paymentInfo["time_remaining"] === null) ? "N/A" : paymentInfo["time_remaining"]));
			console.log(`Status: ${paymentInfo["status"]}`);
			console.log(`Recipient payment proof address: ${paymentInfo["recipient_payment_proof_address"]}`);
			
			// Display message
			console.log("Getting price");
			
			// Get price
			const price = await mwcPay.getPrice();
			
			// Check if getting price failed due to invalid parameters
			if(price === null) {

				// Display error
				console.log("Invalid parameters");
			}

			// Otherwise check if getting price failed due to a server error
			else if(price === false) {

				// Display error
				console.log("Server error");
			}

			// Otherwise
			else {
			
				// Display price
				console.log(`Price: ${price}`);
				
				// Display message
				console.log("Getting public server info");
				
				// Get public server info
				const publicServerInfo = await mwcPay.getPublicServerInfo();
				
				// Check if getting public server info failed due to invalid parameters
				if(publicServerInfo === null) {

					// Display error
					console.log("Invalid parameters");
				}

				// Otherwise check if getting public server info failed due to a server error
				else if(publicServerInfo === false) {

					// Display error
					console.log("Server error");
				}

				// Otherwise
				else {
				
					// Display public server info's URL and Onion Service address
					console.log(`URL: ${publicServerInfo["url"]}`);
					console.log("Onion Service address: " + ((publicServerInfo["onion_service_address"] === null) ? "N/A" : publicServerInfo["onion_service_address"]));
				}
			}
		}
	}
})();
