CREATE DATABASE IF NOT EXISTS BasedTicketingDB;
use BasedTicketingDB;

create table UserInfo(
FirstName varchar(250),
LastName varchar(250),
UserName varchar(250),
Password varchar(250),
Gender varchar(250),
DOB date,
Console varchar(250)
);

select * from userInfo;
