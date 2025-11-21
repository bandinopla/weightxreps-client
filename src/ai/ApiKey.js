/**
 * Stores API key in localStorage encrypted with a password: Your API key is scrambled using a strong encryption method 
 * before it’s stored. Only someone with your password can unscramble it. 
 * Even if someone gets the stored data, they can’t read your key without the password.
 */
export class ApiKey {

	/** @type {string} */
	#cacheKey;

	/**
	 * @type {string}
	 */
	#apiKey;

	/** 
	 * @param {string} cacheKey 
	 * @param {string} [fixedApiKey] 
	 */
	constructor(cacheKey, fixedApiKey) {
		this.#cacheKey = cacheKey;
		if( fixedApiKey )
		{
			this.#apiKey = fixedApiKey;
		}
	}

	/** 
	 * Gets the session data from the currently logged in user...
	 * @returns { ({ id:number, uname:string})|false }
	 */
	#getSession() {
		const stoken = localStorage.getItem(`token`);

		if(!stoken) throw new Error(`You must be logged in to use this feature. Please log in!`);

		return JSON.parse( atob( stoken.split(".")[1] )) ?? false
	}

	async #getDKey(pass) {
		return crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(pass),
			"PBKDF2",
			false,
			["deriveKey"]
		).then(base =>
			crypto.subtle.deriveKey(
				{ name: "PBKDF2", salt: new Uint8Array(16), iterations: 100000, hash: "SHA-256" },
				base,
				{ name: "AES-GCM", length: 256 },
				false,
				["encrypt", "decrypt"]
			)
		);
	}



	#decrypt = async (obj, pass) => {
		const key = await this.#getDKey(pass);
		const buf = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: obj.iv },
			key,
			obj.data
		);
		return new TextDecoder().decode(buf);
	};

	// encrypt
	#encrypt = async (text, pass) => {
		const key = await this.#getDKey(pass);
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const buf = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv },
			key,
			new TextEncoder().encode(text)
		);
		return { iv, data: new Uint8Array(buf) };
	};

	/** 
	 * @param {( askPasswordOnly:boolean )=>Promise<{ apiKey?:string, pass:string }>} askKeyToUser 
	 */
	async getKey(askKeyToUser) {

		if( this.#apiKey ) return this.#apiKey;
 
		const session = this.#getSession()

		if(!session) throw new Error(`Invalid session data, this is weird... mmmh... try log out and log in again?`);

		const cacheKey = `${session.id}::${this.#cacheKey}`;

		const keyData = localStorage.getItem( cacheKey );

		//
		// it is not in the localStorage, lets ask the user for the api key then
		//
		if (!keyData) {
			// it is not in the cahce... ask the key to the user 
	
			const info = await askKeyToUser(false);

			if(!info.apiKey) throw new Error(`You need to provide an api key to use this AI`);

			await this.#saveApiKey(cacheKey, info) 
		}

		//
		// ok, we have something on the localStorage, lets ask the user the passphrase to decode it...
		//
		else { 
			 
			const keyDataObj = JSON.parse(keyData);
			const keyPayload = {
				iv: new Uint8Array(keyDataObj.iv),
				data: new Uint8Array(keyDataObj.data)
			}

			const info = await askKeyToUser(true);

			if( info.apiKey )
			{
				// it probably means the user decided to reset because he forgot the password...
				await this.#saveApiKey(cacheKey, info) 
			}
			else 
			{
				if( !info.pass) throw new Error(`Provide the password so I can decrypt the stored api key`);

				try
				{
					this.#apiKey = await this.#decrypt( keyPayload, info.pass ); 
				}
				catch(err)
				{
					throw new Error(`Invalid ApiKey password`)
				}
			}  
		}

		return this.#apiKey;
	}

	/**
	 * 
	 * @param {string} cacheKey 
	 * @param {{ apiKey:string, pass:string }} info 
	 */
	async #saveApiKey( cacheKey, info )
	{
		this.#apiKey = info.apiKey;

		//store it...
		const keyDataObj = await this.#encrypt(info.apiKey, info.pass) 

		localStorage.setItem( cacheKey, JSON.stringify({
													    iv: Array.from(keyDataObj.iv),
													    data: Array.from(keyDataObj.data)
													  }));  
	}

	clear() {
		this.#apiKey = undefined;
		
		try 
		{
			const session = this.#getSession()
			const cacheKey = `${session.id}::${this.#cacheKey}`;
			localStorage.removeItem(cacheKey);
		}
		catch(err){
			//ignore???
		}
	}
}