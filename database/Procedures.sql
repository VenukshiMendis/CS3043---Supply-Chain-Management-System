CREATE PROCEDURE `add_products_to_the_cart`(customer_email varchar(255),product_ID int,quantity int)
BEGIN
	SET AUTOCOMMIT=0;
	insert into cart(cart.customer_email,cart.product_ID,cart.quantity)  values(customer_email,product_ID,quantity);
	COMMIT;
END


CREATE PROCEDURE `remove_product_from_cart` (customer_email varchar(255),product_ID int)
BEGIN
	SET AUTOCOMMIT=0;
	DELETE FROM cart WHERE cart.customer_email= customer_email and cart.product_ID=product_ID;
	COMMIT;
END


CREATE PROCEDURE `add_new_order1`(customer_email varchar(255),route_name varchar(255),address varchar(255),order_status varchar(255),
order_date 	datetime)
BEGIN
 SET AUTOCOMMIT=0;
 DECLARE customer_ID int;
 DECLARE route_ID int;
 DECLARE order_ID int;
 DECLARE total_price decimal(10,2);
 DECLARE total_capacity int;
 
 SELECT customer.customer_ID into customer_ID from customer where customer.email=customer_email;

 SELECT route.route_ID into route_ID from route where route.route_name = route_name ;
 
 SELECT  sum(cart.quantity*unit_price) into total_price from cart join product using(product_ID) where cart.customer_email=customer_email;
 
 SELECT  sum(cart.quantity*unit_capacity) into total_capacity from cart join product using(product_ID) where cart.customer_email=customer_email;


 INSERT into order_info(order_info.customer_ID,order_info.route_ID,order_info.status,order_info.order_date,order_info.address,order_info.total_price,order_info.total_capacity) 
 values(customer_ID,route_ID,order_status,order_date,address,total_price,total_capacity);
 SET order_ID = LAST_INSERT_ID();
 SET SQL_SAFE_UPDATES = 0;
 UPDATE  cart SET cart.order_ID = order_ID where cart.customer_email=customer_email;
 
 INSERT into order_details(order_details.order_ID,order_details.product_ID,order_details.quantity) SELECT order_ID,product_ID,quantity from cart where cart.order_ID=order_ID;
 
 DELETE from cart where cart.order_ID =order_ID;
 SET SQL_SAFE_UPDATES = 1;
 
 COMMIT;
END


CREATE  PROCEDURE `get_order_history`(customer_email varchar(255))
BEGIN
	DECLARE customer_ID int;
	SELECT customer.customer_ID into customer_ID from customer where customer.email=customer_email;
    SELECT  order_ID,route_name,order_date,address,total_price from order_info join route using(route_ID) where order_info.customer_ID = customer_ID;
END

CREATE PROCEDURE `get_unconfirmed_order_history`(customer_email varchar(255))
BEGIN
	DECLARE customer_ID int;
	SELECT customer.customer_ID into customer_ID from customer where customer.email=customer_email;
    SELECT  order_ID,route_name,order_date,address,total_price from order_info join route using(route_ID) where order_info.customer_ID = customer_ID and status='Not confirmed';
END


--PROCEDURES RELATED TO DRIVER AND DRIVER ASSISTANT (8)

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_completed_trips_d`(user_email varchar(255))
BEGIN
	DECLARE user_ID int;
	SELECT driver.employee_ID into user_ID from driver where driver.email=user_email;
    SELECT t.truck_turn_ID, t.turn_start_time, t.route_ID, r.route_name, t.vehicle_no, d.name as driver_name,
    da.name as driver_assistant_name
    FROM turn t join driver d on t.driver_ID = d.employee_ID 
    join driver_assistant da on t.driver_assistant_ID = da.employee_ID
    join route r on t.route_ID = r.route_ID  
    WHERE t.driver_ID = user_ID AND actual_end_time is not null ORDER BY turn_start_time;
    
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_completed_trips_da`(user_email varchar(255))
BEGIN
	DECLARE user_ID int;
	SELECT driver_assistant.employee_ID into user_ID from driver_assistant where driver_assistant.email=user_email;
    SELECT t.truck_turn_ID, t.turn_start_time, t.route_ID, r.route_name, t.vehicle_no, d.name as driver_name,
    da.name as driver_assistant_name
    FROM turn t join driver d on t.driver_ID = d.employee_ID 
    join driver_assistant da on t.driver_assistant_ID = da.employee_ID
    join route r on t.route_ID = r.route_ID
    WHERE t.driver_assistant_ID = user_ID AND actual_end_time is not null ORDER BY turn_start_time;
    
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_upcoming_trips_d`(user_email varchar(255))
BEGIN
	DECLARE user_ID int;
	SELECT driver.employee_ID into user_ID from driver where driver.email=user_email;
    SELECT t.truck_turn_ID, t.turn_start_time, t.route_ID, r.route_name, t.vehicle_no,d.name as driver_name,
    da.name as driver_assistant_name
    FROM turn t join driver d on t.driver_ID = d.employee_ID 
    join driver_assistant da on t.driver_assistant_ID = da.employee_ID
    join route r on t.route_ID = r.route_ID
    WHERE t.driver_ID = user_ID AND actual_end_time is null ORDER BY turn_start_time;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_upcoming_trips_da`(user_email varchar(255))
