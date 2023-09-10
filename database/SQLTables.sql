CREATE SCHEMA SupplyChain;
USE SupplyChain;


create table loginuser (
    user_name     varchar(255) not null,    
    user_pass varchar(255) not null,   
    role_name  varchar(50),   
    primary key (user_name)      
);

create table product
	(product_ID				int auto_increment,
     product_name			varchar(255),
     unit_price				numeric(38,2),
     unit_capacity			numeric(5,2),
     stock_amount 			int,
     last_refilled_date 	date,
     availability_status 	boolean,
     primary key (product_ID)
     );

create table store
	(store_ID			int, 
	 store_name			varchar(255), 
	 store_address		varchar(255),
	 contact_number 	varchar(12),
	 primary key (store_ID)
     );

 create table route
	(route_ID  				int,
	 route_name	    		varchar(255),
     max_completion_time 	time,
     store_ID	    		int,
	 primary key (route_ID),
	 foreign key (store_ID) references store(store_ID) 
		on delete cascade
     );

create table store_manager
	(employee_ID	int,
	 name			varchar(255), 
	 email			varchar(255),
	 phone 			varchar(12),
     store_ID 		int,
	 primary key (employee_ID),
	  foreign key (email) references loginuser(user_name)  
		on delete cascade,
	 foreign key (store_ID) references store(store_ID)
		on delete cascade
     );

create table customer
	(customer_ID	int AUTO_INCREMENT,
	 name			varchar(255), 
	 address		varchar(255),
	 phone 			varchar(12),
	 email			varchar(255),
     customer_type	varchar(50),
	 primary key (customer_ID),
	 foreign key (email) references loginuser(user_name) 
		on delete cascade
     );


create table order_info
	(order_ID  				int AUTO_INCREMENT,
	 customer_ID	    	int,
	 route_ID	    		int,
     status	    			varchar(20),
     order_date 			datetime,
     address 				varchar(255),
     delivered_date 		date,
     total_price 				decimal(10,2) NOT NULL,
	 total_capacity 			DECIMAL(5,2) NOT NULL,
	 primary key (order_ID),
	 foreign key (customer_ID) references customer(customer_ID) 
		on delete cascade,
	 foreign key (route_ID) references route(route_ID) 
		on delete cascade
     );

create table order_details
	(order_ID  				int,
	 product_ID	    		int,
	 quantity	    		int,
	 primary key (order_ID,product_ID),
	 foreign key (product_ID) references product(product_ID) 
		on delete cascade,
	 foreign key (order_ID) references order_info(order_ID) 
		on delete cascade
     );

alter table order_info MODIFY total_price decimal(10,2) NOT NULL;
alter table order_info MODIFY total_capacity DECIMAL(5,2) NOT NULL;


-- TABLES RELATED TO DRIVER AND ASSISTANT AND TURN
create table driver
	(employee_ID	int,
	 name			varchar(255), 
	 email			varchar(255),
	 phone 			varchar(12),
     store_ID 		int,
     license_number varchar(20),
	 primary key (employee_ID),
	 foreign key (email) references loginuser(user_name) 
		on delete cascade,
	 foreign key (store_ID) references store(store_ID)
		on delete cascade
     );

create table driver_assistant
	(employee_ID	int,
	 name			varchar(255), 
	 email			varchar(255),
	 phone 			varchar(12),
     store_ID 		int,
	 primary key (employee_ID),
	 foreign key (email) references loginuser(user_name) 
		on delete cascade,
	 foreign key (store_ID) references store(store_ID)
		on delete cascade
     );

create table driver_roster
	(employee_ID								int, 
	 total_worked_hours_for_the_week			decimal(4,2), 
	 assigned_working_hours_for_the_week		decimal(4,2),
	 primary key (employee_ID),
	 foreign key (employee_ID) references driver(employee_ID) 
		on delete cascade
     );

create table driver_assistant_roster
	(employee_ID								int,
	 total_worked_hours_for_the_week			decimal(4,2), 
	 assigned_working_hours_for_the_week		decimal(4,2),
     consecutive_turn                           int,
	 primary key (employee_ID),
	 foreign key (employee_ID) references driver_assistant(employee_ID) 
		on delete cascade
     );

create table truck
	(vehicle_no		varchar(20),
	 store_ID	    int, 
	 availability	boolean, 
	 capacity		int,
	 primary key (vehicle_no),
	 foreign key (store_ID) references store(store_ID) 
		on delete cascade
     );

create table turn
	(truck_turn_ID    			int,
	 driver_ID	     			int,
	 driver_assistant_ID	    int, 
	 vehicle_no 	 			varchar(20), 
	 route_ID	    			int,
	 turn_start_time 			datetime,
	 turn_end_time 				datetime,
	 actual_start_time 			datetime,
	 actual_end_time 			datetime,
	 primary key (truck_turn_ID),
	 foreign key (driver_ID) references driver(employee_ID) 
		on delete cascade,
	 foreign key (driver_assistant_ID) references driver_assistant(employee_ID) 
		on delete cascade,
	 foreign key (vehicle_no) references truck(vehicle_no) 
		on delete cascade,
	 foreign key (route_ID) references route(route_ID) 
		on delete cascade
     );

create table truck_assignment
	(order_ID  				int,
	 truck_turn_ID  		int,
     primary key (order_ID),
     foreign key (truck_turn_ID) references turn(truck_turn_ID)
		on delete cascade
     ); 
	 
-- TABLES RELATED TO TRAIN ASSIGNING
create table train
	(train_name				varchar(255),
     departure_time			time,
     destination			varchar(255),
     capacity				int,
     primary key (train_name)
     ); 

create table train_trip
	(trip_ID  				int auto_increment,
     train_name				varchar(255),
     schedule_date			date,
     primary key (trip_ID),
     foreign key (train_name) references train(train_name)
		on delete cascade
     ); 

alter table train_trip add column available_capacity int;
UPDATE train_trip INNER JOIN train ON train_trip.train_name = train.train_name SET train_trip.available_capacity = train.capacity;

create table train_assignment
	(order_ID  				int,
	 trip_ID  				int,
     primary key (order_ID),
     foreign key (trip_ID) references train_trip(trip_ID)
		on delete cascade
     ); 
-- REMAINING TABLES TO BE FILLED
