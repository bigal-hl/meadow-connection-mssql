/**
* Unit tests for the Linked List ADT
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require('chai');
const Expect = Chai.expect;
const Assert = Chai.assert;

const libFable = require('fable');
const libMeadowConnectionMSSQL = require('../source/Meadow-Connection-MSSQL.js');

const _FableConfig = (
	{
		"Product": "MeadowMSSQLTestBookstore",
		"ProductVersion": "1.0.0",

		"UUID":
			{
				"DataCenter": 0,
				"Worker": 0
			},
		"LogStreams":
			[
				{
					"streamtype": "console"
				}
			],

		"MSSQL":
			{
				"server": "localhost",
				"port": 14333,
				"user": "sa",
				"password": "1234567890abc.",
				"database": "bookstore",
				"ConnectionPoolLimit": 20
			}
	});

suite
(
	'Connection',
	()=>
	{
		setup(()=>{});

		suite
		(
			'Connect to MSSQL',
			()=>
			{
				test
				(
					'use default settings from fable.settings',
					(fDone) =>
					{
						let _Fable = new libFable(_FableConfig);
						_Fable.serviceManager.addServiceType('MeadowMSSQLProvider', libMeadowConnectionMSSQL);

						_Fable.serviceManager.instantiateServiceProvider('MeadowMSSQLProvider');

						Expect(_Fable.MeadowMSSQLProvider).to.be.an('object');

						_Fable.MeadowMSSQLProvider.connectAsync(
							(pError) =>
							{
								if (pError)
								{
									return fDone(pError);
								}
								_Fable.MeadowMSSQLProvider.pool.query(`SELECT TOP 10 * FROM FableTest`,
									(pError, pRows, pFields) =>
									{
										Expect(pRows.recordset).to.be.an('array');
										//Expect(pRows.length).to.equal(10);
										//Expect(pRows[0].Title).to.equal(`Harry Potter and the Philosopher's Stone`);
										return fDone();
									});
							}
						);
					}
				);
			}
		);
	}
);