BEGIN
	DECLARE user_ID int;
	SELECT driver_assistant.employee_ID into user_ID from driver_assistant where driver_assistant.email=user_email;
    SELECT t.truck_turn_ID, t.turn_start_time, t.route_ID, r.route_name, t.vehicle_no,d.name as driver_name,
    da.name as driver_assistant_name
    FROM turn t join driver d on t.driver_ID = d.employee_ID 
    join driver_assistant da on t.driver_assistant_ID = da.employee_ID
    join route r on t.route_ID = r.route_ID
    WHERE t.driver_assistant_ID = user_ID AND actual_end_time is null ORDER BY turn_start_time;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_actual_end_time`(turnID int)
BEGIN
	DECLARE currentTime datetime;
    SET AUTOCOMMIT = 0;
	SELECT sysdate() into currentTime;
    UPDATE turn SET actual_end_time = currentTime WHERE truck_turn_ID = turnID;
    
    Call update_roster_worked_hours(turnID);
    
    COMMIT;
    
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_actual_start_time`(turnID int)
BEGIN
	DECLARE currentTime datetime;
	SELECT sysdate() into currentTime;
    UPDATE turn SET actual_start_time = currentTime WHERE truck_turn_ID = turnID;
    
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_order_status`(orderID int)
BEGIN
	DECLARE turnID int;
    
    UPDATE order_info SET status = 'Delivered' WHERE order_ID = orderID;
    SELECT truck_assignment.truck_turn_ID into turnID from truck_assignment where order_ID=orderID;
    SELECT truck_turn_ID,order_ID, name, phone, address, status FROM turn_order_info where truck_turn_id = turnID ;
	
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_roster_worked_hours`(turnID int)
BEGIN
	DECLARE tripDuration Time;
    DECLARE dID int;
    DECLARE daID int;
    
	SET AUTOCOMMIT=0;
    SELECT TimeDiff(actual_end_time,actual_start_time) into tripDuration from turn where truck_turn_ID = turnID;
    SELECT driver_ID into dID from turn where truck_turn_ID = turnID;
    SELECT driver_assistant_ID into daID from turn where truck_turn_ID = turnID;
    
    
    IF EXISTS (SELECT employee_ID FROM driver_roster WHERE employee_ID = dID ) THEN
	UPDATE driver_roster
		SET
		total_worked_hours_for_the_week =  total_worked_hours_for_the_week  + MINUTE(tripDuration)/60
		WHERE employee_ID = dID;
	END IF;
    
	IF EXISTS (SELECT employee_ID FROM driver_assistant_roster WHERE employee_ID = daID ) THEN
	UPDATE driver_assistant_roster
		SET
		total_worked_hours_for_the_week =  total_worked_hours_for_the_week  + MINUTE(tripDuration)/60
		WHERE employee_ID = daID;
	END IF;
    
    
    COMMIT;
END


--END OF PROCEDURES RELATED TO DRIVER AND DRIVER ASSISTANT

--PROCEDURES RELATED TO STOREMANAGER

DELIMITER //
CREATE PROCEDURE get_store_id (storemanager_email varchar(255))
BEGIN
SELECT store_ID
FROM store_manager
where email = storemanager_email;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_drivers (st_id INT(10),rt_id INT(10), departure_time DATETIME)
BEGIN
DECLARE completion_time TIME;

SELECT max_completion_time INTO completion_time FROM route WHERE route_ID = rt_id;

WITH drivers AS (SELECT * FROM driver_details WHERE store_ID = st_id),

departure_times_of_drivers AS
(SELECT drivers.employee_ID, MAX(turn_start_time) AS recent_turn_start_time, route_ID, total_worked_hours_for_the_week, assigned_working_hours_for_the_week, truck_turn_ID, drivers.store_ID, (MAX(turn_start_time) + completion_time) AS time_to_next_turn FROM drivers LEFT OUTER JOIN turn ON drivers.employee_ID = turn.driver_ID GROUP BY turn.driver_ID),

