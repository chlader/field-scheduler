-- Seed BIG TEN baseball and softball fields
-- Also backfill enriched columns on existing football stadiums
-- Idempotent: skips insert if data already exists

-- Backfill existing football stadiums with enriched data
UPDATE fields SET description = 'Home of the Ohio State Buckeyes. The Horseshoe is one of the most iconic venues in college football.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/BB0000/white?text=Ohio+Stadium' WHERE name = 'Ohio Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Michigan Wolverines. The Big House is the largest stadium in the United States.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/00274C/FFCB05?text=Michigan+Stadium' WHERE name = 'Michigan Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Penn State Nittany Lions. Known for legendary White Out games.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/041E42/white?text=Beaver+Stadium' WHERE name = 'Beaver Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Wisconsin Badgers. One of the toughest places to play in the Big Ten.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/C5050C/white?text=Camp+Randall' WHERE name = 'Camp Randall Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Iowa Hawkeyes. Famous for the wave to the University of Iowa Stead Family Children''s Hospital.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/000000/FFCD00?text=Kinnick+Stadium' WHERE name = 'Kinnick Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Nebraska Cornhuskers. Known for its sea of red on game days.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/E41C38/white?text=Memorial+Stadium' WHERE name = 'Memorial Stadium' AND location = 'Lincoln, NE' AND description IS NULL;
UPDATE fields SET description = 'Home of the Illinois Fighting Illini.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/E04E39/13294B?text=Memorial+Stadium' WHERE name = 'Memorial Stadium - Champaign' AND description IS NULL;
UPDATE fields SET description = 'Home of the Indiana Hoosiers.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/990000/white?text=Memorial+Stadium' WHERE name = 'Memorial Stadium - Bloomington' AND description IS NULL;
UPDATE fields SET description = 'Home of the Michigan State Spartans.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/18453B/white?text=Spartan+Stadium' WHERE name = 'Spartan Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Purdue Boilermakers.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/CEB888/000000?text=Ross-Ade+Stadium' WHERE name = 'Ross-Ade Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Minnesota Golden Gophers.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/7A0019/FFCC33?text=Huntington+Bank' WHERE name = 'Huntington Bank Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Northwestern Wildcats. Currently under reconstruction.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/4E2A84/white?text=Ryan+Field' WHERE name = 'Ryan Field' AND description IS NULL;
UPDATE fields SET description = 'Home of the Rutgers Scarlet Knights.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/CC0033/white?text=SHI+Stadium' WHERE name = 'SHI Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Maryland Terrapins.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/E03A3E/FFD520?text=SECU+Stadium' WHERE name = 'SECU Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Oregon Ducks. Known for its electric atmosphere.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/154733/FEE123?text=Autzen+Stadium' WHERE name = 'Autzen Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the Washington Huskies. Situated on the shores of Lake Washington.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/4B2E83/E8D3A2?text=Husky+Stadium' WHERE name = 'Husky Stadium' AND description IS NULL;
UPDATE fields SET description = 'Home of the UCLA Bruins. A historic venue that hosted the 1994 FIFA World Cup Final.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/2D68C4/F2A900?text=Rose+Bowl' WHERE name = 'Rose Bowl' AND description IS NULL;
UPDATE fields SET description = 'Home of the USC Trojans. A historic landmark built for the 1932 Olympics.', size = '100x53.3 yards', has_lights = true, has_parking = true, photo_url = 'https://placehold.co/800x400/990000/FFC72C?text=LA+Coliseum' WHERE name = 'Los Angeles Memorial Coliseum' AND description IS NULL;

