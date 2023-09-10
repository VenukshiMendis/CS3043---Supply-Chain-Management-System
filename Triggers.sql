DELIMITER //
CREATE TRIGGER driver_assistant_roster_update_trigger AFTER INSERT ON driver_assistant
FOR EACH ROW BEGIN
IF NOT EXISTS (SELECT employee_ID FROM driver_assistant_roster WHERE employee_ID = NEW.employee_ID) THEN
INSERT INTO driver_assistant_roster
(employee_ID,
total_worked_hours_for_the_week,
assigned_working_hours_for_the_week,
consecutive_turn
)
VALUES
( NEW.employee_ID ,
0,
0,
0);
END IF;
END //

DELIMITER //
CREATE TRIGGER driver_roster_update_trigger AFTER INSERT ON driver
FOR EACH ROW BEGIN
IF NOT EXISTS (SELECT employee_ID FROM driver_roster WHERE employee_ID = NEW.employee_ID) THEN
INSERT INTO driver_roster
(employee_ID,
total_worked_hours_for_the_week,
assigned_working_hours_for_the_week
)
VALUES
( NEW.employee_ID ,
0,
0);
END IF;
END //
