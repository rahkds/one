var mysql = require('mysql');
var redis = require('redis');

global.redisClient = redis.createClient();

var mysqlPool = mysql.createPool({
	host: MYSQL_CONFIG.HOST,
	user: MYSQL_CONFIG.USERNAME,
	password: MYSQL_CONFIG.PASSWORD,
	database: MYSQL_CONFIG.DATABASE,
});


global.queryExecute = async function(query, parameters) {
	return new Promise(function(resolve, reject) {
		mysqlPool.query(query, parameters, function(err, rows) {
			console.log(this.sql);
			if (err) {
				console.error(err);
				return reject(err);
			}
			return resolve(rows);
		})
	});
}