-- Seed Big Ten baseball and softball stadiums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Bill Davis Stadium') THEN
    INSERT INTO fields (name, field_type, surface, location, description, size, has_lights, has_parking, is_indoor) VALUES
      ('Bill Davis Stadium',             'baseball', 'grass', 'Columbus, OH',       'Home of Ohio State Buckeyes baseball. Modern facility with all-grass playing surface.',                    '330L/400C/330R ft', true, true, false),
      ('Ray Fisher Stadium',             'baseball', 'grass', 'Ann Arbor, MI',      'Home of Michigan Wolverines baseball. Named after legendary coach Ray Fisher.',                            '320L/400C/320R ft', true, true, false),
      ('Medlar Field at Lubrano Park',   'baseball', 'grass', 'University Park, PA','Home of Penn State Nittany Lions baseball. Shared facility with minor league affiliate.',                 '325L/399C/325R ft', true, true, false),
      ('Founders Family Field',          'baseball', 'turf',  'Madison, WI',        'Home of Wisconsin Badgers baseball. Features FieldTurf playing surface.',                                  '330L/400C/330R ft', true, true, false),
      ('Duane Banks Field',              'baseball', 'grass', 'Iowa City, IA',      'Home of Iowa Hawkeyes baseball. Named after longtime head coach Duane Banks.',                              '329L/395C/329R ft', true, true, false),
      ('Hawks Field at Haymarket Park',  'baseball', 'grass', 'Lincoln, NE',        'Home of Nebraska Cornhuskers baseball. Located in Lincoln''s historic Haymarket District.',                 '335L/395C/325R ft', true, true, false),
      ('Illinois Field',                 'baseball', 'grass', 'Champaign, IL',      'Home of Illinois Fighting Illini baseball.',                                                                '330L/400C/330R ft', true, true, false),
      ('Bart Kaufman Field',             'baseball', 'grass', 'Bloomington, IN',    'Home of Indiana Hoosiers baseball. Named after longtime supporter Bart Kaufman.',                           '330L/400C/330R ft', true, true, false),
      ('McLane Baseball Stadium',        'baseball', 'grass', 'East Lansing, MI',   'Home of Michigan State Spartans baseball. Named after Drayton McLane Jr.',                                  '330L/400C/330R ft', true, true, false),
      ('Alexander Field',                'baseball', 'grass', 'West Lafayette, IN', 'Home of Purdue Boilermakers baseball.',                                                                     '330L/400C/330R ft', true, true, false),
      ('Siebert Field',                  'baseball', 'turf',  'Minneapolis, MN',    'Home of Minnesota Golden Gophers baseball. Features heated FieldTurf for early-season games.',              '330L/390C/330R ft', true, true, false),
      ('Rocky & Berenice Miller Park',   'baseball', 'turf',  'Evanston, IL',       'Home of Northwestern Wildcats baseball.',                                                                   '330L/400C/330R ft', true, true, false),
      ('Bainton Field',                  'baseball', 'turf',  'Piscataway, NJ',     'Home of Rutgers Scarlet Knights baseball.',                                                                 '330L/400C/330R ft', true, true, false),
      ('Bob "Turtle" Smith Stadium',     'baseball', 'grass', 'College Park, MD',   'Home of Maryland Terrapins baseball.',                                                                      '320L/390C/320R ft', true, true, false),
      ('PK Park',                        'baseball', 'turf',  'Eugene, OR',         'Home of Oregon Ducks baseball. Features state-of-the-art turf and covered seating areas.',                  '335L/400C/335R ft', true, true, false),
      ('Husky Ballpark',                 'baseball', 'turf',  'Seattle, WA',        'Home of Washington Huskies baseball. Beautiful views of the Cascade Mountains.',                             '326L/395C/326R ft', true, true, false),
      ('Jackie Robinson Stadium',        'baseball', 'grass', 'Los Angeles, CA',    'Home of UCLA Bruins baseball. Named after the legendary Jackie Robinson, a UCLA alumnus.',                  '330L/400C/330R ft', true, true, false),
      ('Dedeaux Field',                  'baseball', 'grass', 'Los Angeles, CA',    'Home of USC Trojans baseball. Named after legendary coach Rod Dedeaux.',                                    '335L/395C/335R ft', true, true, false);
  END IF;
END $$;