new_weekly_working_hours AS (SELECT departure_times_of_drivers.employee_ID, (total_worked_hours_for_the_week + (completion_time)) AS weekly_working_hours FROM departure_times_of_drivers)

SELECT * FROM departure_times_of_drivers LEFT OUTER JOIN route USING(route_ID) WHERE ((truck_turn_ID IS NULL AND assigned_working_hours_for_the_week + HOUR(completion_time) < 40) OR (TIMEDIFF(departure_time, time_to_next_turn) > "01:00:00" AND assigned_working_hours_for_the_week + HOUR(completion_time) < 40));
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_driver_assistants (st_id INT(10),rt_id INT(10), departure_time DATETIME)
BEGIN
DECLARE completion_time TIME;

SELECT max_completion_time INTO completion_time FROM route WHERE route_ID = rt_id;

WITH driver_assistants AS (SELECT * FROM driver_assistant_details WHERE store_ID = st_id),

departure_times_of_driver_assistants AS
(SELECT driver_assistants.employee_ID, MAX(turn_start_time) AS recent_turn_start_time, route_ID, total_worked_hours_for_the_week, assigned_working_hours_for_the_week,consecutive_turn, truck_turn_ID, driver_assistants.store_ID, (MAX(turn_start_time) + completion_time) AS time_to_next_turn FROM driver_assistants LEFT OUTER JOIN turn ON driver_assistants.employee_ID = turn.driver_assistant_ID GROUP BY turn.driver_assistant_ID),

new_weekly_working_hours AS (SELECT departure_times_of_driver_assistants.employee_ID, (total_worked_hours_for_the_week + (completion_time)) AS weekly_working_hours FROM departure_times_of_driver_assistants)

SELECT * FROM departure_times_of_driver_assistants LEFT OUTER JOIN route USING(route_ID) WHERE ((truck_turn_ID IS NULL AND assigned_working_hours_for_the_week + HOUR(completion_time) < 60) OR (TIMEDIFF(departure_time, time_to_next_turn) > "01:00:00" AND assigned_working_hours_for_the_week + HOUR(completion_time) < 60) OR (TIMEDIFF(departure_time, time_to_next_turn) > "00:00:00" AND TIMEDIFF(departure_time, time_to_next_turn) < "01:00:00" AND assigned_working_hours_for_the_week + HOUR(completion_time) < 60) AND consecutive_turn < 1);
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE assign_driver_and_driver_assistant (st_id INT(10),rt_id INT(10), departure_time DATETIME, vehi_No VARCHAR(20), driver_assistant_id INT(10), driver_id INT(10))
BEGIN
DECLARE completion_time TIME;
DECLARE is_consecutive TIME;
SET AUTOCOMMIT = 0;
SELECT @turn_id := (MAX(truck_turn_ID) + 1) FROM turn;
SELECT max_completion_time INTO completion_time FROM route WHERE route_ID = rt_id;

WITH driver_assistants AS (SELECT * FROM driver_assistant_details WHERE store_ID = st_id),
schedule_details_of_driver_assistant AS
(SELECT * FROM driver_assistants LEFT OUTER JOIN turn ON turn.driver_assistant_ID = driver_assistants.employee_ID),
            
get_next_turn_time AS	
		(SELECT truck_turn_ID, consecutive_turn, employee_ID, assigned_working_hours_for_the_week,
		(completion_time + turn_start_time) AS turn_fullfill_time,
		TIMEDIFF(departure_time, (completion_time + turn_start_time))   
		AS time_to_next_turn,
		(assigned_working_hours_for_the_week + completion_time)  
		AS new_weekly_working_hours
		FROM schedule_details_of_driver_assistant 
		LEFT OUTER JOIN route 
        USING(route_ID) WHERE schedule_details_of_driver_assistant.employee_ID = driver_assistant_id)
        
SELECT time_to_next_turn FROM get_next_turn_time WHERE get_next_turn_time.employee_ID = driver_assistant_id LIMIT 1 INTO  is_consecutive;
    
INSERT INTO turn(truck_turn_ID, driver_ID, driver_assistant_ID, vehicle_no, route_ID, turn_start_time, turn_end_time) 
VALUES(@turn_id, driver_id, driver_assistant_id, vehi_No, rt_id, departure_time, NULL );

