-- Seed BIG TEN college football stadiums as fields
-- Idempotent: skips insert if data already exists

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Ohio Stadium') THEN
    INSERT INTO fields (name, field_type, surface, location) VALUES
      ('Ohio Stadium',                    'football', 'turf',  'Columbus, OH'),
      ('Michigan Stadium',                'football', 'turf',  'Ann Arbor, MI'),
      ('Beaver Stadium',                  'football', 'grass', 'University Park, PA'),
      ('Camp Randall Stadium',            'football', 'turf',  'Madison, WI'),
      ('Kinnick Stadium',                 'football', 'grass', 'Iowa City, IA'),
      ('Memorial Stadium',                'football', 'turf',  'Lincoln, NE'),
      ('Memorial Stadium - Champaign',    'football', 'turf',  'Champaign, IL'),
      ('Memorial Stadium - Bloomington',  'football', 'turf',  'Bloomington, IN'),
      ('Spartan Stadium',                 'football', 'turf',  'East Lansing, MI'),
      ('Ross-Ade Stadium',                'football', 'turf',  'West Lafayette, IN'),
      ('Huntington Bank Stadium',         'football', 'turf',  'Minneapolis, MN'),
      ('Ryan Field',                      'football', 'turf',  'Evanston, IL'),
      ('SHI Stadium',                     'football', 'turf',  'Piscataway, NJ'),
      ('SECU Stadium',                    'football', 'turf',  'College Park, MD'),
      ('Autzen Stadium',                  'football', 'turf',  'Eugene, OR'),
      ('Husky Stadium',                   'football', 'turf',  'Seattle, WA'),
      ('Rose Bowl',                       'football', 'grass', 'Pasadena, CA'),
      ('Los Angeles Memorial Coliseum',   'football', 'grass', 'Los Angeles, CA');
  END IF;
END $$;
