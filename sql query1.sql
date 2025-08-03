select *from cars;
SELECT*FROM USERS;
select * from rides;
select * from ride_requests
select * from ride_history;
select * from messages;

DROP TABLE IF EXISTS alembic_version;

ALTER TABLE cars 
ADD COLUMN ac_available BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN gender VARCHAR(10);

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


ALTER TABLE rides
ADD COLUMN main_stops JSONB;

ALTER TABLE ride_requests
ADD COLUMN joining_stop VARCHAR(255),
ADD COLUMN ending_stop VARCHAR(255);

ALTER TABLE users 
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE users 
ADD CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL);

ALTER TABLE rides ADD COLUMN start_location VARCHAR(255);
ALTER TABLE rides ADD COLUMN end_location VARCHAR(255);
alter table rides drop column start_location_id;
alter table rides drop column end_location_id;
ALTER TABLE rides ADD COLUMN total_fare FLOAT NOT NULL DEFAULT 0;

ALTER TABLE users DROP COLUMN role_mode;
ALTER TABLE users ADD COLUMN is_driver BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_rider BOOLEAN NOT NULL DEFAULT TRUE;
-- Update preferences column to JSON type
ALTER TABLE users ALTER COLUMN preferences TYPE JSON USING preferences::JSON;

CREATE USER commute_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE commute_io TO commute_user;

GRANT CREATE, USAGE ON SCHEMA public TO commute_user;

ALTER TABLE cars
ADD CONSTRAINT cars_user_id_unique UNIQUE (user_id);