IF EXISTS (SELECT employee_ID FROM driver_roster WHERE employee_ID = driver_id ) THEN
	UPDATE driver_roster
		SET
		assigned_working_hours_for_the_week =  assigned_working_hours_for_the_week  + HOUR(completion_time)
		WHERE employee_ID = driver_id;
ELSE
	INSERT INTO driver_roster
		(employee_ID,
        total_worked_hours_for_the_week,
		assigned_working_hours_for_the_week
		)
		VALUES
		(driver_id,
        00.0,
		HOUR(completion_time)
		);
END IF;

IF  ( is_consecutive < '01:00:00' ) THEN
	IF EXISTS (SELECT employee_ID FROM driver_assistant_roster WHERE employee_ID = driver_assistant_id ) THEN
		UPDATE driver_assistant_roster
			SET
			assigned_working_hours_for_the_week =  assigned_working_hours_for_the_week  + HOUR(completion_time),
            consecutive_turn = consecutive_turn + 1
			WHERE employee_ID = driver_assistant_id;
	ELSE
		INSERT INTO driver_assistant_roster 
			(employee_ID,
			total_worked_hours_for_the_week,
			assigned_working_hours_for_the_week,
            consecutive_turn
			)
			VALUES
			(driver_assistant_id,
			00.0,
			HOUR(completion_time),
            0
			);
	END IF;
ELSE 
		IF EXISTS (SELECT employee_ID FROM driver_assistant_roster WHERE employee_ID = driver_assistant_id ) THEN
		UPDATE driver_assistant_roster
			SET
			assigned_working_hours_for_the_week =  assigned_working_hours_for_the_week  + HOUR(completion_time),
            consecutive_turn = 0
			WHERE employee_ID = driver_assistant_id;
	ELSE
		INSERT INTO driver_assistant_roster 
			(employee_ID,
			total_worked_hours_for_the_week,
			assigned_working_hours_for_the_week,
            consecutive_turn
			)
			VALUES
			(driver_assistant_id,
			00.0,
			HOUR(completion_time),
            0
			);
	END IF;
END IF;
COMMIT;
END//
DELIMITER ;