-- Seed Big Ten softball stadiums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM fields WHERE name = 'Buckeye Softball Field') THEN
    INSERT INTO fields (name, field_type, surface, location, description, size, has_lights, has_parking, is_indoor) VALUES
      ('Buckeye Softball Field',         'softball', 'turf',  'Columbus, OH',       'Home of Ohio State Buckeyes softball. Features FieldTurf and modern amenities.',                            '200 ft fences',     true, true, false),
      ('Alumni Field',                   'softball', 'grass', 'Ann Arbor, MI',      'Home of Michigan Wolverines softball. The Wolverines are perennial Big Ten contenders.',                    '220 ft fences',     true, true, false),
      ('Nittany Lion Softball Park',     'softball', 'grass', 'University Park, PA','Home of Penn State Nittany Lions softball.',                                                                '200 ft fences',     true, true, false),
      ('Goodman Diamond',                'softball', 'turf',  'Madison, WI',        'Home of Wisconsin Badgers softball.',                                                                       '200 ft fences',     true, true, false),
      ('Bob Pearl Field',                'softball', 'grass', 'Iowa City, IA',      'Home of Iowa Hawkeyes softball. Named after longtime supporter Bob Pearl.',                                 '200 ft fences',     true, true, false),
      ('Bowlin Stadium',                 'softball', 'turf',  'Lincoln, NE',        'Home of Nebraska Cornhuskers softball. One of the premier softball facilities in the country.',              '200 ft fences',     true, true, false),
      ('Eichelberger Field',             'softball', 'grass', 'Champaign, IL',      'Home of Illinois Fighting Illini softball.',                                                                '200 ft fences',     true, true, false),
      ('Andy Mohr Field',                'softball', 'turf',  'Bloomington, IN',    'Home of Indiana Hoosiers softball.',                                                                        '200 ft fences',     true, true, false),
      ('Secchia Stadium',                'softball', 'grass', 'East Lansing, MI',   'Home of Michigan State Spartans softball.',                                                                 '200 ft fences',     true, true, false),
      ('Bittinger Stadium',             'softball', 'turf',  'West Lafayette, IN', 'Home of Purdue Boilermakers softball.',                                                                     '200 ft fences',     true, true, false),
      ('Jane Sage Cowles Stadium',       'softball', 'turf',  'Minneapolis, MN',    'Home of Minnesota Golden Gophers softball. Indoor hitting facility attached for year-round practice.',       '200 ft fences',     true, true, false),
      ('Drysdale Field',                 'softball', 'turf',  'Evanston, IL',       'Home of Northwestern Wildcats softball. The Wildcats have a strong tradition in Big Ten softball.',          '200 ft fences',     true, true, false),
      ('Rutgers Softball Stadium',       'softball', 'grass', 'Piscataway, NJ',    'Home of Rutgers Scarlet Knights softball.',                                                                 '200 ft fences',     true, true, false),
      ('Maryland Softball Complex',      'softball', 'grass', 'College Park, MD',   'Home of Maryland Terrapins softball.',                                                                      '200 ft fences',     true, true, false),
      ('Jane Sanders Stadium',           'softball', 'turf',  'Eugene, OR',         'Home of Oregon Ducks softball. A top-tier facility with modern video boards and seating.',                   '200 ft fences',     true, true, false),
      ('Husky Softball Stadium',         'softball', 'turf',  'Seattle, WA',        'Home of Washington Huskies softball. The Huskies are a perennial national contender.',                      '200 ft fences',     true, true, false),
      ('Easton Stadium',                 'softball', 'grass', 'Los Angeles, CA',    'Home of UCLA Bruins softball. UCLA softball is one of the most decorated programs in NCAA history.',         '200 ft fences',     true, true, false),
      ('Dedeaux Field Softball',         'softball', 'grass', 'Los Angeles, CA',    'Home of USC Trojans softball.',                                                                              '200 ft fences',     true, true, false);
  END IF;
END $$;

-- Insert default all-day availability for newly seeded fields that don't have any yet
INSERT INTO availability_slots (field_id, day_of_week, start_time, end_time)
SELECT f.id, d.day, '00:00'::TIME, '23:59'::TIME
FROM fields f
CROSS JOIN generate_series(0, 6) AS d(day)
WHERE f.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM availability_slots a WHERE a.field_id = f.id
  );
