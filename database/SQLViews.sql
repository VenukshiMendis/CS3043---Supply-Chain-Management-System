CREATE 
     OR REPLACE ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `turn_order_info` AS
    SELECT 
        `ta`.`order_ID` AS `order_ID`, 
        `t`.`truck_turn_ID` AS `truck_turn_ID`,
        `d`.`employee_ID` AS `driver_ID`,
        `d`.`name` AS `driver_name`,
        `da`.`employee_ID` AS `driverAssistant_ID`,
        `da`.`name` AS `driverAssistant_name`,
        `t`.`vehicle_no` AS `vehicle_no`,
        `t`.`turn_start_time` AS `turn_start_time`,
        `t`.`route_ID` AS `route_ID`,
        `r`.`route_name` AS `route_name`,
        `ord`.`address` AS `address`,
        `c`.`name` AS `name`,
        `c`.`phone` AS `phone`,
        `ord`.`status` AS `status`
    FROM
        ((((((`turn` `t`
        JOIN `truck_assignment` `ta` ON ((`t`.`truck_turn_ID` = `ta`.`truck_turn_ID`)))
        LEFT JOIN `order_info` `ord` ON ((`ta`.`order_ID` = `ord`.`order_ID`)))
        LEFT JOIN `route` `r` ON ((`ord`.`route_ID` = `r`.`route_ID`)))
        LEFT JOIN `customer` `c` ON ((`ord`.`customer_ID` = `c`.`customer_ID`)))
        LEFT JOIN `driver` `d` ON ((`t`.`driver_ID` = `d`.`employee_ID`)))
        LEFT JOIN `driver_assistant` `da` ON ((`t`.`driver_assistant_ID` = `da`.`employee_ID`)));


-- VIEWS RELATED TO STOREMANAGER --

CREATE VIEW driver_details AS (SELECT * FROM driver LEFT JOIN driver_roster USING (employee_ID)) ;

CREATE VIEW driver_assistants_details AS (SELECT * FROM driver_assistant LEFT JOIN driver_assistant_roster USING (employee_ID)) ;

CREATE VIEW route_details AS (SELECT route_ID,store.store_ID FROM store LEFT JOIN route ON store.store_ID = route.store_ID);

CREATE VIEW  schedule_details_of_driver_assistant AS
		(SELECT * 
			FROM driver_assistants_details
            LEFT OUTER JOIN turn 
            on turn.driver_assistant_ID = driver_assistants_details.employee_ID
        );