--PROCEDURES RELATED TO TRAIN ASSIGNING
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_train_trip`(train varchar(20), sdate date)
BEGIN
 Insert into train_trip values (default,train , sdate, (SELECT capacity FROM train where train_name = train));
END//
DELIMITER ;

DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `assign_order_to_train`(ID int, train varchar(20))
BEGIN
 declare amount1 int;
 declare amount2 int;
 declare sdate datetime;
 declare odate datetime;
 
 select order_info.order_date into odate from order_info where order_info.order_ID = ID;
 select train_trip.schedule_date into sdate from train_trip WHERE odate < train_trip.schedule_date AND train_trip.train_name = train LIMIT 1;
 select train_trip.available_capacity into amount1 from train_trip where train_name = train and schedule_date = sdate;
 select total_capacity into amount2 from order_info where order_ID = ID;
 
 IF (amount1>=amount2) THEN
 INSERT INTO train_assignment VALUES (ID,(SELECT trip_ID FROM train_trip WHERE train_name=train AND schedule_date=sdate));
 UPDATE order_info SET order_info.status='Assigned to train' WHERE order_info.order_ID=ID;
 UPDATE train_trip SET train_trip.available_capacity = (available_capacity-(SELECT total_capacity FROM order_info WHERE order_info.order_ID = ID)) WHERE train_trip.train_name=train AND train_trip.schedule_date=sdate;
 
 select * from train_assignment;
 select * from order_info;
 select * from train_trip;
 
 END IF;
END//
DELIMITER ;
--END OF PROCEDURES RELATED TO STOREMANAGER

--END OF PROCEDURES RELATED TO REPORTS
-- driver/truck reports

DELIMITER $$
CREATE PROCEDURE get_driver_details()
   BEGIN 
create or replace view working_hours_drivers as select employee_ID,driver.name,driver.phone, 
SUM(((TIMESTAMPDIFF(second,turn.actual_start_time ,turn.actual_end_time )))) as duration 
from turn right join driver on driver_id=employee_ID group by employee_ID ;
select employee_ID, name, phone, sec_to_time(duration) AS worked_time from working_hours_drivers order by worked_time desc;
   END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE get_driver_assistant_details()
   BEGIN 
create or replace view working_hours_driver_assistant as select employee_ID,driver_assistant.name,phone, 
SUM(((TIMESTAMPDIFF(second,turn.actual_start_time ,turn.actual_end_time )))) as duration 
from turn right join driver_assistant on driver_assistant_ID=employee_ID group by employee_ID ;
select employee_ID, name, phone, sec_to_time(duration) AS worked_time from working_hours_driver_assistant order by worked_time desc;
   END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE get_truck_details()
   BEGIN 
create or replace view truckused_hours as select vehicle_no, store_ID,
SUM(((TIMESTAMPDIFF(second,turn.actual_start_time ,turn.actual_end_time )))) as duration 
from turn right join truck using(vehicle_no) group by vehicle_no ;
select vehicle_no, store_ID, sec_to_time(duration) AS used_time from  truckused_hours order by used_time desc; 
   END $$
DELIMITER ;

-- most ordered

DELIMITER $$
CREATE PROCEDURE get_most_ordered_items()
   BEGIN 
select product_id,product_name,sum(Quantity) as Quantity from  (SELECT  oi.order_ID, oi.customer_ID, oi.status,  total_price, 
 p.product_ID,p.product_name, od.quantity FROM order_info  oi join order_details od using (order_id)  join product p using(product_id)  having 
 oi.status not like "Not Confirmed" order by oi.order_ID) as most_ordered_items group by product_ID order by quantity desc; 
   END $$
DELIMITER ;

-- customer order

DELIMITER $$
CREATE PROCEDURE get_customer_order_report()
BEGIN 
   SELECT  
   order_info.customer_ID,
   order_info.status,
   order_info.order_ID,
   substring( order_info.order_date,1,10) as date_of_ordered,
   order_info.total_price,
   order_details.product_id
   FROM order_info,order_details
   where 
   order_info.order_id=order_details.order_id 
   
   ORDER BY (date_of_ordered);
   END$$
DELIMITER ;


-- city/route




delimiter $$
create procedure get_route_report()
begin
create or replace view route_orders 
as select a.route_name as route,
count(a.route_name) as no_of_orders , 
sum(a.total_price) as total_income  
from (SELECT * FROM  order_info join route using (route_ID)) a where a.status not like "Not COnfirmed"   group by route order by route;
select * from route_orders ;
end $$
delimiter ;


delimiter $$
create procedure get_city_report()
begin
create or replace view city_orders as select SUBSTRING_INDEX(a.route_name,'-',1) as city,count(a.route_name) as no_of_orders , sum(a.total_price) as total_income
 from (SELECT * FROM  order_info join route using (route_ID)) a where a.status not like "Not COnfirmed" 
 group by city order by city;
select * from city_orders ;
end $$
delimiter ;

-- quartely 
delimiter $$
create procedure get_quarterly_sales_report(in selected_year varchar(4))
begin
select product_ID,product_name,a.income_q1,b.income_q2,c.income_q3,d.income_q4 from (

product left join 

(select product_ID, sum(total_price) as income_q1 from 
(SELECT product_ID, order_ID,  status, order_date, total_price, quantity, product_name  FROM order_info left join order_details using( order_ID)
  left join product using(product_id) where (status not like "Not COnfirmed")  and (substring(order_Date,1,4) like  selected_year) and 
  (substring(order_Date,6,10) between "01-00" and "03-31" ) )
  q1 group by q1.product_id) a
using ( product_ID)
left join
 (select product_ID, sum(total_price) as income_q2 from 
(SELECT product_ID, order_ID,  status, order_date, total_price, quantity, product_name  FROM order_info left join order_details using( order_ID)
  left join product using(product_id) where (status not like "Not COnfirmed")  and (substring(order_Date,1,4) like  selected_year) and 
  (substring(order_Date,6,10) between "04-00" and "06-31" ) )
  q2 group by q2.product_id) b 
using ( product_ID)
left join
 (select product_ID, sum(total_price) as income_q3 from 
(SELECT product_ID, order_ID,  status, order_date, total_price, quantity, product_name  FROM order_info left join order_details using( order_ID)
  left join product using(product_id) where (status not like "Not COnfirmed")  and (substring(order_Date,1,4) like  selected_year) and 
  (substring(order_Date,6,10) between "07-00" and "09-31" ) )
  q3 group by q3.product_id) c
using ( product_ID)
left join
 (select product_ID, sum(total_price) as income_q4 from 
(SELECT product_ID, order_ID,  status, order_date, total_price, quantity, product_name  FROM order_info left join order_details using( order_ID)
  left join product using(product_id) where (status not like "Not COnfirmed")  and (substring(order_Date,1,4) like selected_year) and 
  (substring(order_Date,6,10) between "10-00" and "12-31" ) )
  q4 group by q4.product_id) d
  using ( product_ID)
); 
end $$
delimiter ;

-- END OF REPORTS