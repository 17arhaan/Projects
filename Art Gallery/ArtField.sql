TABLE PAINTINGS:

CREATE TABLE PAINTINGS (PCODE int not null primary key, PIECE varchar(30), ARTIST varchar(20), ACODE int, PRICE int, MAXVAL int);
insert into PAINTINGS values (1314, 'Morning Sun', 'Edward Hopper', 389, 78902, 100000);
insert into PAINTINGS values (9871, 'Convergence', 'Jackson Pollock', 711, 87702, 100000);
insert into PAINTINGS values (1355, 'The Son of Man', 'Rene Magritte', 833, 100702, 200000);
insert into PAINTINGS values (5690, 'The Scream', 'Edvard Munch', 327, 910702, 1000000);
insert into PAINTINGS values (8830, 'My Dress Hangs There', 'Frida Kahlo', 808, 999702, 2000000);
insert into PAINTINGS values (8831, 'Me and My Doll', 'Frida Kahlo', 808, 999581, 2000000);
insert into PAINTINGS values (7171, 'Lilacs in a Window', 'Mary Cassatt', 432, 99436, 200000);
insert into PAINTINGS values (6712, 'The Power of Letter', 'Abdul Qader Al Rais', 619, 89896, 100000);
insert into PAINTINGS values (6711, 'Years of Glory', 'Abdul Qader Al Rais', 619, 98896, 100000);
alter table PAINTINGS add STATUS varchar(10) default 'AVAILABLE';
update PAINTINGS set STATUS='SOLD' WHERE PCODE=5690;
update PAINTINGS set STATUS='SOLD' WHERE PCODE=9871;

TABLE BUYERS:

create table BUYERS (BCODE int(5) not null primary key, NAME varchar(30), PIECE varchar(30), PCODE int(5), PRICE int(9) DATE date);
insert into BUYERS values(3904, 'Johnny Johnson', 'Campbell Soup Cans', 1234, 98345, '2014-03-12');
insert into BUYERS values(2312, 'Elsa Lambda', 'The School of Athens', 1476, 49345, '2015-12-02'); 
insert into BUYERS values(8920, 'Poppy Leonard', 'The Scream', 5690, 910702, '2010-11-24');
insert into BUYERS values(3042, 'Anaina de Paine, 'Convergence', 9871, 87702, '2013-11-09');

TABLE INFO:

CREATE TABLE INFO (PCODE int not null primary key, NAME varchar(30), ARTIST varchar(20), ACODE int, YEAR int, PRICE int);
insert into INFO values (1314, 'Morning Sun', 'Edward Hopper', 389, 1952, 78902);
insert into INFO values (9871, 'Convergence', 'Jackson Pollock', 711, 1952, 87702);
insert into INFO values (1355, 'The Son of Man', 'Rene Magritte', 833, 1964, 100702);
insert into INFO values (5690, 'The Scream', 'Edvard Munch', 327, 1893, 910702);
insert into INFO values (8830, 'My Dress Hangs There', 'Frida Kahlo', 808, 1933, 999702);
insert into INFO values (8831, 'Me and My Doll', 'Frida Kahlo', 808, 1937, 999581);
insert into INFO values (7171, 'Lilacs in a Window', 'Mary Cassatt', 432, 1879, 99436);
insert into INFO values (6712, 'The Power of Letter', 'Abdul Qader Al Rais', 619, 2019, 89896);
insert into INFO values (6711, 'Years of Glory', 'Abdul Qader Al Rais', 619, 2016, 98896);
alter table INFO add STATUS varchar(10) default 'AVAILABLE';
update INFO set STATUS='SOLD' WHERE PCODE=5690;
update INFO set STATUS='SOLD' WHERE PCODE=9871;
