// Use strict
"use strict";


// Require dependencies
const http = require("node:http");
const https = require("node:https");
const querystring = require("node:querystring"); 


// Classes

// MWC Pay class
class MwcPay {

	// Private server
	#privateServer;
	
	// Protocol
	#protocol;
	
	// Constructor
	/**
	* @param {string} privateServer
	* @returns {MwcPay}
	*/
	constructor(privateServer = "http://localhost:9010") {
	
		// Check if parameters are invalid
		if(typeof privateServer !== "string") {
		
			// Throw error
			throw new Error("Invalid parameters");
		}
		
		// Set private server
		this.#privateServer = privateServer;
		
		// Try
		try {
		
			// Set protocol
			this.#protocol = (new URL(privateServer).protocol === "https:") ? https : http;
		}
		
		// Catch errors
		catch(error) {
		
			// Set protocol
			this.#protocol = http;
		}
	}
	
	// Create payment
	/**
	* @param {string | null} price
	* @param {number | null} requiredConfirmations
	* @param {number | null} timeout
	* @param {string} completedCallback
	* @param {string | null} receivedCallback
	* @param {string | null} confirmedCallback
	* @param {string | null} expiredCallback
	* @returns {{payment_id: string, url: string, recipient_payment_proof_address: string} | false | null}
	*/
	async createPayment(price, requiredConfirmations, timeout, completedCallback, receivedCallback = null, confirmedCallback = null, expiredCallback = null) {
	
		// Check if parameters are invalid
		if((typeof price !== "string" && price !== null) || (typeof requiredConfirmations !== "number" && requiredConfirmations !== null) || (typeof timeout !== "number" && timeout !== null) || typeof completedCallback !== "string" || (typeof receivedCallback !== "string" && receivedCallback !== null) || (typeof confirmedCallback !== "string" && confirmedCallback !== null) || (typeof expiredCallback !== "string" && expiredCallback !== null)) {
		
			// Return null
			return null;
		}
		
		// Try
		let createPaymentResponse;
		try {
		
			// Send create payment request to the private server
			createPaymentResponse = await this.#sendRequest("/create_payment?" + querystring.stringify(Object.fromEntries(Object.entries({
			
				// Price
				price,
				
				// Required confirmations
				required_confirmations: requiredConfirmations,
				
				// Timeout
				timeout,
				
				// Completed callback
				completed_callback: completedCallback,
				
				// Received callback
				received_callback: receivedCallback,
				
				// Confirmed callback
				confirmed_callback: confirmedCallback,
				
				// Expired callback
				expired_callback: expiredCallback
				
			}).filter(([key, value]) => {
			
				// Return if value isn't null
				return value !== null;
			}))));
		}
		
		// Catch errors
		catch(error) {
		
			// Check if an error occurred on the private server
			if(error === undefined || error === 500) {
			
				// Return false
				return false;
			}
			
			// Otherwise assume request was invalid
			else {
			
				// Return null
				return null;
			}
		}
		
		// Try
		let paymentInfo;
		try {
		
			// Get payment info from create payment response
			paymentInfo = JSON.parse(createPaymentResponse);
		}
		
		// Catch errors
		catch(error) {
		
			// Return false
			return false;
		}
		
		// Check if payment info's payment ID, URL, or recipient payment proof address are invalid
		if(typeof paymentInfo !== "object" || paymentInfo === null || "payment_id" in paymentInfo === false || typeof paymentInfo["payment_id"] !== "string" || paymentInfo["payment_id"] === "" || "url" in paymentInfo === false || typeof paymentInfo["url"] !== "string" || paymentInfo["url"] === "" || "recipient_payment_proof_address" in paymentInfo === false || typeof paymentInfo["recipient_payment_proof_address"] !== "string" || paymentInfo["recipient_payment_proof_address"] === "") {
		
			// Return false
			return false;
		} 
		
		// Return payment info's payment ID, URL, and recipient payment proof address
		return {
		
			// Payment ID
			payment_id: paymentInfo["payment_id"],
			
			// URL
			url: paymentInfo["url"],
			
			// Recipient payment proof address
			recipient_payment_proof_address: paymentInfo["recipient_payment_proof_address"]
		};
	}
	
	// Get payment info
	/**
	* @param {string} paymentId
	* @returns {{url: string, price: string | null, required_confirmations: number, received: boolean, confirmations: number, time_remaining: number | null, status: string, recipient_payment_proof_address: string} | false | null}
	*/
	async getPaymentInfo(paymentId) {
	
		// Check if parameters are invalid
		if(typeof paymentId !== "string") {
		
			// Return null
			return null;
		}
		
		// Try
		let getPaymentInfoResponse;
		try {
		
			// Send get payment info request to the private server
			getPaymentInfoResponse = await this.#sendRequest("/get_payment_info?" + querystring.stringify({
			
				// Payment ID
				payment_id: paymentId
				
			}));
		}
		
		// Catch errors
		catch(error) {
		
			// Check if an error occurred on the private server
			if(error === undefined || error === 500) {
			
				// Return false
				return false;
			}
			
			// Otherwise assume request was invalid
			else {
			
				// Return null
				return null;
			}
		}
		
		// Try
		let paymentInfo;
		try {
		
			// Get payment info from get payment info response
			paymentInfo = JSON.parse(getPaymentInfoResponse);
		}
		
		// Catch errors
		catch(error) {
		
			// Return false
			return false;
		}
		
		// Check if payment info's URL, price, required confirmations, received, confirmations, time remaining, status, or recipient payment proof address are invalid
		if(typeof paymentInfo !== "object" || paymentInfo === null || "url" in paymentInfo === false || typeof paymentInfo["url"] !== "string" || paymentInfo["url"] === "" || "price" in paymentInfo === false || (paymentInfo["price"] !== null && typeof paymentInfo["price"] !== "string") || (paymentInfo["price"] !== null && paymentInfo["price"].match(/^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/u) === null) || "required_confirmations" in paymentInfo === false || typeof paymentInfo["required_confirmations"] !== "number" || paymentInfo["required_confirmations"] <= 0 || "received" in paymentInfo === false || typeof paymentInfo["received"] !== "boolean" || "confirmations" in paymentInfo === false || typeof paymentInfo["confirmations"] !== "number" || paymentInfo["confirmations"] < 0 || paymentInfo["confirmations"] > paymentInfo["required_confirmations"] || "time_remaining" in paymentInfo === false || (paymentInfo["time_remaining"] !== null && typeof paymentInfo["time_remaining"] !== "number") || (paymentInfo["time_remaining"] !== null && paymentInfo["time_remaining"] < 0) || "status" in paymentInfo === false || typeof paymentInfo["status"] !== "string" || "recipient_payment_proof_address" in paymentInfo === false || typeof paymentInfo["recipient_payment_proof_address"] !== "string" || paymentInfo["recipient_payment_proof_address"] === "") {
		
			// Return false
			return false;
		} 
		
		// Return payment info's URL, price, required confirmations, received, confirmations, time remaining, status, and recipient payment proof address
		return {
		
			// URL
			url: paymentInfo["url"],
			
			// Price
			price: paymentInfo["price"],
			
			// Required confirmations
			required_confirmations: paymentInfo["required_confirmations"],
			
			// Received
			received: paymentInfo["received"],
			
			// Confirmations
			confirmations: paymentInfo["confirmations"],
			
			// Time remaining
			time_remaining: paymentInfo["time_remaining"],
			
			// Status
			status: paymentInfo["status"],
			
			// Recipient payment proof address
			recipient_payment_proof_address: paymentInfo["recipient_payment_proof_address"]
		};
	}
	
	// Get price
	/**
	* @returns {string | false | null}
	*/
	async getPrice() {
	
		// Try
		let getPriceResponse;
		try {
		
			// Send get price request to the private server
			getPriceResponse = await this.#sendRequest("/get_price");
		}
		
		// Catch errors
		catch(error) {
		
			// Check if an error occurred on the private server
			if(error === undefined || error === 500) {
			
				// Return false
				return false;
			}
			
			// Otherwise assume request was invalid
			else {
			
				// Return null
				return null;
			}
		}
		
		// Try
		let price;
		try {
		
			// Get price from get price response
			price = JSON.parse(getPriceResponse);
		}
		
		// Catch errors
		catch(error) {
		
			// Return false
			return false;
		}
		
		// Check if price is invalid
		if(typeof price !== "object" || price === null || "price" in price === false || typeof price["price"] !== "string" || price["price"].match(/^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/u) === null) {
		
			// Return false
			return false;
		} 
		
		// Return price
		return price["price"];
	}
	
	// Get public server info
	/**
	* @returns {{url: string, onion_service_address: string | null} | false | null}
	*/
	async getPublicServerInfo() {
	
		// Try
		let getPublicServerInfoResponse;
		try {
		
			// Send get public server info request to the private server
			getPublicServerInfoResponse = await this.#sendRequest("/get_public_server_info");
		}
		
		// Catch errors
		catch(error) {
		
			// Check if an error occurred on the private server
			if(error === undefined || error === 500) {
			
				// Return false
				return false;
			}
			
			// Otherwise assume request was invalid
			else {
			
				// Return null
				return null;
			}
		}
		
		// Try
		let publicServerInfo;
		try {
		
			// Get public server info from get public server info response
			publicServerInfo = JSON.parse(getPublicServerInfoResponse);
		}
		
		// Catch errors
		catch(error) {
		
			// Return false
			return false;
		}
		
		// Check if public server info's URL or Onion Service address are invalid
		if(typeof publicServerInfo !== "object" || publicServerInfo === null || "url" in publicServerInfo === false || typeof publicServerInfo["url"] !== "string" || publicServerInfo["url"] === "" || "onion_service_address" in publicServerInfo === false || (publicServerInfo["onion_service_address"] !== null && typeof publicServerInfo["onion_service_address"] !== "string") || (publicServerInfo["onion_service_address"] !== null && publicServerInfo["onion_service_address"] === "")) {
		
			// Return false
			return false;
		} 
		
		// Return public server info's URL and Onion Service address
		return {
		
			// URL
			url: publicServerInfo["url"],
			
			// Onion Service address
			onion_service_address: publicServerInfo["onion_service_address"]
		};
	}
	
	// Send request
	#sendRequest(request) {
	
		// Return promise
		return new Promise((resolve, reject) => {
		
			// Initialize data
			let data = "";
			
			// Send request to private server
			this.#protocol.request(this.#privateServer + request, (response) => {
			
				// Check if response's status code isn't valid
				if(response.statusCode !== 200) {
				
					// Reject response's status code
					reject(response.statusCode);
				}
				
				// Response data event
				response.on("data", (chunk) => {
				
					// Append chunk to data
					data += chunk.toString();
				});
			
				// Response end event
				response.on("end", () => {
				
					// Resolve data
					resolve(data);
				});
			
			// Request error event
			}).on("error", (error) => {
			
				// Reject
				reject();
				
			}).end();
		});
	}
}


// Exports
module.exports = MwcPay;
