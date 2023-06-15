# Tech Challenge

**Name:** Backend SQL Orchestrator (2 hrs)

**Details:** Create an Server that can process multiple DB request synchronously and revert them accurately if there is a conflict. The curl commands shows 2 cases when sql is reverted. Do think about other cases for the interview. (Implementing more revert cases is not required)

**Technical Specs:**

1. Typescript with Nest Backend Server
2. SQL Server of your choice needs to run on local computer, needs to run on separate port from Backend Server, SQLite doesn't meet the standards mentioned unless you run an encapsulation server.
3. Docker set to run on “ubuntu-latest”, to run setup of DB before Server setup on Docker Compose

```sql
CREATE TABLE Users (
	Uid int NOT NULL,
	Username varchar(255) NOT NULL,
	City varchar(255) NOT NULL,
	Friend int,
	PRIMARY KEY (Uid),
	FOREIGN KEY (Friend) REFERENCES Users(Uid)
);
```

Tests:

```bash
# add 1 user (NO ERROR, NO REVERT)
curl -X POST http://127.0.0.1:8000/user/addMultiple -H 'Content-Type: application/json' -d '{"type":"my_login","cmd_chain": [{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (1, 'tom', 'France', NULL);"}]}'

return_object = {
	status: "ok", # status 200
	dbState: ["(1, 'tom', 'France', NULL)"]
}

# add same user (RETURN ERROR CODE, REVERT CHANGE)
curl -X POST http://localhost:8000/user/addMultiple
   -H 'Content-Type: application/json'
   -d '{"type":"my_login","cmd_chain":[{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (2, 'frog', 'France', NULL);"},{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (1, 'sammy', 'France', NULL);"}]}'

return_object = {
	status: "error", # status 400
	dbState: ["(1, 'tom', 'France', NULL)"]
}

# add 2 users synchronously (NO ERROR, NO REVERT)
curl -X POST http://localhost:8000/user/addMultiple
   -H 'Content-Type: application/json'
   -d '{"type":"my_login","cmd_chain":[{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (2, 'frog', 'France', NULL);"},{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (3, 'sam', 'England', 1);"}]}'

return_object = {
	status: "ok", # status 200
	dbState: ["(1, 'tom', 'France', NULL)", "(2, 'frog', 'France', NULL)", "(3, 'sam', 'England', 1)"]
}

# Invalid Foreign Key error thrown by DB (RETURN ERROR CODE, REVERT CHANGE)
curl -X POST http://localhost:8000/user/addMultiple
   -H 'Content-Type: application/json'
   -d '{"type":"my_login","cmd_chain":[{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (4, 'croak', 'Malaysia', NULL);"},{"type":"sql_safe","cmd":"INSERT INTO Users (Uid, Username, City, Friend) VALUES (5, 'ding', 'Finland', 100);"}]}'

return_object = {
	status: "error", # status 400
	dbState: ["(1, 'tom', 'France', NULL)", "(2, 'frog', 'France', NULL)", "(3, 'sam', 'England', 1)"]
}
```