ALTER TABLE cars 
ADD COLUMN ac_available BOOLEAN NOT NULL DEFAULT FALSE;
select *from cars;
SELECT*FROM USERS;
ALTER TABLE users
ADD COLUMN gender VARCHAR(10);
select * from rides;
select * from ride_requests
select * from ride_history;
select * from messages;
DROP TABLE IF EXISTS alembic_version;


-- Add new columns
ALTER TABLE rides ADD COLUMN start_latitude FLOAT;
ALTER TABLE rides ADD COLUMN start_longitude FLOAT;
ALTER TABLE rides ADD COLUMN end_latitude FLOAT;
ALTER TABLE rides ADD COLUMN end_longitude FLOAT;
ALTER TABLE rides ADD COLUMN distance_km FLOAT;
ALTER TABLE rides ADD COLUMN estimated_duration INTEGER;

-- Modify constraints
ALTER TABLE rides ALTER COLUMN start_location SET NOT NULL;
ALTER TABLE rides ALTER COLUMN end_location SET NOT NULL;
ALTER TABLE rides ALTER COLUMN total_fare DROP NOT NULL;
