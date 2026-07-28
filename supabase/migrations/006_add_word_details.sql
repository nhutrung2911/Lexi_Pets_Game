-- 1. Thêm cột mới nếu chưa có
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS part_of_speech text;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS phonetics text;

-- 2. Cập nhật dữ liệu hàng loạt bằng mệnh đề FROM (VALUES ...)
UPDATE public.vocabulary AS voc
SET part_of_speech = v.pos, phonetics = v.phonetics
FROM (VALUES
  -- A1
  ('CAT', '(n)', '/kæt/'), ('DOG', '(n)', '/dɔːɡ/'), ('SUN', '(n)', '/sʌn/'), ('MOON', '(n)', '/muːn/'),
  ('WATER', '(n)', '/ˈwɔːtər/'), ('FIRE', '(n)', '/ˈfaɪər/'), ('EARTH', '(n)', '/ɜːrθ/'), ('WIND', '(n)', '/wɪnd/'),
  ('BOOK', '(n)', '/bʊk/'), ('PEN', '(n)', '/pen/'), ('DESK', '(n)', '/desk/'), ('CHAIR', '(n)', '/tʃer/'),
  ('HOUSE', '(n)', '/haʊs/'), ('DOOR', '(n)', '/dɔːr/'), ('WINDOW', '(n)', '/ˈwɪndoʊ/'), ('ROOM', '(n)', '/ruːm/'),
  ('APPLE', '(n)', '/ˈæpl/'), ('BANANA', '(n)', '/bəˈnænə/'), ('MILK', '(n)', '/mɪlk/'), ('BREAD', '(n)', '/bred/'),
  ('RICE', '(n)', '/raɪs/'), ('MEAT', '(n)', '/miːt/'), ('FISH', '(n)', '/fɪʃ/'), ('BIRD', '(n)', '/bɜːrd/'),
  ('TREE', '(n)', '/triː/'), ('FLOWER', '(n)', '/ˈflaʊər/'), ('GRASS', '(n)', '/ɡræs/'), ('LEAF', '(n)', '/liːf/'),
  ('CAR', '(n)', '/kɑːr/'), ('BUS', '(n)', '/bʌs/'), ('TRAIN', '(n)', '/treɪn/'), ('BIKE', '(n)', '/baɪk/'),
  ('ROAD', '(n)', '/roʊd/'), ('STREET', '(n)', '/striːt/'), ('CITY', '(n)', '/ˈsɪti/'), ('TOWN', '(n)', '/taʊn/'),
  ('BOY', '(n)', '/bɔɪ/'), ('GIRL', '(n)', '/ɡɜːrl/'), ('MAN', '(n)', '/mæn/'), ('WOMAN', '(n)', '/ˈwʊmən/'),
  ('MOTHER', '(n)', '/ˈmʌðər/'), ('FATHER', '(n)', '/ˈfɑːðər/'), ('SISTER', '(n)', '/ˈsɪstər/'), ('BROTHER', '(n)', '/ˈbrʌðər/'),
  ('HAND', '(n)', '/hænd/'), ('FOOT', '(n)', '/fʊt/'), ('EYE', '(n)', '/aɪ/'), ('EAR', '(n)', '/ɪr/'),
  ('NOSE', '(n)', '/noʊz/'), ('MOUTH', '(n)', '/maʊθ/'), ('HEAD', '(n)', '/hed/'), ('FACE', '(n)', '/feɪs/'),
  ('HELLO', '(n)', '/həˈloʊ/'), ('WORLD', '(n)', '/wɜːrld/'), ('FOOD', '(n)', '/fuːd/'), ('SCHOOL', '(n)', '/skuːl/'),
  ('TEACHER', '(n)', '/ˈtiːtʃər/'), ('STUDENT', '(n)', '/ˈstuːdnt/'), ('BAG', '(n)', '/bæɡ/'),

  -- A2
  ('MOUNTAIN', '(n)', '/ˈmaʊntn/'), ('RIVER', '(n)', '/ˈrɪvər/'), ('OCEAN', '(n)', '/ˈoʊʃn/'), ('BEACH', '(n)', '/biːtʃ/'),
  ('CLOUD', '(n)', '/klaʊd/'), ('STORM', '(n)', '/stɔːrm/'), ('SNOW', '(n)', '/snoʊ/'), ('RAIN', '(n)', '/reɪn/'),
  ('FARMER', '(n)', '/ˈfɑːrmər/'), ('DOCTOR', '(n)', '/ˈdɑːktər/'), ('NURSE', '(n)', '/nɜːrs/'), ('POLICE', '(n)', '/pəˈliːs/'),
  ('DRIVER', '(n)', '/ˈdraɪvər/'), ('SINGER', '(n)', '/ˈsɪŋər/'),
  ('ANIMAL', '(n)', '/ˈænɪml/'), ('TIGER', '(n)', '/ˈtaɪɡər/'), ('LION', '(n)', '/ˈlaɪən/'), ('BEAR', '(n)', '/ber/'),
  ('MONKEY', '(n)', '/ˈmʌŋki/'), ('SNAKE', '(n)', '/sneɪk/'), ('HORSE', '(n)', '/hɔːrs/'), ('SHEEP', '(n)', '/ʃiːp/'),
  ('WINTER', '(n)', '/ˈwɪntər/'), ('SUMMER', '(n)', '/ˈsʌmər/'), ('SPRING', '(n)', '/sprɪŋ/'), ('AUTUMN', '(n)', '/ˈɔːtəm/'),
  ('MORNING', '(n)', '/ˈmɔːrnɪŋ/'), ('EVENING', '(n)', '/ˈiːvnɪŋ/'), ('NIGHT', '(n)', '/naɪt/'), ('AFTERNOON', '(n)', '/ˌæftərˈnuːn/'),
  ('TICKET', '(n)', '/ˈtɪkɪt/'), ('FLIGHT', '(n)', '/flaɪt/'), ('AIRPORT', '(n)', '/ˈerpɔːrt/'), ('STATION', '(n)', '/ˈsteɪʃn/'),
  ('HOTEL', '(n)', '/hoʊˈtel/'), ('RESTAURANT', '(n)', '/ˈrestrɑːnt/'), ('HOSPITAL', '(n)', '/ˈhɑːspɪtl/'), ('MARKET', '(n)', '/ˈmɑːrkɪt/'),
  ('MONEY', '(n)', '/ˈmʌni/'), ('PRICE', '(n)', '/praɪs/'), ('CHEAP', '(adj)', '/tʃiːp/'), ('EXPENSIVE', '(adj)', '/ɪkˈspensɪv/'),
  ('BEAUTIFUL', '(adj)', '/ˈbjuːtɪfl/'), ('UGLY', '(adj)', '/ˈʌɡli/'), ('CLEAN', '(adj)', '/kliːn/'), ('DIRTY', '(adj)', '/ˈdɜːrti/'),
  ('QUICK', '(adj)', '/kwɪk/'), ('SLOW', '(adj)', '/sloʊ/'), ('STRONG', '(adj)', '/strɔːŋ/'), ('WEAK', '(adj)', '/wiːk/'),
  ('HAPPY', '(adj)', '/ˈhæpi/'), ('SAD', '(adj)', '/sæd/'), ('ANGRY', '(adj)', '/ˈæŋɡri/'), ('FAST', '(adj)', '/fæst/'),

  -- B1
  ('FREEDOM', '(n)', '/ˈfriːdəm/'), ('JOURNEY', '(n)', '/ˈdʒɜːrni/'), ('ADVENTURE', '(n)', '/ədˈventʃər/'), ('HOLIDAY', '(n)', '/ˈhɑːlədeɪ/'),
  ('WEATHER', '(n)', '/ˈweðər/'), ('CLIMATE', '(n)', '/ˈklaɪmət/'), ('NATURE', '(n)', '/ˈneɪtʃər/'), ('ENVIRONMENT', '(n)', '/ɪnˈvaɪrənmənt/'),
  ('SOCIETY', '(n)', '/səˈsaɪəti/'), ('CULTURE', '(n)', '/ˈkʌltʃər/'), ('HISTORY', '(n)', '/ˈhɪstri/'), ('TRADITION', '(n)', '/trəˈdɪʃn/'),
  ('SCIENCE', '(n)', '/ˈsaɪəns/'), ('TECHNOLOGY', '(n)', '/tekˈnɑːlədʒi/'), ('MACHINE', '(n)', '/məˈʃiːn/'), ('COMPUTER', '(n)', '/kəmˈpjuːtər/'),
  ('FACTORY', '(n)', '/ˈfæktəri/'), ('INDUSTRY', '(n)', '/ˈɪndəstri/'), ('BUSINESS', '(n)', '/ˈbɪznəs/'), ('COMPANY', '(n)', '/ˈkʌmpəni/'),
  ('OFFICE', '(n)', '/ˈɔːfɪs/'), ('MANAGER', '(n)', '/ˈmænɪdʒər/'), ('EMPLOYEE', '(n)', '/ɪmˈplɔɪiː/'), ('CUSTOMER', '(n)', '/ˈkʌstəmər/'),
  ('PRODUCT', '(n)', '/ˈprɑːdʌkt/'), ('SERVICE', '(n)', '/ˈsɜːrvɪs/'), ('QUALITY', '(n)', '/ˈkwɑːləti/'), ('QUANTITY', '(n)', '/ˈkwɑːntəti/'),
  ('EDUCATION', '(n)', '/ˌedʒuˈkeɪʃn/'), ('KNOWLEDGE', '(n)', '/ˈnɑːlɪdʒ/'), ('UNIVERSITY', '(n)', '/ˌjuːnɪˈvɜːrsəti/'), ('COLLEGE', '(n)', '/ˈkɑːlɪdʒ/'),
  ('LANGUAGE', '(n)', '/ˈlæŋɡwɪdʒ/'), ('DICTIONARY', '(n)', '/ˈdɪkʃəneri/'), ('GRAMMAR', '(n)', '/ˈɡræmər/'), ('VOCABULARY', '(n)', '/vəˈkæbjəleri/'),
  ('SENTENCE', '(n)', '/ˈsentəns/'), ('PARAGRAPH', '(n)', '/ˈpærəɡræf/'), ('DOCUMENT', '(n)', '/ˈdɑːkjumənt/'), ('ARTICLE', '(n)', '/ˈɑːrtɪkl/'),
  ('MESSAGE', '(n)', '/ˈmesɪdʒ/'), ('LETTER', '(n)', '/ˈletər/'), ('PACKAGE', '(n)', '/ˈpækɪdʒ/'), ('DELIVERY', '(n)', '/dɪˈlɪvəri/'),
  ('SUCCESS', '(n)', '/səkˈses/'), ('FAILURE', '(n)', '/ˈfeɪljər/'), ('MISTAKE', '(n)', '/mɪˈsteɪk/'), ('PROBLEM', '(n)', '/ˈprɑːbləm/'),
  ('SOLUTION', '(n)', '/səˈluːʃn/'), ('DECISION', '(n)', '/dɪˈsɪʒn/'), ('CHOICE', '(n)', '/tʃɔɪs/'), ('OPINION', '(n)', '/əˈpɪnjən/'),

  -- B2
  ('PHILOSOPHY', '(n)', '/fəˈlɑːsəfi/'), ('PSYCHOLOGY', '(n)', '/saɪˈkɑːlədʒi/'), ('BIOLOGY', '(n)', '/baɪˈɑːlədʒi/'), ('CHEMISTRY', '(n)', '/ˈkemɪstri/'),
  ('INNOVATION', '(n)', '/ˌɪnəˈveɪʃn/'), ('INVENTION', '(n)', '/ɪnˈvenʃn/'), ('DISCOVERY', '(n)', '/dɪˈskʌvəri/'), ('RESEARCH', '(n)', '/ˈriːsɜːrtʃ/'),
  ('SUSTAINABLE', '(adj)', '/səˈsteɪnəbl/'), ('RENEWABLE', '(adj)', '/rɪˈnuːəbl/'), ('POLLUTION', '(n)', '/pəˈluːʃn/'), ('CONSERVATION', '(n)', '/ˌkɑːnsərˈveɪʃn/'),
  ('GOVERNMENT', '(n)', '/ˈɡʌvərnmənt/'), ('PARLIAMENT', '(n)', '/ˈpɑːrləmənt/'), ('DEMOCRACY', '(n)', '/dɪˈmɑːkrəsi/'), ('REPUBLIC', '(n)', '/rɪˈpʌblɪk/'),
  ('AGRICULTURE', '(n)', '/ˈæɡrɪkʌltʃər/'), ('ARCHITECTURE', '(n)', '/ˈɑːrkɪtektʃər/'), ('LITERATURE', '(n)', '/ˈlɪtrətʃər/'), ('SCULPTURE', '(n)', '/ˈskʌlptʃər/'),
  ('REVOLUTION', '(n)', '/ˌrevəˈluːʃn/'), ('INDEPENDENCE', '(n)', '/ˌɪndɪˈpendəns/'), ('CONSTITUTION', '(n)', '/ˌkɑːnstɪˈtuːʃn/'), ('AGREEMENT', '(n)', '/əˈɡriːmənt/'),
  ('INVESTMENT', '(n)', '/ɪnˈvestmənt/'), ('MANAGEMENT', '(n)', '/ˈmænɪdʒmənt/'), ('STRATEGY', '(n)', '/ˈstrætədʒi/'), ('CAMPAIGN', '(n)', '/kæmˈpeɪn/'),
  ('POTENTIAL', '(n)', '/pəˈtenʃl/'), ('SIGNIFICANT', '(adj)', '/sɪɡˈnɪfɪkənt/'), ('APPROPRIATE', '(adj)', '/əˈproʊpriət/'), ('ALTERNATIVE', '(n)', '/ɔːlˈtɜːrnətɪv/'),
  ('PERSPECTIVE', '(n)', '/pərˈspektɪv/'), ('CONSEQUENCE', '(n)', '/ˈkɑːnsɪkwens/'), ('CONTRIBUTION', '(n)', '/ˌkɑːntrɪˈbjuːʃn/'), ('CHALLENGE', '(n)', '/ˈtʃælɪndʒ/'),
  ('OPPORTUNITY', '(n)', '/ˌɑːpərˈtuːnəti/'), ('ACHIEVEMENT', '(n)', '/əˈtʃiːvmənt/'), ('EXPERIENCE', '(n)', '/ɪkˈspɪriəns/'), ('EVIDENCE', '(n)', '/ˈevɪdəns/'),
  ('HYPOTHESIS', '(n)', '/haɪˈpɑːθəsɪs/'), ('PHENOMENON', '(n)', '/fəˈnɑːmɪnən/'), ('STATISTICS', '(n)', '/stəˈtɪstɪks/'), ('ANALYSIS', '(n)', '/əˈnæləsɪs/'),
  ('PERCEPTION', '(n)', '/pərˈsepʃn/'), ('AWARENESS', '(n)', '/əˈwernəs/'), ('CONSCIOUSNESS', '(n)', '/ˈkɑːnʃəsnəs/'), ('INTUITION', '(n)', '/ˌɪntuˈɪʃn/'),
  ('RESISTANCE', '(n)', '/rɪˈzɪstəns/'), ('TOLERANCE', '(n)', '/ˈtɑːlərəns/'), ('PREJUDICE', '(n)', '/ˈpredʒədɪs/'), ('DISCRIMINATION', '(n)', '/dɪˌskrɪmɪˈneɪʃn/'),

  -- C1
  ('UBIQUITOUS', '(adj)', '/juːˈbɪkwɪtəs/'), ('EPHEMERAL', '(adj)', '/ɪˈfemərəl/'), ('METICULOUS', '(adj)', '/məˈtɪkjələs/'), ('PRAGMATIC', '(adj)', '/præɡˈmætɪk/'),
  ('ELOQUENT', '(adj)', '/ˈeləkwənt/'), ('RESILIENT', '(adj)', '/rɪˈzɪliənt/'), ('LUCID', '(adj)', '/ˈluːsɪd/'), ('PROLIFIC', '(adj)', '/prəˈlɪfɪk/'),
  ('AMBIGUOUS', '(adj)', '/æmˈbɪɡjuəs/'), ('ANOMALY', '(n)', '/əˈnɑːməli/'), ('DICHOTOMY', '(n)', '/daɪˈkɑːtəmi/'), ('PARADIGM', '(n)', '/ˈpærədaɪm/'),
  ('CONUNDRUM', '(n)', '/kəˈnʌndrəm/'), ('ENIGMA', '(n)', '/ɪˈnɪɡmə/'), ('SYNERGY', '(n)', '/ˈsɪnərdʒi/'), ('CATALYST', '(n)', '/ˈkætəlɪst/'),
  ('VINDICATE', '(v)', '/ˈvɪndɪkeɪt/'), ('EXACERBATE', '(v)', '/ɪɡˈzæsərbeɪt/'), ('MITIGATE', '(v)', '/ˈmɪtɪɡeɪt/'), ('ALLEVIATE', '(v)', '/əˈliːvieɪt/'),
  ('ASTUTE', '(adj)', '/əˈstuːt/'), ('AUSTERE', '(adj)', '/ɔːˈstɪr/'), ('BENEVOLENT', '(adj)', '/bəˈnevələnt/'), ('CAPRICIOUS', '(adj)', '/kəˈprɪʃəs/'),
  ('CHRONIC', '(adj)', '/ˈkrɑːnɪk/'), ('COGNITIVE', '(adj)', '/ˈkɑːɡnətɪv/'), ('COMPREHENSIVE', '(adj)', '/ˌkɑːmprɪˈhensɪv/'), ('DETRIMENTAL', '(adj)', '/ˌdetrɪˈmentl/'),
  ('EMPIRICAL', '(adj)', '/ɪmˈpɪrɪkl/'), ('FEASIBLE', '(adj)', '/ˈfiːzəbl/'), ('HETEROGENEOUS', '(adj)', '/ˌhetərəˈdʒiːniəs/'), ('HOMOGENEOUS', '(adj)', '/ˌhoʊməˈdʒiːniəs/'),
  ('IMPLICIT', '(adj)', '/ɪmˈplɪsɪt/'), ('EXPLICIT', '(adj)', '/ɪkˈsplɪsɪt/'), ('INTRINSIC', '(adj)', '/ɪnˈtrɪnzɪk/'), ('EXTRINSIC', '(adj)', '/eksˈtrɪnzɪk/'),
  ('MUNDANE', '(adj)', '/mʌnˈdeɪn/'), ('NOSTALGIA', '(n)', '/nəˈstældʒə/'), ('OBSOLETE', '(adj)', '/ˌɑːbsəˈliːt/'), ('PERVASIVE', '(adj)', '/pərˈveɪsɪv/'),
  ('PLAUSIBLE', '(adj)', '/ˈplɔːzəbl/'), ('PRECARIOUS', '(adj)', '/prɪˈkeriəs/'), ('REDUNDANT', '(adj)', '/rɪˈdʌndənt/'), ('SCRUTINIZE', '(v)', '/ˈskruːtənaɪz/'),
  ('TANGIBLE', '(adj)', '/ˈtændʒəbl/'), ('TENTATIVE', '(adj)', '/ˈtentətɪv/'), ('UNPRECEDENTED', '(adj)', '/ʌnˈpresɪdentɪd/'), ('VIABLE', '(adj)', '/ˈvaɪəbl/'),

  -- C2
  ('SERENDIPITY', '(n)', '/ˌserənˈdɪpəti/'), ('QUINTESSENTIAL', '(adj)', '/ˌkwɪntɪˈsenʃl/'), ('MELLIFLUOUS', '(adj)', '/məˈlɪfluəs/'), ('INEFFABLE', '(adj)', '/ɪnˈefəbl/'),
  ('OBFUSCATE', '(v)', '/ˈɑːbfəskeɪt/'), ('PERSPICACIOUS', '(adj)', '/ˌpɜːrspɪˈkeɪʃəs/'), ('EQUANIMITY', '(n)', '/ˌiːkwəˈnɪməti/'), ('FASTIDIOUS', '(adj)', '/fæˈstɪdiəs/'),
  ('ESOTERIC', '(adj)', '/ˌesəˈterɪk/'), ('CACOPHONY', '(n)', '/kəˈkɑːfəni/'), ('SYCOPHANT', '(n)', '/ˈsɪkəfənt/'), ('IDIOSYNCRASY', '(n)', '/ˌɪdiəˈsɪŋkrəsi/'),
  ('BELLIGERENT', '(adj)', '/bəˈlɪdʒərənt/'), ('MAGNANIMOUS', '(adj)', '/mæɡˈnænɪməs/'), ('SUPERFLUOUS', '(adj)', '/suːˈpɜːrfluəs/'), ('PANDEMONIUM', '(n)', '/ˌpændəˈmoʊniəm/'),
  ('RECALCITRANT', '(adj)', '/rɪˈkælsɪtrənt/'), ('GRANDILOQUENT', '(adj)', '/ɡrænˈdɪləkwənt/'), ('DEFENESTRATION', '(n)', '/diːˌfenɪˈstreɪʃn/'), ('FLUMMOXED', '(adj)', '/ˈflʌməkst/'),
  ('EPITOME', '(n)', '/ɪˈpɪtəmi/'), ('INEFFABLY', '(adv)', '/ɪnˈefəbli/'), ('MUNIFICENT', '(adj)', '/mjuːˈnɪfɪsnt/'), ('OBSTREPEROUS', '(adj)', '/əbˈstrepərəs/'),
  ('PAUCITY', '(n)', '/ˈpɔːsəti/'), ('PUSILLANIMOUS', '(adj)', '/ˌpjuːsɪˈlænɪməs/'), ('QUERULOUS', '(adj)', '/ˈkwerələs/'), ('SAGACIOUS', '(adj)', '/səˈɡeɪʃəs/'),
  ('TREPIDATION', '(n)', '/ˌtrepɪˈdeɪʃn/'), ('VOCIFEROUS', '(adj)', '/voʊˈsɪfərəs/'), ('ZEALOUS', '(adj)', '/ˈzeləs/'), ('ACRIMONIOUS', '(adj)', '/ˌækrɪˈmoʊniəs/'),
  ('ALACRITY', '(n)', '/əˈlækrəti/'), ('AMELIORATE', '(v)', '/əˈmiːliəreɪt/'), ('ANACHRONISM', '(n)', '/əˈnækrənɪzəm/'), ('BIFURCATE', '(v)', '/ˈbaɪfərkeɪt/'),
  ('CHICANERY', '(n)', '/ʃɪˈkeɪnəri/'), ('COGENT', '(adj)', '/ˈkoʊdʒənt/'), ('DELETERIOUS', '(adj)', '/ˌdeləˈtɪriəs/'), ('EBULLIENT', '(adj)', '/ɪˈbʊliənt/'),
  ('EGREGIOUS', '(adj)', '/ɪˈɡriːdʒiəs/'), ('FACETIOUS', '(adj)', '/fəˈsiːʃəs/'), ('GARRULOUS', '(adj)', '/ˈɡærələs/'), ('HACKNEYED', '(adj)', '/ˈhæknid/'),
  ('ICONOCLAST', '(n)', '/aɪˈkɑːnəklæst/'), ('JUXTAPOSITION', '(n)', '/ˌdʒʌkstəpəˈzɪʃn/'), ('LACONIC', '(adj)', '/ləˈkɑːnɪk/'), ('MAVERICK', '(n)', '/ˈmævərɪk/')
) AS v(word, pos, phonetics)
WHERE voc.word = v.word;

-- 3. Đảm bảo các từ chưa được liệt kê cũng có giá trị mặc định để không bị rỗng
UPDATE public.vocabulary SET part_of_speech = '(n)' WHERE part_of_speech IS NULL;
UPDATE public.vocabulary SET phonetics = '/.../' WHERE phonetics IS NULL;
