<?php // setup.php
include_once 'function.php';

createTable('login',  'id VARCHAR(16) not null, password VARCHAR(16) not null, primary key(id)');

createTable('member',  
					'id VARCHAR(16) not null, 
					name VARCHAR(32), 
					sex VARCHAR(5), 
					birthday DATE,
					email VARCHAR(255),
					primary key(id)');

createTable('board',  
					'number INT UNSIGNED AUTO_INCREMENT,
					owner VARCHAR(16) not null,
					title VARCHAR(128) not null,
					id VARCHAR(16) not null, 
					day DATE,
					time VARCHAR(16),
					open tinyint,
					content VARCHAR(2048),
					primary key(number, owner)');

createTable('reply',
				    'reply_number INT UNSIGNED AUTO_INCREMENT,
				    number INT not null,
				    owner VARCHAR(16) not null,
				    id VARCHAR(16) not null,
				    reply VARCHAR(1024),
				    day VARCHAR(16),
				    primary key(reply_number, number, owner)');

createTable('checked',
				    'id VARCHAR(16) not null,
				    member VARCHAR(16) not null,
				    INDEX(id(16)), INDEX(member(16))');

createTable('chat',
                    'id VARCHAR(16) not null,
                    tweet VARCHAR(256) not null,
                    day DATETIME,
                    INDEX(id(16))');
