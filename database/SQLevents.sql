-- event
DELIMITER //
CREATE OR REPLACE EVENT update_weekly ON SCHEDULE EVERY 7 DAY STARTS '2023-01-02 00:00:00' ON COMPLETION NOT PRESERVE ENABLE COMMENT 'Clear weekly worked hours and assigned working of drivers and assitants' DO BEGIN
        UPDATE driver_assistant_roster SET total_worked_hours_for_the_week = 0 WHERE 1;
        UPDATE driver_roster SET assigned_working_hours_for_the_week = 0 WHERE 1;
      END
DELIMITER //

DELIMITER //
CREATE OR REPLACE EVENT update_weekly ON SCHEDULE EVERY 7 DAY STARTS '2023-01-02 00:00:00' ON COMPLETION NOT PRESERVE ENABLE COMMENT 'Clear weekly worked hours and assigned working hours of drivers and assitants' DO BEGIN
        UPDATE driver_assistant_roster SET total_worked_hours_for_the_week = 0 WHERE 1;
        UPDATE driver_roster SET assigned_working_hours_for_the_week= 0 WHERE 1;
      END
DELIMITER //