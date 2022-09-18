CREATE DATABASE IF NOT EXISTS BasedTicketingDB;
use BasedTicketingDB;

create table UserInfo(
UserID varchar(250),
FirstName varchar(250),
LastName varchar(250),
UserName varchar(250),
Password varchar(250),
Gender varchar(250),
DOB date,
Console varchar(250),
Role varchar(10),
CreatedAt timestamp
);

select * from UserInfo;

select UserID, Password, Role from UserInfo where UserName = 'MaxPayne';

drop table UserInfo;

truncate table userInfo;
