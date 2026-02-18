-- Fix broken Wikipedia photo URLs with working placehold.co URLs
-- Also add photo_url to football stadiums that didn't have one, and to all baseball/softball fields

-- Football stadiums (fix broken Wikipedia URLs + add missing ones)
UPDATE fields SET photo_url = 'https://placehold.co/800x400/BB0000/white?text=Ohio+Stadium' WHERE name = 'Ohio Stadium' AND (photo_url LIKE '%wikipedia%' OR photo_url IS NULL);
UPDATE fields SET photo_url = 'https://placehold.co/800x400/00274C/FFCB05?text=Michigan+Stadium' WHERE name = 'Michigan Stadium' AND (photo_url LIKE '%wikipedia%' OR photo_url IS NULL);
UPDATE fields SET photo_url = 'https://placehold.co/800x400/041E42/white?text=Beaver+Stadium' WHERE name = 'Beaver Stadium' AND (photo_url LIKE '%wikipedia%' OR photo_url IS NULL);
UPDATE fields SET photo_url = 'https://placehold.co/800x400/C5050C/white?text=Camp+Randall' WHERE name = 'Camp Randall Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/000000/FFCD00?text=Kinnick+Stadium' WHERE name = 'Kinnick Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E41C38/white?text=Memorial+Stadium' WHERE name = 'Memorial Stadium' AND location = 'Lincoln, NE' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E04E39/13294B?text=Memorial+Stadium' WHERE name = 'Memorial Stadium - Champaign' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/white?text=Memorial+Stadium' WHERE name = 'Memorial Stadium - Bloomington' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/18453B/white?text=Spartan+Stadium' WHERE name = 'Spartan Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CEB888/000000?text=Ross-Ade+Stadium' WHERE name = 'Ross-Ade Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/7A0019/FFCC33?text=Huntington+Bank' WHERE name = 'Huntington Bank Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4E2A84/white?text=Ryan+Field' WHERE name = 'Ryan Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CC0033/white?text=SHI+Stadium' WHERE name = 'SHI Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E03A3E/FFD520?text=SECU+Stadium' WHERE name = 'SECU Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/154733/FEE123?text=Autzen+Stadium' WHERE name = 'Autzen Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4B2E83/E8D3A2?text=Husky+Stadium' WHERE name = 'Husky Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/2D68C4/F2A900?text=Rose+Bowl' WHERE name = 'Rose Bowl' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/FFC72C?text=LA+Coliseum' WHERE name = 'Los Angeles Memorial Coliseum' AND photo_url IS NULL;

-- Baseball stadiums
UPDATE fields SET photo_url = 'https://placehold.co/800x400/BB0000/white?text=Bill+Davis+Stadium' WHERE name = 'Bill Davis Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/00274C/FFCB05?text=Ray+Fisher+Stadium' WHERE name = 'Ray Fisher Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/041E42/white?text=Medlar+Field' WHERE name = 'Medlar Field at Lubrano Park' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/C5050C/white?text=Founders+Family+Field' WHERE name = 'Founders Family Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/000000/FFCD00?text=Duane+Banks+Field' WHERE name = 'Duane Banks Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E41C38/white?text=Hawks+Field' WHERE name = 'Hawks Field at Haymarket Park' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E04E39/13294B?text=Illinois+Field' WHERE name = 'Illinois Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/white?text=Bart+Kaufman+Field' WHERE name = 'Bart Kaufman Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/18453B/white?text=McLane+Stadium' WHERE name = 'McLane Baseball Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CEB888/000000?text=Alexander+Field' WHERE name = 'Alexander Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/7A0019/FFCC33?text=Siebert+Field' WHERE name = 'Siebert Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4E2A84/white?text=Miller+Park' WHERE name = 'Rocky & Berenice Miller Park' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CC0033/white?text=Bainton+Field' WHERE name = 'Bainton Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E03A3E/FFD520?text=Smith+Stadium' WHERE name = 'Bob "Turtle" Smith Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/154733/FEE123?text=PK+Park' WHERE name = 'PK Park' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4B2E83/E8D3A2?text=Husky+Ballpark' WHERE name = 'Husky Ballpark' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/2D68C4/F2A900?text=Jackie+Robinson' WHERE name = 'Jackie Robinson Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/FFC72C?text=Dedeaux+Field' WHERE name = 'Dedeaux Field' AND field_type = 'baseball' AND photo_url IS NULL;

-- Softball stadiums
UPDATE fields SET photo_url = 'https://placehold.co/800x400/BB0000/white?text=Buckeye+Softball' WHERE name = 'Buckeye Softball Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/00274C/FFCB05?text=Alumni+Field' WHERE name = 'Alumni Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/041E42/white?text=Nittany+Lion+Softball' WHERE name = 'Nittany Lion Softball Park' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/C5050C/white?text=Goodman+Diamond' WHERE name = 'Goodman Diamond' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/000000/FFCD00?text=Bob+Pearl+Field' WHERE name = 'Bob Pearl Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E41C38/white?text=Bowlin+Stadium' WHERE name = 'Bowlin Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E04E39/13294B?text=Eichelberger+Field' WHERE name = 'Eichelberger Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/white?text=Andy+Mohr+Field' WHERE name = 'Andy Mohr Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/18453B/white?text=Secchia+Stadium' WHERE name = 'Secchia Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CEB888/000000?text=Bittinger+Stadium' WHERE name = 'Bittinger Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/7A0019/FFCC33?text=Cowles+Stadium' WHERE name = 'Jane Sage Cowles Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4E2A84/white?text=Drysdale+Field' WHERE name = 'Drysdale Field' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/CC0033/white?text=Rutgers+Softball' WHERE name = 'Rutgers Softball Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/E03A3E/FFD520?text=Maryland+Softball' WHERE name = 'Maryland Softball Complex' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/154733/FEE123?text=Jane+Sanders' WHERE name = 'Jane Sanders Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/4B2E83/E8D3A2?text=Husky+Softball' WHERE name = 'Husky Softball Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/2D68C4/F2A900?text=Easton+Stadium' WHERE name = 'Easton Stadium' AND photo_url IS NULL;
UPDATE fields SET photo_url = 'https://placehold.co/800x400/990000/FFC72C?text=Dedeaux+Softball' WHERE name = 'Dedeaux Field Softball' AND photo_url IS NULL;
