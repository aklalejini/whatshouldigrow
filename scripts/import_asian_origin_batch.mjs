import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const publicDir = path.join(root, "public");
const plantsPath = path.join(dataDir, "plants.json");
const photosPath = path.join(dataDir, "plantPhotos.json");
const batchId = "asian-origin-2026-06-06";
const targetNewPlantCount = 200;
const userAgent = "PlantByZIPDataImport/1.0 (https://plantbyzip.com)";

const candidateData = `
napa-cabbage|Napa cabbage|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|cool-season heads in spring or fall|Asian greens;heading brassica;mild leaves|A productive Chinese cabbage for spring and fall beds with steady moisture.|amazon|Napa cabbage seeds|East Asia|Brassica rapa pekinensis napa cabbage plant
michihili-cabbage|Michihili Chinese cabbage|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|tall cool-season heads|upright Chinese cabbage;good for kimchi|A tall heading cabbage for cool weather, best before summer heat arrives.|amazon|Michihili cabbage seeds|East Asia|Michihili Chinese cabbage plant
tokyo-bekana|Tokyo Bekana cabbage|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|baby leaves or loose heads in cool weather|loose-leaf Asian green;fast harvest|A tender, quick Chinese cabbage type that can be cut young for salads or stir-fries.|amazon|Tokyo Bekana seeds|East Asia|Tokyo Bekana plant
shanghai-green-bok-choy|Shanghai green bok choy|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|spring and fall stalks|green-stem bok choy;container friendly|A compact bok choy for quick cool-season harvests and small beds.|amazon|Shanghai green bok choy seeds|East Asia|Shanghai bok choy plant
white-stem-pak-choi|White stem pak choi|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|crisp stalks in spring or fall|white-stem Asian green;stir-fry crop|Best grown in cool windows with even water for crisp stems.|amazon|white stem pak choi seeds|East Asia|pak choi white stem plant
mei-qing-choi|Mei Qing choi|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|baby heads in cool seasons|baby bok choy;heat-tolerant selection|A small bok choy selection that works well for succession plantings.|amazon|Mei Qing choi seeds|East Asia|Mei Qing choi plant
toy-choi|Toy Choy|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|miniature heads in cool weather|mini bok choy;small-space crop|A very compact bok choy for containers, edges, and quick harvests.|amazon|Toy Choy seeds|East Asia|Toy Choy bok choy plant
chijimisai|Chijimisai|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|savoyed leaves in cool seasons|savoyed Asian green;cold tolerant|A textured Japanese green with a sturdy leaf and good cool-weather performance.|amazon|Chijimisai seeds|East Asia|Chijimisai plant
yukina-savoy|Yukina Savoy|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|glossy leaves in cool seasons|Asian spinach mustard;cold tolerant|A glossy, spoon-leaf green that holds well in cool spring and fall beds.|amazon|Yukina Savoy seeds|East Asia|Yukina Savoy plant
hon-tsai-tai|Hon Tsai Tai|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs;curb-appeal|purple flower shoots in cool weather|edible flower shoots;purple stems|Grow for tender shoots and small yellow flowers before hot weather.|amazon|Hon Tsai Tai seeds|East Asia|Hon Tsai Tai plant
gai-lan|Gai lan Chinese broccoli|annual vegetable|4a,10b|full;partial|loam;clay|medium|vegetables-herbs|leafy stems and buds in cool seasons|Chinese broccoli;edible stems|A cool-season brassica harvested for thick stems, buds, and leaves.|amazon|gai lan Chinese broccoli seeds|East Asia|Gai lan Chinese broccoli plant
baby-kailaan|Baby kailaan|annual vegetable|4a,10b|full;partial|loam|medium|vegetables-herbs|young stems in spring and fall|baby Chinese broccoli;quick harvest|A smaller-stemmed gai lan type for frequent cutting in mild weather.|amazon|baby kailaan seeds|East Asia|baby kailaan plant
chinese-celery|Chinese celery|annual herb|4a,10b|partial;full|loam|medium|vegetables-herbs|leafy stems in cool seasons|strong celery flavor;leaf herb|A leafier celery relative used like an herb in soups and stir-fries.|amazon|Chinese celery seeds|East Asia|Chinese celery plant
chinese-pink-celery|Chinese pink celery|annual herb|4a,10b|partial;full|loam|medium|vegetables-herbs;curb-appeal|pink stems in cool weather|colored stems;leaf celery|A colorful leaf celery for cool beds where flavor and looks both matter.|amazon|Chinese pink celery seeds|East Asia|Chinese pink celery plant
japanese-bunching-onion|Japanese bunching onion|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|scallions through the growing season|bunching onion;cut-and-come-again|A dependable scallion type for repeated cutting and dense planting.|amazon|Japanese bunching onion seeds|East Asia|Allium fistulosum Japanese bunching onion
ishikura-bunching-onion|Ishikura bunching onion|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|long white shanks in cool seasons|Japanese scallion;long shank|Hill lightly for longer white stems and harvest before severe heat.|amazon|Ishikura bunching onion seeds|East Asia|Ishikura long white bunching onion
flowering-chinese-chives|Flowering Chinese chives|perennial herb|4a,9b|full;partial|loam|medium|vegetables-herbs;pollinators-wildlife|edible leaves and white flower stalks|garlic-flavored leaves;edible flowers|A perennial allium for leaves, buds, and pollinator-friendly flowers.|amazon|flowering Chinese chives seeds|East Asia|Allium tuberosum flowering garlic chives
rakkyo|Rakkyo shallot|perennial vegetable|6a,10a|full|loam;sandy|medium|vegetables-herbs|small bulbs in summer|Japanese pickling onion;small bulbs|A small Asian allium usually grown for pickled bulbs and narrow leaves.|amazon|rakkyo bulbs|East Asia|Allium chinense rakkyo
mitsuba|Mitsuba Japanese parsley|perennial herb|5a,9b|partial|loam|medium|vegetables-herbs|tender leaves in spring and fall|shade-tolerant herb;Japanese parsley|A woodland-edge herb for partial shade and cool-season cutting.|amazon|mitsuba seeds|East Asia|Cryptotaenia japonica Mitsuba
shungiku|Shungiku edible chrysanthemum|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs;pollinators-wildlife|leaves and edible flowers in cool weather|edible chrysanthemum;aromatic greens|Harvest young leaves for greens and let some plants flower for insects.|amazon|shungiku seeds|East Asia|Glebionis coronaria shungiku plant
mibuna|Mibuna|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|narrow leaves in cool weather|Japanese mustard green;cut greens|A narrow-leaf mustard green for salads, soups, and quick cuttings.|amazon|Mibuna seeds|East Asia|Mibuna Japanese mustard plant
wasabina|Wasabina mustard|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs|frilly leaves in cool seasons|frilly mustard;peppery leaves|A cold-season mustard with frilled leaves and a sharp bite.|amazon|Wasabina mustard seeds|East Asia|Wasabina mustard plant
green-in-snow-mustard|Green in Snow mustard|annual vegetable|3a,10b|full;partial|loam;clay|medium|vegetables-herbs|mustard leaves in cool seasons|cold-tolerant mustard;Asian greens|A sturdy mustard for fall and overwintering attempts in milder gardens.|amazon|Green in Snow mustard seeds|East Asia|Green in Snow mustard plant
osaka-purple-mustard|Osaka Purple mustard|annual vegetable|3a,10b|full;partial|loam|medium|vegetables-herbs;curb-appeal|purple leaves in cool weather|ornamental edible mustard;purple foliage|Useful when a cool-season edible also needs to look good in the bed.|amazon|Osaka Purple mustard seeds|East Asia|Osaka Purple mustard plant
red-amaranth|Red amaranth greens|annual vegetable|4a,11a|full;partial|loam|medium|vegetables-herbs;curb-appeal|summer greens|heat-tolerant greens;red leaves|A warm-season leaf crop for gardeners who need greens after lettuce fades.|amazon|red amaranth seeds|South Asia;Southeast Asia|Amaranthus tricolor red amaranth plant
chinese-multicolor-spinach|Chinese multicolor spinach|annual vegetable|4a,11a|full;partial|loam|medium|vegetables-herbs;curb-appeal|summer leaves|edible amaranth;colorful foliage|A heat-season edible amaranth with ornamental leaf color.|amazon|Chinese multicolor spinach seeds|East Asia;Southeast Asia|Amaranthus tricolor Chinese spinach
red-stem-malabar-spinach|Red stem Malabar spinach|annual vegetable|7a,11a|full;partial|loam|medium|vegetables-herbs;privacy-screening|summer vine greens|heat-loving vine;edible leaves|A climbing summer green for hot, humid weather and trellised beds.|amazon|red Malabar spinach seeds|South Asia;Southeast Asia|Basella alba rubra plant
celtuce|Celtuce stem lettuce|annual vegetable|3a,10a|full;partial|loam|medium|vegetables-herbs|edible stems in cool seasons|stem lettuce;Chinese kitchen crop|Grow for the thick edible stem before heat causes bitterness.|amazon|celtuce seeds|East Asia|Lactuca sativa celtuce plant
takinogawa-burdock|Takinogawa burdock|annual vegetable|3a,9b|full|loam;sandy|medium|vegetables-herbs|long roots in fall|gobo root;deep-rooted crop|Needs deep loose soil, but rewards patient growers with long roots.|amazon|Takinogawa burdock seeds|East Asia|Arctium lappa Takinogawa burdock
shogoin-turnip|Shogoin turnip|annual vegetable|3a,10a|full;partial|loam|medium|vegetables-herbs|large roots and greens in cool seasons|Japanese turnip;edible greens|A large Japanese turnip with useful greens and mild roots.|amazon|Shogoin turnip seeds|East Asia|Shogoin turnip plant
tokyo-cross-turnip|Tokyo Cross turnip|annual vegetable|3a,10a|full;partial|loam|medium|vegetables-herbs|small white roots in cool seasons|quick Japanese turnip;salad roots|A fast turnip for tender white roots and compact spring plantings.|amazon|Tokyo Cross turnip seeds|East Asia|Tokyo Cross turnip plant
minowase-daikon|Minowase daikon|annual vegetable|3a,10a|full|loam;sandy|medium|vegetables-herbs|long roots in cool seasons|Japanese daikon;large roots|A long daikon type that needs loose soil and steady fall growth.|amazon|Minowase daikon seeds|East Asia|Minowase daikon radish plant
miyashige-daikon|Miyashige daikon|annual vegetable|3a,10a|full|loam;sandy|medium|vegetables-herbs|large roots in fall|Japanese daikon;storage radish|Best as a late-summer sowing for fall roots and greens.|amazon|Miyashige daikon seeds|East Asia|Miyashige daikon radish plant
korean-mu-radish|Korean mu radish|annual vegetable|3a,10a|full|loam;sandy|medium|vegetables-herbs|dense roots in cool weather|Korean radish;kimchi crop|A dense, broad daikon relative for fall harvest and fermenting.|amazon|Korean mu radish seeds|East Asia|Korean mu radish plant
china-rose-radish|China Rose radish|annual vegetable|3a,10a|full;partial|loam|medium|vegetables-herbs|pink winter roots|winter radish;rose skin|A cool-weather storage radish with colorful roots and crisp texture.|amazon|China Rose radish seeds|East Asia|China Rose radish plant
watermelon-radish|Watermelon radish|annual vegetable|3a,10a|full;partial|loam|medium|vegetables-herbs;curb-appeal|green-white roots with pink centers|Chinese winter radish;colorful root|Plant for fall harvest when cool weather improves color and flavor.|amazon|watermelon radish seeds|East Asia|watermelon radish plant
kintoki-carrot|Kintoki red carrot|annual vegetable|3a,10a|full|sandy;loam|medium|vegetables-herbs|red roots in cool seasons|Japanese red carrot;colorful root|A red carrot for loose soil, fall color, and slow steady growth.|amazon|Kintoki carrot seeds|East Asia|Kintoki red carrot plant
kuroda-carrot|Kuroda carrot|annual vegetable|3a,10a|full|sandy;loam|medium|vegetables-herbs|thick roots in cool seasons|Japanese carrot;handles heavier soil|A broad-shouldered carrot type often chosen for less-than-perfect soil.|amazon|Kuroda carrot seeds|East Asia|Kuroda carrot plant
lotus-root|Lotus root|perennial vegetable|7a,10b|full|clay;loam|high|vegetables-herbs;curb-appeal;pollinators-wildlife|rhizomes in late season|edible water-garden crop;showy flowers|A warm-season water-garden crop for tubs or ponds, not dry beds.|amazon|lotus root tubers|East Asia;South Asia|Nelumbo nucifera lotus plant
chinese-water-chestnut|Chinese water chestnut|perennial vegetable|8a,11a|full|clay;loam|high|vegetables-herbs|corms after a long warm season|wet-soil crop;container pond crop|Needs standing moisture and a long warm season to size up corms.|amazon|Chinese water chestnut corms|East Asia;Southeast Asia|Eleocharis dulcis Chinese water chestnut plant
taro|Taro|perennial vegetable|8a,11a|full;partial|loam;clay|high|vegetables-herbs;curb-appeal|corms and leaves in warm climates|tropical edible;large foliage|A warm, moisture-loving edible that can be grown ornamentally in containers.|amazon|taro bulbs|South Asia;Southeast Asia|Colocasia esculenta taro plant
eddoe-taro|Eddoe taro|perennial vegetable|8a,11a|full;partial|loam;clay|high|vegetables-herbs|small corms in long warm seasons|compact taro;wet-soil edible|A smaller taro type suited to containers and humid summer gardens.|amazon|eddoe taro corms|East Asia;Southeast Asia|Colocasia eddoe plant
crosne-chinese-artichoke|Crosne Chinese artichoke|perennial vegetable|5a,9b|full;partial|loam|medium|vegetables-herbs|knobby tubers in fall|small tubers;perennial edible|A mint-family root crop with small crisp tubers; harvest carefully.|amazon|Chinese artichoke crosne tubers|East Asia|Stachys affinis crosne plant
wasabi|Wasabi|perennial herb|7a,9b|partial|loam|high|vegetables-herbs|rhizomes after slow establishment|shade crop;cool moist soil|A specialty crop for cool shade, constant moisture, and protected sites.|amazon|wasabi plants|East Asia|Eutrema japonicum wasabi plant
myoga-ginger|Myoga ginger|perennial herb|7a,10a|partial|loam|medium|vegetables-herbs;curb-appeal|flower buds in late summer|edible flower buds;shade tolerant|Grow for aromatic flower buds rather than ordinary ginger rhizomes.|amazon|myoga ginger plants|East Asia|Zingiber mioga plant
culinary-ginger|Culinary ginger|perennial herb|8a,11a|partial;full|loam|medium|vegetables-herbs|rhizomes after a long warm season|tropical rhizome;container crop|A warm-season rhizome crop best started indoors where summers are short.|amazon|culinary ginger rhizomes|South Asia;Southeast Asia|Zingiber officinale plant
turmeric|Turmeric|perennial herb|8a,11a|partial;full|loam|medium|vegetables-herbs|rhizomes after a long warm season|gold rhizomes;tropical foliage|A tropical rhizome crop that works well in pots moved through the seasons.|amazon|turmeric rhizomes for planting|South Asia;Southeast Asia|Curcuma longa plant
galangal|Galangal|perennial herb|9a,11a|partial;full|loam|medium|vegetables-herbs|aromatic rhizomes in warm climates|Southeast Asian rhizome;tropical herb|Best as a container crop outside frost-free gardens.|amazon|galangal rhizomes for planting|Southeast Asia|Alpinia galanga plant
makrut-lime|Makrut lime|citrus|9b,11a|full|loam;sandy|medium|vegetables-herbs;fruit;curb-appeal|aromatic leaves year-round in warm sites|fragrant leaves;container citrus|Usually grown for leaves; protect from freezes outside warm citrus zones.|amazon|makrut lime tree|Southeast Asia|Citrus hystrix makrut lime plant
curry-leaf|Curry leaf tree|perennial herb|9b,11a|full;partial|loam|medium|vegetables-herbs;curb-appeal|aromatic leaves through warm seasons|South Asian culinary leaves;container shrub|A frost-tender culinary shrub that adapts well to patio containers.|amazon|curry leaf plant|South Asia|Murraya koenigii curry leaf plant
vietnamese-coriander|Vietnamese coriander|perennial herb|9a,11a|partial;full|loam|high|vegetables-herbs|leaves through warm seasons|moisture-loving herb;container friendly|A fast leafy herb for warm weather, steady moisture, and partial shade.|amazon|Vietnamese coriander plant|Southeast Asia|Persicaria odorata Vietnamese coriander plant
holy-basil|Holy basil tulsi|annual herb|4a,11a|full|loam|medium|vegetables-herbs;pollinators-wildlife|summer leaves and flowers|aromatic basil;bee flowers|A heat-loving basil relative for tea, fragrance, and pollinator flowers.|amazon|holy basil tulsi seeds|South Asia|Ocimum tenuiflorum holy basil plant
lemon-basil|Lemon basil|annual herb|4a,11a|full|loam|medium|vegetables-herbs;pollinators-wildlife|summer leaves|citrus-scented basil;warm-season herb|A warm-weather basil with bright leaf fragrance; it is not citrus.|amazon|lemon basil seeds|South Asia;Southeast Asia|Ocimum basilicum citriodorum lemon basil plant
sesame|Sesame|annual herb|5a,11a|full|sandy;loam|low|vegetables-herbs;curb-appeal|seed pods after hot summer weather|drought-tolerant seed crop;upright plant|Needs heat and a long season; harvest dry pods before they shatter.|amazon|sesame seeds for planting|South Asia;Western Asia|Sesamum indicum plant
black-sesame|Black sesame|annual herb|5a,11a|full|sandy;loam|low|vegetables-herbs|dark seed pods after heat|black seed sesame;heat crop|A hot-weather seed crop for sunny beds with sharp drainage.|amazon|black sesame seeds for planting|South Asia;Western Asia|black sesame plant Sesamum indicum
green-shiso|Green shiso perilla|annual herb|4a,10b|full;partial|loam|medium|vegetables-herbs;curb-appeal|summer leaves|Japanese leaf herb;self-sows readily|Grow in a managed spot and remove extra seedlings if it self-sows.|amazon|green shiso seeds|East Asia|Perilla frutescens green shiso plant
red-shiso|Red shiso perilla|annual herb|4a,10b|full;partial|loam|medium|vegetables-herbs;curb-appeal|purple-red leaves in summer|colored leaf herb;pickle herb|A red-leaf shiso for color, seasoning, and warm-season containers.|amazon|red shiso seeds|East Asia|Perilla frutescens red shiso plant
bitter-melon|Bitter melon|annual fruit vine|5a,11a|full|loam|medium|vegetables-herbs|summer gourds|tropical vine;bitter fruit|Needs warm soil, a trellis, and frequent harvest while fruits are young.|amazon|bitter melon seeds|South Asia;Southeast Asia|Momordica charantia bitter melon plant
white-bitter-melon|White bitter melon|annual fruit vine|5a,11a|full|loam|medium|vegetables-herbs|pale summer gourds|Asian gourd;trellis crop|A pale bitter melon type for hot-summer gardens and strong trellises.|amazon|white bitter melon seeds|East Asia;Southeast Asia|white bitter melon plant
luffa-gourd|Luffa gourd|annual fruit vine|5a,11a|full|loam;sandy|medium|vegetables-herbs;pollinators-wildlife|young edible gourds or mature sponges|vigorous vine;long season|Harvest young for eating or leave mature fruit to dry for sponges.|amazon|luffa gourd seeds|South Asia;Southeast Asia|Luffa aegyptiaca plant
snake-gourd|Snake gourd|annual fruit vine|5a,11a|full|loam|medium|vegetables-herbs|long summer gourds|Asian gourd;vigorous vine|Best on a tall trellis in hot weather with consistent water.|amazon|snake gourd seeds|South Asia;Southeast Asia|Trichosanthes cucumerina snake gourd plant
wax-gourd|Wax gourd|annual fruit vine|5a,11a|full|loam|medium|vegetables-herbs|large summer to fall gourds|winter melon;storage gourd|Needs space and heat for large fruits; train vines if bed space is tight.|amazon|wax gourd winter melon seeds|East Asia;Southeast Asia|Benincasa hispida wax gourd plant
korean-melon|Korean melon|annual fruit vine|5a,11a|full|sandy;loam|medium|fruit;vegetables-herbs|small melons in summer|small yellow melon;warm-season vine|A compact melon option where summers are warm and soil drains well.|amazon|Korean melon seeds|East Asia|Cucumis melo Korean melon plant
hami-melon|Hami melon|annual fruit vine|5a,11a|full|sandy;loam|medium|fruit;vegetables-herbs|summer melons|Central Asian melon;sweet flesh|Best with heat, full sun, and reduced water near ripening.|amazon|Hami melon seeds|Central Asia|Hami melon plant
japanese-climbing-cucumber|Japanese climbing cucumber|annual fruit vine|4a,10b|full|loam;sandy|medium|vegetables-herbs|summer cucumbers|trellis cucumber;long fruit|A trellis-friendly cucumber with long fruit and steady picking needs.|amazon|Japanese climbing cucumber seeds|East Asia|Japanese climbing cucumber plant
asian-pickling-cucumber|Asian pickling cucumber|annual fruit vine|4a,10b|full|loam;sandy|medium|vegetables-herbs|summer pickling cucumbers|small cucumber;fermenting crop|Grow on a trellis and pick frequently for crisp small cucumbers.|amazon|Asian pickling cucumber seeds|East Asia|Asian pickling cucumber plant
thai-long-green-eggplant|Thai long green eggplant|annual vegetable|5a,11a|full|loam|medium|vegetables-herbs|summer fruits|long green eggplant;heat crop|A warm-season eggplant for steady picking in hot weather.|amazon|Thai long green eggplant seeds|Southeast Asia|Thai long green eggplant plant
ichiban-eggplant|Ichiban eggplant|annual vegetable|5a,11a|full|loam|medium|vegetables-herbs|slender fruits in summer|Japanese eggplant;productive plant|A dependable slender eggplant for containers or warm garden beds.|amazon|Ichiban eggplant seeds|East Asia|Ichiban eggplant plant
thai-round-eggplant|Thai round eggplant|annual vegetable|5a,11a|full|loam|medium|vegetables-herbs|round fruits in summer|round Thai eggplant;heat-loving crop|Needs heat and regular harvest before fruit gets tough.|amazon|Thai round eggplant seeds|Southeast Asia|Thai round eggplant plant
japanese-white-eggplant|Japanese white eggplant|annual vegetable|5a,11a|full|loam|medium|vegetables-herbs|white fruits in summer|white eggplant;container candidate|A warm-season eggplant with pale fruit and standard eggplant care needs.|amazon|Japanese white eggplant seeds|East Asia|white Japanese eggplant plant
red-noodle-yardlong-bean|Red Noodle yardlong bean|annual vegetable|5a,11a|full|loam|medium|vegetables-herbs;curb-appeal|long red pods in summer|yardlong bean;heat-loving vine|A hot-weather pole bean with striking red pods and trellis needs.|amazon|Red Noodle yardlong bean seeds|Southeast Asia|Red Noodle yardlong bean plant
winged-bean|Winged bean|annual vegetable|8a,11a|full|loam|medium|vegetables-herbs|pods in long warm seasons|tropical legume;edible pods|A tropical legume for frost-free or very long summer gardens.|amazon|winged bean seeds|Southeast Asia|Psophocarpus tetragonolobus winged bean plant
hyacinth-bean|Hyacinth bean|annual fruit vine|5a,11a|full|loam|medium|vegetables-herbs;curb-appeal;privacy-screening|purple pods and flowers in summer|ornamental edible vine;purple pods|Grow mostly as an ornamental vine unless you know safe food preparation.|amazon|hyacinth bean vine seeds|South Asia|Lablab purpureus hyacinth bean plant
mung-bean|Mung bean|annual vegetable|5a,11a|full|loam;sandy|medium|vegetables-herbs|pods after hot weather|warm-season bean;sprout seed crop|A heat-loving bean usually grown for dry seed or sprouts.|amazon|mung bean seeds for planting|South Asia;Southeast Asia|Vigna radiata mung bean plant
adzuki-bean|Adzuki bean|annual vegetable|5a,10b|full|loam|medium|vegetables-herbs|dry beans in late summer|small red bean;warm-season crop|Grow like a warm-season bush bean and harvest dry pods before rain.|amazon|adzuki bean seeds for planting|East Asia|Vigna angularis adzuki bean plant
black-soybean|Black soybean|annual vegetable|4a,10b|full|loam|medium|vegetables-herbs|pods or dry beans in summer|edamame type;black seed|A soybean option for edamame or dry seed in warm beds.|amazon|black soybean seeds for planting|East Asia|Glycine max black soybean plant
sword-bean|Sword bean|annual fruit vine|8a,11a|full|loam|medium|vegetables-herbs;privacy-screening|large pods in long warm seasons|tropical vine;large pods|A vigorous tropical bean for long seasons and strong support.|amazon|sword bean seeds|South Asia;Southeast Asia|Canavalia gladiata sword bean plant
dryland-rice|Upland rice|annual vegetable|5a,10b|full|loam;clay|high|vegetables-herbs|grain after a long warm season|grain crop;moist-soil tolerant|A novelty grain crop for small plots with steady moisture and heat.|amazon|upland rice seeds|East Asia;South Asia;Southeast Asia|Oryza sativa upland rice plant
honey-jar-jujube|Honey Jar jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit;curb-appeal|small crisp fruit in late summer to fall|small sweet jujube;low-water fruit tree|A compact-fruited jujube selection for hot sunny yards with good drainage.|raintree|Honey Jar jujube tree|East Asia|Ziziphus jujuba Honey Jar jujube tree
sugar-cane-jujube|Sugar Cane jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit|crisp fruit in late summer to fall|sweet jujube;heat tolerant|A sweet jujube cultivar that pairs well with another jujube nearby.|raintree|Sugar Cane jujube tree|East Asia|Ziziphus jujuba Sugar Cane jujube
shanxi-li-jujube|Shanxi Li jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit|large fruit in fall|large-fruited jujube;dryland fruit|A large-fruited jujube for hot sunny sites and leaner soils.|raintree|Shanxi Li jujube tree|East Asia|Ziziphus jujuba Shanxi Li
chico-jujube|Chico jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit;curb-appeal|round fruit in fall|rounded fruit;ornamental habit|A jujube with rounded fruit and a useful form for edible landscapes.|raintree|Chico jujube tree|East Asia|Ziziphus jujuba Chico
ga-866-jujube|GA 866 jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit|elongated fruit in fall|sweet elongated fruit;heat tolerant|A low-water fruit tree for long hot seasons and full sun.|raintree|GA 866 jujube tree|East Asia|Ziziphus jujuba GA 866
contorted-jujube|Contorted jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit;curb-appeal|fruit in fall|twisted branches;edible fruit|Grown as much for branch structure as fruit; best in sunny dry sites.|raintree|contorted jujube tree|East Asia|Ziziphus jujuba contorted jujube
ichikikeijiro-persimmon|Ichi Ki Kei Jiro persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit;curb-appeal|non-astringent fruit in fall|Asian persimmon;fall color|A compact non-astringent persimmon for warm temperate gardens.|starkbros|Ichi Ki Kei Jiro persimmon tree|East Asia|Diospyros kaki Ichi Ki Kei Jiro persimmon
jiro-persimmon|Jiro Asian persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit;curb-appeal|crisp fruit in fall|non-astringent persimmon;tidy tree|A classic crisp-eating Asian persimmon for long warm seasons.|starkbros|Jiro persimmon tree|East Asia|Diospyros kaki Jiro persimmon
coffee-cake-persimmon|Coffee Cake persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit|pollination-variant fruit in fall|Asian persimmon;complex flavor|Best planted with a compatible pollinator if fruit character matters.|raintree|Coffee Cake persimmon tree|East Asia|Diospyros kaki Coffee Cake persimmon
chocolate-persimmon|Chocolate persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit|fall fruit|Asian persimmon;pollination-variant flesh|A specialty Asian persimmon for warm gardens and careful cultivar selection.|raintree|Chocolate persimmon tree|East Asia|Diospyros kaki Chocolate persimmon
tamopan-persimmon|Tamopan persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit;curb-appeal|large astringent fruit in fall|large Asian persimmon;ornamental fruit|Grow for large fruit that is eaten fully soft, not crisp.|starkbros|Tamopan persimmon tree|East Asia|Diospyros kaki Tamopan persimmon
giombo-persimmon|Giombo persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit|fall fruit|astringent persimmon;rich pulp|A soft-eating persimmon for gardeners who like rich pulp and late harvests.|raintree|Giombo persimmon tree|East Asia|Diospyros kaki Giombo persimmon
giant-fuyu-persimmon|Giant Fuyu persimmon|fruit tree|7a,10a|full|loam;clay|medium|fruit;curb-appeal|large crisp fruit in fall|non-astringent fruit;fall color|A larger-fruited Fuyu-style persimmon for warm temperate yards.|starkbros|Giant Fuyu persimmon tree|East Asia|Diospyros kaki Giant Fuyu
chojuro-asian-pear|Chojuro Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|russet fruit in late summer|Asian pear;russet skin|A traditional russet Asian pear with crisp fruit and full-sun needs.|starkbros|Chojuro Asian pear tree|East Asia|Pyrus pyrifolia Chojuro Asian pear
shinko-asian-pear|Shinko Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|crisp fruit in late summer to fall|Asian pear;fire blight resistance cue|A later Asian pear choice with crisp fruit and a reputation for resilience.|starkbros|Shinko Asian pear tree|East Asia|Pyrus pyrifolia Shinko Asian pear
kosui-asian-pear|Kosui Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|sweet fruit in summer|Asian pear;sweet crisp fruit|A popular early Asian pear for gardeners who can manage thinning and pests.|starkbros|Kosui Asian pear tree|East Asia|Pyrus pyrifolia Kosui Asian pear
ya-li-asian-pear|Ya Li Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|pear-shaped fruit in fall|Chinese pear;crisp fruit|A Chinese pear type for full sun, careful pruning, and compatible pollination.|raintree|Ya Li Asian pear tree|East Asia|Pyrus bretschneideri Ya Li pear
tennosui-asian-pear|Tennosui Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|late summer fruit|hybrid Asian pear;crisp fruit|A crisp pear option for gardeners comparing Asian pear pollination groups.|raintree|Tennosui Asian pear tree|East Asia|Tennosui Asian pear tree
chinese-quince|Chinese quince|fruit tree|6a,9b|full|loam;clay|medium|fruit;curb-appeal|aromatic fruit in fall|aromatic quince;ornamental bark|A small tree with fragrant hard fruit and attractive bark.|raintree|Chinese quince tree|East Asia|Pseudocydonia sinensis Chinese quince tree
flowering-quince|Flowering quince|fruit shrub|5a,9b|full;partial|loam;clay|low|curb-appeal;pollinators-wildlife;privacy-screening|early spring flowers and hard fruit|early bloom;thorny shrub|A tough spring-flowering shrub; fruit is usually used cooked or left for wildlife.|amazon|flowering quince shrub|East Asia|Chaenomeles flowering quince shrub
crimson-and-gold-quince|Crimson and Gold quince|fruit shrub|5a,9b|full|loam;clay|low|curb-appeal;pollinators-wildlife|red spring bloom and small fruit|compact quince;early flowers|A smaller flowering quince for early color and dense shrub structure.|amazon|Crimson and Gold flowering quince|East Asia|Chaenomeles Crimson and Gold flowering quince
ume-plum|Ume Japanese apricot|fruit tree|6a,9b|full|loam;clay|medium|fruit;curb-appeal;pollinators-wildlife|very early bloom and tart fruit|Japanese apricot;winter bloom|Grown for early flowers and tart processing fruit where late freezes allow.|raintree|Ume Japanese apricot tree|East Asia|Prunus mume Japanese apricot tree
hollywood-plum|Hollywood Japanese plum|fruit tree|5b,9b|full|loam;sandy|medium|fruit;curb-appeal|red-fleshed plums in summer|Japanese plum;purple foliage|A colorful plum selection with ornamental foliage and edible fruit.|starkbros|Hollywood plum tree|East Asia|Hollywood Japanese plum tree
mariposa-plum|Mariposa Japanese plum|fruit tree|5b,9b|full|loam;sandy|medium|fruit|large plums in summer|Japanese plum;large fruit|A warm-climate Japanese plum that needs sun, drainage, and pollination planning.|starkbros|Mariposa plum tree|East Asia|Mariposa Japanese plum tree
ozark-premier-plum|Ozark Premier plum|fruit tree|5b,9b|full|loam;sandy|medium|fruit|large summer plums|Japanese-type plum;productive fruit|A Japanese-type plum selection for humid regions with normal stone-fruit care.|starkbros|Ozark Premier plum tree|East Asia|Ozark Premier plum tree
pakistan-mulberry|Pakistan mulberry|fruit tree|8a,10b|full|loam;sandy|medium|fruit;privacy-screening|long berries in warm seasons|long mulberry fruit;warm-climate tree|Best for warm zones; protect from hard freezes in marginal gardens.|raintree|Pakistan mulberry tree|South Asia|Pakistan mulberry tree Morus macroura
shangri-la-mulberry|Shangri-La mulberry|fruit tree|7a,10a|full|loam;clay;sandy|medium|fruit;privacy-screening|large berries in spring to summer|large-fruited mulberry;fast shade|A fruiting mulberry for warm regions where a spreading tree is acceptable.|raintree|Shangri La mulberry tree|East Asia|Shangri-La mulberry tree
hardy-orange|Hardy orange|citrus|6a,9b|full|loam;clay|medium|curb-appeal;privacy-screening;pollinators-wildlife|fragrant bloom and bitter fruit|thorny citrus;hardy rootstock|Useful as a thorny hedge or citrus curiosity; fruit is bitter fresh.|amazon|hardy orange tree|East Asia|Poncirus trifoliata hardy orange tree
sudachi-citrus|Sudachi citrus|citrus|8b,10b|full|loam;sandy|medium|fruit;vegetables-herbs|green aromatic fruit in fall|Japanese citrus;culinary juice|A specialty citrus for mild-winter gardens or protected containers.|raintree|Sudachi citrus tree|East Asia|Sudachi citrus tree
kabosu-citrus|Kabosu citrus|citrus|8b,10b|full|loam;sandy|medium|fruit;vegetables-herbs|aromatic fruit in fall|Japanese citrus;culinary juice|Grow like other tender citrus and protect during freezing weather.|raintree|Kabosu citrus tree|East Asia|Kabosu citrus tree
calamondin|Calamondin citrus|citrus|9a,11a|full|loam;sandy|medium|fruit;curb-appeal|small tart fruit over a long season|small citrus;container friendly|A compact citrus for patios, containers, and frost-free gardens.|starkbros|Calamondin orange tree|Southeast Asia|Calamondin citrus plant
meiwa-kumquat|Meiwa kumquat|citrus|8b,10b|full|loam;sandy|medium|fruit;curb-appeal|sweet-tart fruit in winter|round kumquat;container citrus|A small citrus tree with edible peel fruit and good patio potential.|starkbros|Meiwa kumquat tree|East Asia|Meiwa kumquat tree
nagami-kumquat|Nagami kumquat|citrus|8b,10b|full|loam;sandy|medium|fruit;curb-appeal|oval fruit in winter|kumquat;edible peel|A classic kumquat for warm gardens or movable containers.|starkbros|Nagami kumquat tree|East Asia|Nagami kumquat tree
ichang-lemon|Ichang lemon|citrus|8a,10b|full|loam;sandy|medium|fruit|aromatic fruit in fall|cold-tolerant citrus;aromatic fruit|A hardier citrus relative for gardeners testing citrus at the edge.|raintree|Ichang lemon tree|East Asia|Ichang lemon tree
changsha-mandarin|Changsha mandarin|citrus|8a,10b|full|loam;sandy|medium|fruit|mandarins in fall to winter|cold-tolerant mandarin;seedy fruit|A cold-tolerant mandarin type for protected warm-zone sites.|raintree|Changsha mandarin tree|East Asia|Changsha mandarin tree
kishu-mandarin|Kishu mandarin|citrus|8b,10b|full|loam;sandy|medium|fruit;curb-appeal|small mandarins in winter|seedless mandarin;small fruit|A small-fruited mandarin for mild winters and container culture.|starkbros|Kishu mandarin tree|East Asia|Kishu mandarin tree
dekopon-mandarin|Dekopon mandarin|citrus|9a,11a|full|loam;sandy|medium|fruit|large easy-peel citrus in winter|sumo-type citrus;sweet mandarin|A tender specialty citrus for protected containers or frost-free sites.|amazon|Dekopon mandarin tree|East Asia|Dekopon mandarin tree
tea-camellia|Tea camellia|perennial herb|7a,10a|partial;full|loam|medium|vegetables-herbs;curb-appeal|young leaves in warm seasons|tea leaves;evergreen shrub|An evergreen shrub grown for tea leaves and glossy foliage.|amazon|Camellia sinensis tea plant|East Asia;South Asia|Camellia sinensis tea plant
sichuan-pepper|Sichuan pepper|fruit shrub|6a,9b|full|loam|medium|vegetables-herbs;curb-appeal|aromatic husks in fall|culinary spice shrub;thorny stems|A hardy spice shrub grown for aromatic fruit husks, not true peppercorns.|amazon|Sichuan pepper plant|East Asia|Zanthoxylum simulans Sichuan pepper plant
sansho-pepper|Sansho pepper|fruit shrub|6a,9b|full;partial|loam|medium|vegetables-herbs;curb-appeal|aromatic leaves and husks|Japanese spice shrub;thorny stems|Use as a specialty culinary shrub and place away from narrow paths.|amazon|Sansho pepper plant|East Asia|Zanthoxylum piperitum sansho pepper plant
korean-pine-nut|Korean pine nut|nut tree|4a,8a|full|loam;sandy|medium|fruit;curb-appeal|pine nuts after long establishment|edible pine nuts;large evergreen|A long-horizon edible evergreen for large sites, not small raised beds.|amazon|Korean pine tree|East Asia|Pinus koraiensis Korean pine
heartnut|Heartnut Japanese walnut|nut tree|4b,8b|full|loam|medium|fruit;curb-appeal|heart-shaped nuts in fall|Japanese walnut;large shade tree|Needs space, sun, and patience; use as a long-term nut tree.|raintree|heartnut tree|East Asia|Juglans ailantifolia heartnut tree
ginkgo|Ginkgo|nut tree|4a,9a|full|loam;clay|low|curb-appeal|gold fall foliage; nuts on female trees|ancient tree;urban tolerant|Choose male cultivars for ornamental planting if fruit odor is a concern.|amazon|ginkgo tree|East Asia|Ginkgo biloba tree
kerman-pistachio|Kerman pistachio|nut tree|7b,10b|full|sandy;loam|low|fruit|nuts in hot dry climates|dry-climate nut tree;needs pollinator|Best for hot dry regions with winter chill and a compatible male nearby.|starkbros|Kerman pistachio tree|Western Asia;Central Asia|Pistacia vera Kerman pistachio tree
chinese-hawthorn|Chinese hawthorn|fruit tree|5a,9a|full|loam;clay|medium|fruit;curb-appeal;pollinators-wildlife|red fruit in fall|ornamental fruit;small tree|A small fruiting tree with red haws usually used cooked or preserved.|amazon|Chinese hawthorn tree|East Asia|Crataegus pinnatifida Chinese hawthorn tree
yangmei|Yangmei Chinese bayberry|fruit tree|9a,11a|full;partial|loam;sandy|medium|fruit;curb-appeal|red fruit in warm climates|subtropical fruit;evergreen tree|A specialty fruit tree for mild climates and protected warm sites.|amazon|yangmei tree|East Asia|Myrica rubra yangmei tree
kousa-dogwood|Kousa dogwood|ornamental tree|5a,8b|full;partial|loam;clay|medium|curb-appeal;pollinators-wildlife|late spring flowers and red fruit|layered branches;showy bracts|A small ornamental tree with late bloom and good four-season structure.|amazon|Kousa dogwood tree|East Asia|Cornus kousa tree
variegated-kousa-dogwood|Variegated kousa dogwood|ornamental tree|5a,8b|partial;full|loam|medium|curb-appeal|variegated foliage and late spring bracts|variegated leaves;small tree|Best where afternoon sun is not too harsh and soil stays even.|amazon|variegated Kousa dogwood tree|East Asia|Cornus kousa variegated
japanese-snowbell|Japanese snowbell|ornamental tree|5a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|white bell flowers in late spring|small flowering tree;graceful habit|A refined small tree for moist, well-drained garden sites.|amazon|Japanese snowbell tree|East Asia|Styrax japonicus tree
japanese-stewartia|Japanese stewartia|ornamental tree|5a,8a|partial;full|loam|medium|curb-appeal|summer white flowers and peeling bark|peeling bark;fall color|A slow, elegant tree for acidic to neutral soil and even moisture.|amazon|Japanese stewartia tree|East Asia|Stewartia pseudocamellia tree
katsura-tree|Katsura tree|ornamental tree|4b,8b|full;partial|loam|medium|curb-appeal|spring foliage and fall color|heart-shaped leaves;gold fall color|Needs space and moisture; drought stress can scorch leaves.|amazon|Katsura tree|East Asia|Cercidiphyllum japonicum tree
autumn-gold-ginkgo|Autumn Gold ginkgo|ornamental tree|4a,9a|full|loam;clay|low|curb-appeal|gold fall foliage|male ginkgo cultivar;urban tolerant|A male ginkgo selection for long-lived shade and reliable fall color.|amazon|Autumn Gold ginkgo tree|East Asia|Ginkgo biloba Autumn Gold
dawn-redwood|Dawn redwood|ornamental tree|5a,8b|full|loam;clay|medium|curb-appeal|soft needles and bronze fall color|deciduous conifer;fast growth|A large deciduous conifer for roomy sites with consistent moisture.|amazon|Dawn redwood tree|East Asia|Metasequoia glyptostroboides tree
paperbark-maple|Paperbark maple|ornamental tree|5a,8a|full;partial|loam|medium|curb-appeal|peeling bark and fall color|small maple;exfoliating bark|A slow small maple valued for cinnamon peeling bark and fall color.|amazon|Paperbark maple tree|East Asia|Acer griseum paperbark maple
trident-maple|Trident maple|ornamental tree|5a,9a|full|loam;clay|low|curb-appeal|fall color|small shade tree;tough maple|A compact maple for urban heat, patios, and trained forms.|amazon|Trident maple tree|East Asia|Acer buergerianum tree
korean-maple|Korean maple|ornamental tree|4a,8a|full;partial|loam|medium|curb-appeal|fall color|cold-hardy maple;Japanese-maple look|A useful maple where Japanese maples struggle with winter cold.|amazon|Korean maple tree|East Asia|Acer pseudosieboldianum Korean maple
fullmoon-maple|Fullmoon maple|ornamental tree|5a,8a|partial|loam|medium|curb-appeal|layered leaves and fall color|shade-tolerant maple;rounded leaves|Best in protected partial shade with steady moisture.|amazon|Fullmoon maple tree|East Asia|Acer japonicum fullmoon maple
coral-bark-japanese-maple|Coral Bark Japanese maple|ornamental tree|5a,8b|partial;full|loam|medium|curb-appeal|red winter stems and fall color|coral bark;small maple|A small maple chosen for winter stem color and delicate foliage.|amazon|Sango Kaku Japanese maple tree|East Asia|Acer palmatum Sango Kaku
emperor-one-japanese-maple|Emperor One Japanese maple|ornamental tree|5a,8b|partial;full|loam|medium|curb-appeal|red foliage and fall color|red Japanese maple;small tree|A red-leaf Japanese maple selection for protected garden sites.|amazon|Emperor One Japanese maple tree|East Asia|Acer palmatum Emperor One
chinese-fringe-tree|Chinese fringe tree|ornamental tree|6a,9a|full;partial|loam|medium|curb-appeal;pollinators-wildlife|fragrant white spring flowers|small flowering tree;fringe flowers|A small flowering tree with clouds of white spring bloom.|amazon|Chinese fringe tree|East Asia|Chionanthus retusus Chinese fringe tree
seven-son-flower|Seven-son flower|ornamental tree|5a,9a|full|loam;clay|medium|curb-appeal;pollinators-wildlife|late summer flowers and red calyces|late-season bloom;peeling bark|A late-blooming small tree useful for pollinator timing and fall color.|amazon|Seven Son flower tree|East Asia|Heptacodium miconioides tree
japanese-tree-lilac|Japanese tree lilac|ornamental tree|3b,7b|full|loam;clay|medium|curb-appeal;pollinators-wildlife|cream flowers in early summer|small flowering tree;cold hardy|A cold-hardy small tree with early-summer flower clusters.|amazon|Japanese tree lilac|East Asia|Syringa reticulata Japanese tree lilac
japanese-zelkova|Japanese zelkova|ornamental tree|5a,8b|full|loam;clay|medium|curb-appeal|shade and fall color|shade tree;vase form|A large shade tree option for roomy yards and streetside settings.|amazon|Japanese zelkova tree|East Asia|Zelkova serrata tree
chinese-pistache|Chinese pistache|ornamental tree|6b,9b|full|loam;clay;sandy|low|curb-appeal|orange-red fall color|drought-tolerant tree;fall color|A tough ornamental shade tree for heat, sun, and leaner soils.|amazon|Chinese pistache tree|East Asia|Pistacia chinensis Chinese pistache tree
lacebark-pine|Lacebark pine|ornamental tree|4b,8b|full|loam;sandy|low|curb-appeal|evergreen needles and patterned bark|three-needle pine;ornamental bark|A slow pine for collectors and larger sunny gardens.|amazon|Lacebark pine tree|East Asia|Pinus bungeana lacebark pine
japanese-black-pine|Japanese black pine|ornamental tree|5a,8b|full|sandy;loam|low|curb-appeal;privacy-screening|evergreen structure|salt-tolerant pine;bold needles|A rugged pine for sunny, well-drained sites and coastal exposure.|amazon|Japanese black pine tree|East Asia|Pinus thunbergii tree
japanese-white-pine|Japanese white pine|ornamental tree|4a,8a|full|loam;sandy|medium|curb-appeal|soft evergreen needles|fine-textured pine;small specimen|A graceful pine for cooler sites and well-drained soil.|amazon|Japanese white pine tree|East Asia|Pinus parviflora Japanese white pine
korean-fir|Korean fir|ornamental tree|5a,7b|full;partial|loam|medium|curb-appeal|purple cones and evergreen needles|compact fir;ornamental cones|Best in cooler climates with good drainage and less summer heat.|amazon|Korean fir tree|East Asia|Abies koreana Korean fir
deodar-cedar|Deodar cedar|ornamental tree|7a,9b|full|loam;sandy|low|curb-appeal;privacy-screening|evergreen structure|large conifer;soft blue-green needles|A large evergreen for spacious warm-zone landscapes.|amazon|Deodar cedar tree|South Asia|Cedrus deodara tree
hinoki-cypress|Hinoki cypress|ornamental tree|5a,8b|full;partial|loam|medium|curb-appeal;privacy-screening|evergreen structure|Japanese conifer;fan sprays|A refined evergreen for protected sites with even moisture.|amazon|Hinoki cypress tree|East Asia|Chamaecyparis obtusa hinoki cypress
nana-gracilis-hinoki|Nana Gracilis Hinoki cypress|ornamental shrub|5a,8b|full;partial|loam|medium|curb-appeal;privacy-screening|evergreen texture|dwarf conifer;fan-shaped foliage|A slow dwarf conifer for foundation beds and small-space structure.|amazon|Nana Gracilis Hinoki cypress|East Asia|Chamaecyparis obtusa Nana Gracilis
black-dragon-cryptomeria|Black Dragon cryptomeria|ornamental tree|6a,9a|full;partial|loam|medium|curb-appeal;privacy-screening|dark evergreen foliage|compact Japanese cedar;dark foliage|A compact cryptomeria for evergreen structure in mild to warm regions.|amazon|Black Dragon cryptomeria|East Asia|Cryptomeria japonica Black Dragon
japanese-plum-yew|Japanese plum yew|ornamental shrub|6a,9b|partial;full|loam;clay|medium|curb-appeal;privacy-screening|evergreen needles|shade-tolerant evergreen;yew-like foliage|A shade-tolerant evergreen shrub for screening and foundation beds.|amazon|Japanese plum yew shrub|East Asia|Cephalotaxus harringtonia Japanese plum yew
prostrate-plum-yew|Prostrate plum yew|ornamental shrub|6a,9b|partial;full|loam;clay|medium|curb-appeal|low evergreen spread|groundcover evergreen;shade tolerant|A low evergreen for shaded edges where turf struggles.|amazon|Prostrate plum yew|East Asia|Cephalotaxus harringtonia prostrata
sky-pencil-holly|Sky Pencil Japanese holly|ornamental shrub|6a,9a|full;partial|loam|medium|curb-appeal;privacy-screening|narrow evergreen columns|columnar evergreen;small footprint|A narrow evergreen for entries, containers, and tight screening spots.|amazon|Sky Pencil Japanese holly|East Asia|Ilex crenata Sky Pencil
compact-japanese-holly|Compact Japanese holly|ornamental shrub|6a,9a|full;partial|loam;clay|medium|curb-appeal;privacy-screening|evergreen foliage|boxwood-like shrub;shearable|A small evergreen alternative where boxwood problems are common.|amazon|Compact Japanese holly|East Asia|Ilex crenata compacta
camellia-japonica|Camellia japonica|ornamental shrub|7a,10a|partial|loam|medium|curb-appeal;privacy-screening|late winter to spring flowers|evergreen shrub;large flowers|A glossy evergreen shrub for acidic soil and protected partial shade.|amazon|Camellia japonica plant|East Asia|Camellia japonica shrub
camellia-sasanqua|Sasanqua camellia|ornamental shrub|7a,10a|partial;full|loam|medium|curb-appeal;privacy-screening;pollinators-wildlife|fall to winter flowers|evergreen shrub;fall bloom|A lighter-textured camellia with fall bloom and screening potential.|amazon|Sasanqua camellia plant|East Asia|Camellia sasanqua shrub
august-beauty-gardenia|August Beauty gardenia|ornamental shrub|7b,10b|partial;full|loam|medium|curb-appeal;privacy-screening|fragrant white flowers in warm seasons|fragrant evergreen;acid-loving shrub|Best in warm regions with acidic soil, mulch, and consistent moisture.|amazon|August Beauty gardenia|East Asia|Gardenia jasminoides August Beauty
kleims-hardy-gardenia|Kleim's Hardy gardenia|ornamental shrub|7a,10a|partial;full|loam|medium|curb-appeal|fragrant white flowers|compact gardenia;fragrant bloom|A compact gardenia for protected sites near paths and patios.|amazon|Kleims Hardy gardenia|East Asia|Gardenia jasminoides Kleim's Hardy
daphne-odora|Winter daphne|ornamental shrub|7a,9b|partial|loam|medium|curb-appeal|fragrant late winter flowers|fragrant evergreen;shade shrub|Use where drainage is good and winter fragrance can be appreciated up close.|amazon|Daphne odora plant|East Asia|Daphne odora shrub
pieris-japonica|Japanese pieris|ornamental shrub|5a,8b|partial|loam|medium|curb-appeal|spring flower chains and red new growth|acid-loving shrub;evergreen|A shade-edge evergreen for acidic soil and protected moisture.|amazon|Japanese pieris shrub|East Asia|Pieris japonica shrub
mountain-fire-pieris|Mountain Fire pieris|ornamental shrub|5a,8b|partial|loam|medium|curb-appeal|red new growth and spring flowers|red flush foliage;evergreen shrub|Best in acidic soil with afternoon shade and mulch.|amazon|Mountain Fire pieris|East Asia|Pieris japonica Mountain Fire
japanese-skimmia|Japanese skimmia|ornamental shrub|6a,8b|partial|loam|medium|curb-appeal|winter buds and spring flowers|shade evergreen;red berries on females|A compact evergreen for shade, especially in cooler moist climates.|amazon|Japanese skimmia shrub|East Asia|Skimmia japonica shrub
sweet-box|Sweet box sarcococca|ornamental shrub|6a,9a|partial|loam;clay|medium|curb-appeal;privacy-screening|fragrant winter flowers|shade evergreen;winter fragrance|A low evergreen shrub for dryish shade once established.|amazon|sweet box sarcococca|East Asia|Sarcococca confusa sweet box
japanese-aucuba|Japanese aucuba|ornamental shrub|7a,10a|partial|loam;clay|medium|curb-appeal;privacy-screening|evergreen spotted leaves|shade shrub;bold foliage|A tough evergreen for shade and large-leaf texture.|amazon|Japanese aucuba plant|East Asia|Aucuba japonica plant
fatsia-japonica|Fatsia japonica|ornamental shrub|8a,10b|partial|loam|medium|curb-appeal;privacy-screening|large evergreen leaves|bold foliage;shade tolerant|A large-leaf evergreen for warm shaded gardens and sheltered courtyards.|amazon|Fatsia japonica plant|East Asia|Fatsia japonica plant
kerria-japonica|Kerria japonica|ornamental shrub|4b,9a|partial;full|loam|medium|curb-appeal|yellow spring flowers|arching shrub;shade tolerant|A spring-flowering shrub for partial shade and informal borders.|amazon|Kerria japonica shrub|East Asia|Kerria japonica shrub
korean-spice-viburnum|Korean spice viburnum|ornamental shrub|4a,8b|full;partial|loam;clay|medium|curb-appeal;pollinators-wildlife|fragrant spring flowers|fragrant shrub;fall color|A beloved fragrant shrub for spring bloom near walks and doors.|amazon|Korean spice viburnum|East Asia|Viburnum carlesii Korean spice viburnum
doublefile-viburnum|Doublefile viburnum|ornamental shrub|5a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|layered white spring flowers|horizontal branching;bird fruit|A layered shrub with strong spring display and garden structure.|amazon|Doublefile viburnum|East Asia|Viburnum plicatum doublefile viburnum
david-viburnum|David viburnum|ornamental shrub|7a,9a|partial|loam|medium|curb-appeal|evergreen foliage and blue fruit|low evergreen shrub;blue berries|A low evergreen viburnum for mild climates and protected shade.|amazon|David viburnum|East Asia|Viburnum davidii shrub
japanese-snowball-viburnum|Japanese snowball viburnum|ornamental shrub|5a,8b|full;partial|loam|medium|curb-appeal|round white flower clusters|snowball flowers;large shrub|A showy spring shrub that needs room to arch naturally.|amazon|Japanese snowball viburnum|East Asia|Viburnum plicatum Japanese snowball
panicle-hydrangea|Panicle hydrangea|ornamental shrub|3a,8b|full;partial|loam;clay|medium|curb-appeal;privacy-screening|summer cone flowers|hardy hydrangea;sun tolerant|A durable hydrangea for sun to part sun and summer flower structure.|amazon|panicle hydrangea plant|East Asia|Hydrangea paniculata plant
blue-billow-hydrangea|Blue Billow hydrangea|ornamental shrub|5a,9a|partial|loam|medium|curb-appeal|lacecap flowers in summer|mountain hydrangea;fall color|A lacecap hydrangea for partial shade and acidic, mulched soil.|amazon|Blue Billow hydrangea|East Asia|Hydrangea serrata Blue Billow
climbing-hydrangea|Climbing hydrangea|ornamental shrub|4a,8b|partial;full|loam|medium|curb-appeal;privacy-screening|white lacecap flowers on mature vines|self-clinging vine;shade tolerant|A slow-starting woody vine for walls, fences, or sturdy tree trunks.|amazon|climbing hydrangea vine|East Asia|Hydrangea anomala petiolaris climbing hydrangea
white-chiffon-rose-of-sharon|White Chiffon rose of Sharon|ornamental shrub|5b,9b|full|loam;clay|medium|curb-appeal;privacy-screening;pollinators-wildlife|summer flowers|late bloom;upright shrub|A summer-flowering shrub for sunny screens and mixed borders.|amazon|White Chiffon rose of Sharon|East Asia|Hibiscus syriacus White Chiffon
red-prince-weigela|Red Prince weigela|ornamental shrub|4a,8b|full|loam|medium|curb-appeal;pollinators-wildlife|red spring flowers|hummingbird flowers;arching shrub|A spring-flowering shrub for sun and mixed ornamental borders.|amazon|Red Prince weigela|East Asia|Weigela florida Red Prince
nikko-deutzia|Nikko deutzia|ornamental shrub|5a,8b|full;partial|loam|medium|curb-appeal|white spring flowers|low mounding shrub;spring bloom|A low flowering shrub for slopes, edges, and small foundation beds.|amazon|Nikko deutzia|East Asia|Deutzia gracilis Nikko
red-bells-enkianthus|Red Bells enkianthus|ornamental shrub|5a,8a|partial;full|loam|medium|curb-appeal|bell flowers and red fall color|acid-loving shrub;fall color|Best in acidic soil with woodland-edge light and even moisture.|amazon|Red Bells enkianthus|East Asia|Enkianthus campanulatus Red Bells
beautybush|Beautybush|ornamental shrub|5a,8b|full;partial|loam|medium|curb-appeal;privacy-screening|pink spring flowers|arching shrub;spring bloom|A large arching shrub for informal screens and spring flower display.|amazon|Beautybush shrub|East Asia|Kolkwitzia amabilis beautybush
fragrant-tea-olive|Fragrant tea olive|ornamental shrub|7a,10b|full;partial|loam|medium|curb-appeal;privacy-screening|fragrant fall to spring flowers|evergreen fragrance;screening shrub|A warm-climate evergreen shrub prized for small but powerful flowers.|amazon|fragrant tea olive plant|East Asia|Osmanthus fragrans plant
japanese-painted-fern|Japanese painted fern|ornamental perennial|4a,8b|partial|loam|medium|curb-appeal|silver foliage through the growing season|shade fern;silver foliage|A low-maintenance foliage plant for moist shade and woodland edges.|amazon|Japanese painted fern|East Asia|Athyrium niponicum pictum
autumn-fern|Autumn fern|ornamental perennial|5a,9a|partial|loam|medium|curb-appeal|copper new fronds and evergreen texture|shade fern;copper growth|A dependable fern for shaded beds with leaf litter or mulch.|amazon|Autumn fern plant|East Asia|Dryopteris erythrosora autumn fern
holly-fern|Holly fern|ornamental perennial|6a,9b|partial|loam|medium|curb-appeal|evergreen glossy fronds|evergreen fern;shade texture|A glossy evergreen fern for warm shaded gardens.|amazon|holly fern plant|East Asia|Cyrtomium falcatum holly fern
tassel-fern|Tassel fern|ornamental perennial|5a,8b|partial|loam|medium|curb-appeal|arching evergreen fronds|evergreen fern;woodland texture|Best in protected shade with humus-rich soil and even moisture.|amazon|tassel fern plant|East Asia|Polystichum polyblepharum tassel fern
mondo-grass|Mondo grass|ornamental grass|6a,10a|partial;full|loam|medium|curb-appeal|evergreen strappy foliage|low edging plant;shade tolerant|A slow evergreen edging plant for paths, borders, and partial shade.|amazon|mondo grass plants|East Asia|Ophiopogon japonicus mondo grass
black-mondo-grass|Black mondo grass|ornamental grass|6a,10a|partial;full|loam|medium|curb-appeal|black-purple evergreen foliage|dark foliage;low edging plant|A dramatic low plant for edges and containers with good drainage.|amazon|black mondo grass plants|East Asia|Ophiopogon planiscapus Nigrescens
big-blue-liriope|Big Blue liriope|ornamental grass|5a,10a|full;partial|loam;clay|medium|curb-appeal|purple flower spikes and evergreen foliage|tough edging plant;summer bloom|A durable edging plant for sun to shade; keep it bounded where it spreads.|amazon|Big Blue liriope plants|East Asia|Liriope muscari Big Blue
variegated-liriope|Variegated liriope|ornamental grass|5a,10a|full;partial|loam;clay|medium|curb-appeal|striped foliage and purple flowers|variegated edging;shade tolerant|A bright edging plant for beds that need year-round texture.|amazon|variegated liriope plants|East Asia|Liriope muscari variegata
dwarf-mondo-grass|Dwarf mondo grass|ornamental grass|6a,10a|partial|loam|medium|curb-appeal|short evergreen mats|slow groundcover;tiny foliage|A very low edging plant for paths and small-scale shade designs.|amazon|dwarf mondo grass plants|East Asia|dwarf Ophiopogon japonicus
fargesia-rufa-bamboo|Fargesia rufa bamboo|ornamental grass|5a,9a|partial;full|loam|medium|curb-appeal;privacy-screening|clumping evergreen canes|clumping bamboo;non-running habit|A clumping bamboo for screening; confirm mature size before planting.|amazon|Fargesia rufa bamboo|East Asia|Fargesia rufa bamboo
fargesia-robusta-bamboo|Fargesia robusta bamboo|ornamental grass|7a,9b|partial;full|loam|medium|curb-appeal;privacy-screening|upright clumping canes|clumping bamboo;screening plant|A clumping bamboo for mild climates and narrow evergreen screens.|amazon|Fargesia robusta bamboo|East Asia|Fargesia robusta bamboo
bowl-of-beauty-peony|Bowl of Beauty peony|perennial flower|3a,8a|full|loam|medium|curb-appeal;pollinators-wildlife|late spring flowers|herbaceous peony;showy bloom|A long-lived peony for sunny beds with winter chill and good drainage.|amazon|Bowl of Beauty peony roots|East Asia|Paeonia lactiflora Bowl of Beauty
karl-rosenfield-peony|Karl Rosenfield peony|perennial flower|3a,8a|full|loam|medium|curb-appeal;pollinators-wildlife|red late spring flowers|herbaceous peony;cut flower|A classic red peony for cold-winter gardens and sunny borders.|amazon|Karl Rosenfield peony roots|East Asia|Paeonia lactiflora Karl Rosenfield
duchesse-de-nemours-peony|Duchesse de Nemours peony|perennial flower|3a,8a|full|loam|medium|curb-appeal;pollinators-wildlife|white late spring flowers|fragrant peony;cut flower|A fragrant white peony for long-lived spring flower beds.|amazon|Duchesse de Nemours peony roots|East Asia|Paeonia lactiflora Duchesse de Nemours
tree-peony|Tree peony|ornamental shrub|4a,8b|partial;full|loam|medium|curb-appeal|large spring flowers|woody peony;large blooms|A slow woody peony for protected sites and careful planting depth.|amazon|tree peony plant|East Asia|Paeonia suffruticosa tree peony
bartzella-itoh-peony|Bartzella Itoh peony|perennial flower|4a,8b|full|loam|medium|curb-appeal;pollinators-wildlife|yellow late spring flowers|intersectional peony;large bloom|A sturdy yellow peony hybrid with strong stems and long-lived crowns.|amazon|Bartzella Itoh peony|East Asia|Bartzella Itoh peony plant
variegated-japanese-iris|Variegated Japanese iris|perennial flower|4a,9a|full;partial|loam;clay|high|curb-appeal;pollinators-wildlife|summer iris flowers and striped foliage|moisture-loving iris;variegated leaves|A moisture-loving iris for pond edges, rain gardens, or rich beds.|amazon|variegated Japanese iris|East Asia|Iris ensata variegata
geisha-girl-japanese-iris|Geisha Girl Japanese iris|perennial flower|4a,9a|full;partial|loam;clay|high|curb-appeal;pollinators-wildlife|large summer flowers|Japanese iris;wet-soil tolerant|Best with moisture during growth and sun for strong flowering.|amazon|Geisha Girl Japanese iris|East Asia|Iris ensata Geisha Girl
toad-lily|Toad lily|perennial flower|5a,8b|partial|loam|medium|curb-appeal;pollinators-wildlife|speckled flowers in late summer to fall|shade perennial;late bloom|A late-season shade perennial with orchid-like spotted flowers.|amazon|toad lily plants|East Asia|Tricyrtis hirta toad lily
blue-wonder-toad-lily|Blue Wonder toad lily|perennial flower|5a,8b|partial|loam|medium|curb-appeal|speckled late-season flowers|shade bloom;fall interest|Use for late color in moist woodland beds and shaded borders.|amazon|Blue Wonder toad lily|East Asia|Tricyrtis Blue Wonder toad lily
honorine-jobert-anemone|Honorine Jobert Japanese anemone|perennial flower|5a,8b|partial;full|loam|medium|curb-appeal;pollinators-wildlife|white late-summer flowers|fall bloom;shade tolerant|A tall late-season perennial for partial shade and mixed borders.|amazon|Honorine Jobert anemone|East Asia|Anemone Honorine Jobert plant
september-charm-anemone|September Charm Japanese anemone|perennial flower|5a,8b|partial;full|loam|medium|curb-appeal;pollinators-wildlife|pink late-summer flowers|fall bloom;spreading perennial|Good for late flowers where it has room to slowly spread.|amazon|September Charm anemone|East Asia|Anemone September Charm plant
balloon-flower|Balloon flower|perennial flower|3a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|blue summer flowers|balloon buds;long-lived perennial|A neat perennial with balloon-like buds and blue star flowers.|amazon|balloon flower plants|East Asia|Platycodon grandiflorus plant
double-blue-balloon-flower|Double Blue balloon flower|perennial flower|3a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|double blue summer flowers|compact perennial;blue bloom|A compact balloon flower selection for front borders and containers.|amazon|Double Blue balloon flower|East Asia|Platycodon grandiflorus Double Blue
old-fashioned-bleeding-heart|Old-fashioned bleeding heart|perennial flower|3a,8a|partial|loam|medium|curb-appeal;pollinators-wildlife|spring heart-shaped flowers|shade perennial;spring bloom|A classic spring perennial for moist partial shade that may go dormant later.|amazon|bleeding heart plant|East Asia|Lamprocapnos spectabilis bleeding heart
yellow-wax-bells|Yellow wax bells|perennial flower|5a,8b|partial|loam|medium|curb-appeal|yellow late-summer bells|shade perennial;late bloom|A large woodland perennial for cool shade and late-season flowers.|amazon|yellow wax bells plant|East Asia|Kirengeshoma palmata plant
britt-marie-crawford-ligularia|Britt Marie Crawford ligularia|perennial flower|4a,8b|partial|loam;clay|high|curb-appeal;pollinators-wildlife|yellow summer flowers and dark leaves|moisture-loving perennial;dark foliage|Best for moist shade or rain-garden edges, not dry hot beds.|amazon|Britt Marie Crawford ligularia|East Asia|Ligularia Britt Marie Crawford
giant-leopard-plant|Giant leopard plant|ornamental perennial|7a,10a|partial|loam|medium|curb-appeal|bold evergreen leaves and yellow flowers|bold foliage;shade perennial|A large-leaf perennial for warm shaded gardens with steady moisture.|amazon|giant leopard plant Farfugium|East Asia|Farfugium japonicum giganteum
rodgersia|Rodgersia|ornamental perennial|5a,8b|partial|loam;clay|high|curb-appeal|large leaves and summer flower plumes|bold foliage;moisture-loving|A dramatic foliage perennial for moist shade and large woodland beds.|amazon|Rodgersia plant|East Asia|Rodgersia podophylla plant
crimson-fans-mukdenia|Crimson Fans mukdenia|ornamental perennial|4a,8b|partial|loam|medium|curb-appeal|white spring flowers and red-edged leaves|shade foliage;red fall tones|A low woodland perennial for foliage texture and seasonal color.|amazon|Crimson Fans mukdenia|East Asia|Mukdenia rossii Crimson Fans
sulphureum-barrenwort|Sulphureum barrenwort|ornamental perennial|5a,8b|partial|loam|low|curb-appeal|yellow spring flowers and groundcover foliage|dry-shade tolerant;spring flowers|A durable ground-layer plant for partial shade once established.|amazon|Epimedium sulphureum plant|East Asia|Epimedium x versicolor Sulphureum
pumila-astilbe|Pumila Chinese astilbe|perennial flower|4a,8b|partial|loam;clay|medium|curb-appeal;pollinators-wildlife|pink late-summer plumes|short astilbe;shade bloom|A lower astilbe for moist shade and late-summer color.|amazon|Pumila astilbe|East Asia|Astilbe chinensis Pumila
vision-in-red-astilbe|Vision in Red astilbe|perennial flower|4a,8b|partial|loam;clay|medium|curb-appeal;pollinators-wildlife|red summer plumes|compact astilbe;shade bloom|A compact red astilbe for moist shade and woodland borders.|amazon|Vision in Red astilbe|East Asia|Astilbe Vision in Red
frances-williams-hosta|Frances Williams hosta|ornamental perennial|3a,9a|partial|loam;clay|medium|curb-appeal|large variegated leaves|shade foliage;large hosta|A large hosta for shaded beds where foliage carries the display.|amazon|Frances Williams hosta|East Asia|Hosta Frances Williams
june-hosta|June hosta|ornamental perennial|3a,9a|partial|loam;clay|medium|curb-appeal|blue-green and gold foliage|compact hosta;variegated leaves|A compact hosta for shade containers, edges, and mixed foliage beds.|amazon|June hosta plant|East Asia|Hosta June
halcyon-hosta|Halcyon hosta|ornamental perennial|3a,9a|partial|loam;clay|medium|curb-appeal|blue foliage|blue hosta;shade foliage|A blue-leaf hosta that holds color best out of harsh sun.|amazon|Halcyon hosta|East Asia|Hosta Halcyon
empress-wu-hosta|Empress Wu hosta|ornamental perennial|3a,9a|partial|loam;clay|medium|curb-appeal|giant leaves|giant hosta;shade structure|A very large hosta for spacious shade gardens with consistent moisture.|amazon|Empress Wu hosta|East Asia|Hosta Empress Wu
tiger-lily|Tiger lily|perennial flower|3a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|orange summer flowers|spotted lily;bulb perennial|A bold summer lily for sunny borders with well-drained soil.|amazon|tiger lily bulbs|East Asia|Lilium lancifolium tiger lily
asiatic-lily|Asiatic lily|perennial flower|4a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|early summer flowers|bulb perennial;bright flowers|A reliable lily group for cut flowers and summer color.|amazon|Asiatic lily bulbs|East Asia|Asiatic lily plant
stargazer-lily|Stargazer lily|perennial flower|4a,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|fragrant summer flowers|oriental lily;cut flower|A fragrant lily for sunny beds with good drainage and winter chill.|amazon|Stargazer lily bulbs|East Asia|Stargazer lily plant
garden-mum|Garden mum|perennial flower|5a,9a|full|loam|medium|curb-appeal;pollinators-wildlife|fall flowers|fall bloom;pinch for fullness|A fall-flowering perennial often grown as seasonal color.|amazon|hardy garden mum plants|East Asia|Chrysanthemum morifolium garden mum
korean-mum|Korean mum|perennial flower|4a,8b|full|loam|medium|curb-appeal;pollinators-wildlife|fall flowers|hardy chrysanthemum;late bloom|A hardy mum type for late-season bloom and sunny borders.|amazon|Korean mum plants|East Asia|Korean chrysanthemum plant
japanese-primrose|Japanese primrose|perennial flower|4a,8b|partial|loam;clay|high|curb-appeal;pollinators-wildlife|spring flowers|moisture-loving primrose;shade bloom|A spring perennial for moist shade, stream edges, or rain gardens.|amazon|Japanese primrose plants|East Asia|Primula japonica plant
candelabra-primrose|Candelabra primrose|perennial flower|4a,8b|partial|loam;clay|high|curb-appeal;pollinators-wildlife|tiered spring flowers|moisture-loving primrose;woodland color|Best in consistently moist partial shade where summer heat is moderated.|amazon|candelabra primrose plants|East Asia|Primula bulleyana candelabra primrose
variegated-solomons-seal|Variegated Solomon's seal|ornamental perennial|3a,8b|partial|loam|medium|curb-appeal;pollinators-wildlife|arching spring stems and variegated leaves|shade perennial;arching habit|A graceful woodland plant for shade and layered spring foliage.|amazon|variegated Solomon's seal plant|East Asia|Polygonatum odoratum variegatum
japanese-spikenard|Japanese spikenard|ornamental perennial|4a,8b|partial|loam|medium|curb-appeal;pollinators-wildlife|large foliage and late flowers|bold shade perennial;berries|A large woodland perennial for shade structure and late-season interest.|amazon|Japanese spikenard plant|East Asia|Aralia cordata plant
sun-king-aralia|Sun King aralia|ornamental perennial|4a,8b|partial|loam|medium|curb-appeal;pollinators-wildlife|gold foliage through summer|gold shade foliage;large perennial|A bright foliage plant for partial shade and roomy mixed borders.|amazon|Sun King aralia plant|East Asia|Aralia cordata Sun King
bergenia|Bergenia|ornamental perennial|4a,8b|partial;full|loam;clay|medium|curb-appeal|spring flowers and evergreen leaves|thick leaves;spring bloom|A tough edging perennial with glossy leaves and early flowers.|amazon|Bergenia plants|Central Asia;East Asia|Bergenia plant
hardy-cyclamen|Hardy cyclamen|ornamental perennial|5a,9a|partial|loam|low|curb-appeal|fall or spring flowers and patterned leaves|dry-shade bulb;patterned foliage|A small woodland tuber for dry shade once established.|amazon|hardy cyclamen plants|Western Asia|Cyclamen hederifolium plant
blue-poppy|Himalayan blue poppy|perennial flower|6a,8a|partial|loam|high|curb-appeal|blue flowers in cool climates|cool-climate perennial;blue flowers|A specialty plant for cool, moist, acidic sites rather than hot gardens.|amazon|Himalayan blue poppy seeds|South Asia|Meconopsis blue poppy plant
cardiocrinum|Giant Himalayan lily|perennial flower|6a,8b|partial|loam|medium|curb-appeal|huge fragrant flowers after long establishment|giant lily;woodland bulb|A collector plant for cool woodland gardens with patience and space.|amazon|giant Himalayan lily bulbs|South Asia;East Asia|Cardiocrinum giganteum plant
cobra-lily-arisaema|Cobra lily arisaema|ornamental perennial|5a,8b|partial|loam|medium|curb-appeal|hooded spring flowers|woodland aroid;unusual bloom|A specialty shade perennial for humus-rich soil and protected beds.|amazon|Arisaema cobra lily plant|East Asia;South Asia|Arisaema plant
asiatic-jasmine|Asiatic jasmine|ornamental perennial|7a,10b|partial;full|loam|medium|curb-appeal|evergreen groundcover foliage|evergreen groundcover;warm-zone plant|A warm-zone groundcover for slopes and shaded edges; keep it contained.|amazon|Asiatic jasmine groundcover|East Asia|Trachelospermum asiaticum plant
japanese-sedge-ice-dance|Ice Dance Japanese sedge|ornamental grass|5a,9a|partial;full|loam;clay|medium|curb-appeal|variegated evergreen foliage|shade sedge;variegated leaves|A tidy sedge for shade, containers, and edging in moist soil.|amazon|Ice Dance Japanese sedge|East Asia|Carex morrowii Ice Dance
evergold-sedge|Evergold Japanese sedge|ornamental grass|5a,9a|partial|loam|medium|curb-appeal|gold-striped evergreen foliage|variegated sedge;shade texture|A small evergreen sedge for shaded paths and container edges.|amazon|Evergold Japanese sedge|East Asia|Carex oshimensis Evergold
giant-miscanthus|Giant miscanthus|ornamental grass|5a,9a|full|loam;clay|medium|privacy-screening;curb-appeal|tall plumes and winter stems|large grass;screening plant|Use only where large clumps are appropriate and local rules allow planting.|amazon|giant miscanthus plants|East Asia|Miscanthus x giganteus plant
porcupine-grass|Porcupine grass|ornamental grass|5a,9a|full|loam|medium|curb-appeal;privacy-screening|banded foliage and plumes|ornamental grass;striped leaves|A tall grass for sunny screens; check local spreading concerns before planting.|amazon|Porcupine grass plants|East Asia|Miscanthus sinensis Strictus
maiden-grass-gracillimus|Gracillimus maiden grass|ornamental grass|5a,9a|full|loam|medium|curb-appeal;privacy-screening|fine foliage and fall plumes|ornamental grass;fine texture|A classic fine-textured grass; confirm local guidance before planting.|amazon|Gracillimus maiden grass|East Asia|Miscanthus sinensis Gracillimus
paper-flower-edgeworthia|Paper flower edgeworthia|ornamental shrub|7a,10a|partial|loam|medium|curb-appeal|fragrant winter flowers|winter bloom;architectural shrub|A fragrant winter-flowering shrub for protected mild-climate sites.|amazon|Edgeworthia paper flower shrub|East Asia|Edgeworthia chrysantha plant
chinese-loropetalum|Chinese fringe flower|ornamental shrub|7a,10b|full;partial|loam|medium|curb-appeal;privacy-screening|pink fringe flowers and burgundy foliage|evergreen shrub;colored foliage|A warm-zone evergreen shrub for color, hedging, and spring flowers.|amazon|Chinese fringe flower loropetalum|East Asia|Loropetalum chinense plant
distylium|Distylium|ornamental shrub|7a,10a|full;partial|loam;clay|medium|curb-appeal;privacy-screening|evergreen foliage|low evergreen shrub;heat tolerant|A modern evergreen hedge plant for warm regions and foundation beds.|amazon|Distylium plant|East Asia|Distylium shrub
cast-iron-plant|Cast iron plant|ornamental perennial|7a,10b|partial|loam|low|curb-appeal|evergreen strappy leaves|deep shade plant;tough foliage|A nearly indestructible foliage plant for warm dry shade.|amazon|cast iron plant|East Asia|Aspidistra elatior plant
rice-paper-plant|Rice paper plant|ornamental shrub|8a,10b|partial;full|loam|medium|curb-appeal|giant palmate leaves|bold foliage;warm-zone shrub|A bold foliage shrub for sheltered warm gardens with room to spread.|amazon|rice paper plant Tetrapanax|East Asia|Tetrapanax papyrifer plant
toona-flamingo|Flamingo Chinese cedar|ornamental tree|6a,9a|full|loam|medium|curb-appeal|pink spring foliage|colored new growth;upright tree|A fast ornamental tree grown for colorful young foliage; confirm local suitability.|amazon|Toona sinensis Flamingo tree|East Asia|Toona sinensis Flamingo
chinese-dogwood-wolf-eyes|Wolf Eyes kousa dogwood|ornamental tree|5a,8b|partial;full|loam|medium|curb-appeal|variegated foliage and white bracts|variegated small tree;late bloom|A variegated kousa selection for partial shade and small gardens.|amazon|Wolf Eyes kousa dogwood|East Asia|Cornus kousa Wolf Eyes
little-volcano-lespedeza|Little Volcano bush clover|ornamental shrub|5a,8b|full|loam|medium|curb-appeal;pollinators-wildlife|pink late-summer flowers|late bloom;arching shrub|A late-season flowering shrub-like perennial for sunny borders.|amazon|Little Volcano lespedeza|East Asia|Lespedeza thunbergii Little Volcano
beautyberry-profusion|Profusion beautyberry|ornamental shrub|5b,8b|full;partial|loam|medium|curb-appeal;pollinators-wildlife|purple berries in fall|ornamental berries;arching shrub|A fruit-display shrub for fall color and wildlife interest.|amazon|Profusion beautyberry shrub|East Asia|Callicarpa bodinieri Profusion
chinese-abutilon|Chinese lantern abutilon|annual flower|8a,11a|full;partial|loam|medium|curb-appeal;pollinators-wildlife|pendant flowers in warm seasons|container shrub;hummingbird flowers|Grow as a warm-season container plant outside mild climates.|amazon|Chinese lantern abutilon plant|East Asia|Abutilon megapotamicum plant
hardy-banana-basjoo|Japanese fiber banana|ornamental perennial|6b,10a|full|loam|high|curb-appeal;privacy-screening|large tropical leaves in summer|hardy banana foliage;screening plant|A foliage plant for tropical effect; winter protection improves regrowth.|amazon|Musa basjoo banana plant|East Asia|Musa basjoo plant
lotus-berni|Hardy water lotus|ornamental perennial|7a,10b|full|clay;loam|high|curb-appeal;pollinators-wildlife|summer lotus flowers|water-garden perennial;showy bloom|A container-pond or water-garden plant with edible rhizome potential.|amazon|hardy lotus plant|East Asia;South Asia|Nelumbo nucifera flower
asian-pear-kikusui|Kikusui Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|crisp fruit in summer|Asian pear;round fruit|A crisp Asian pear that needs sun, thinning, and pollination planning.|starkbros|Kikusui Asian pear tree|East Asia|Pyrus pyrifolia Kikusui Asian pear
choisya-aztec-pearl|Aztec Pearl Mexican orange|ornamental shrub|7a,10a|full;partial|loam|low|curb-appeal;pollinators-wildlife|fragrant white spring flowers|evergreen shrub;fragrant bloom|A warm-zone evergreen for fragrance and rounded structure.|amazon|Aztec Pearl choisya|Western Asia|Choisya Aztec Pearl plant
persian-lilac|Persian lilac|ornamental shrub|4a,8a|full|loam|medium|curb-appeal;pollinators-wildlife|fragrant spring flowers|smaller lilac;fragrance|A smaller lilac type for sunny beds where spring fragrance matters.|amazon|Persian lilac shrub|Western Asia;Central Asia|Syringa x persica Persian lilac
afghan-pine|Afghan pine|ornamental tree|7a,10a|full|sandy;loam|low|curb-appeal;privacy-screening|evergreen needles|dry-climate pine;windbreak tree|A drought-tolerant pine for arid and warm inland climates.|amazon|Afghan pine tree|Central Asia;Western Asia|Pinus eldarica Afghan pine
chinese-ground-orchid|Chinese ground orchid|perennial flower|6a,9a|partial|loam|medium|curb-appeal|purple spring flowers|hardy orchid;shade perennial|A terrestrial orchid for protected shade and humus-rich soil.|amazon|Chinese ground orchid Bletilla|East Asia|Bletilla striata plant
japanese-roof-iris|Japanese roof iris|perennial flower|5a,9a|partial;full|loam|medium|curb-appeal|lavender spring flowers|crested iris;shade tolerant|A low iris for partial shade, edges, and woodland-style beds.|amazon|Japanese roof iris|East Asia|Iris tectorum plant
hardy-begonia|Hardy begonia|ornamental perennial|6a,9a|partial|loam|medium|curb-appeal|pink late-summer flowers and foliage|shade perennial;late bloom|A late-season shade plant that can self-sow gently in suitable sites.|amazon|hardy begonia plant|East Asia|Begonia grandis plant
false-spirea-sorbaria|False spirea sorbaria|ornamental shrub|2a,8a|full;partial|loam|medium|curb-appeal;privacy-screening|white summer plumes|suckering shrub;cold hardy|Use where a spreading colony is acceptable and containment is planned.|amazon|Sorbaria false spirea shrub|East Asia;North Asia|Sorbaria sorbifolia plant
chinese-wisteria-check|Chinese wisteria|ornamental vine|5a,9b|full|loam|medium|curb-appeal;privacy-screening|spring flower clusters|vigorous vine;check local restrictions|A beautiful but often problematic vine; verify local invasive rules before planting.|amazon|Chinese wisteria vine|East Asia|Wisteria sinensis plant
silk-tree-check|Silk tree mimosa|ornamental tree|6b,10a|full|loam;sandy|low|curb-appeal|pink summer flowers|fast-growing tree;check local restrictions|Often discouraged where it spreads; include only after checking local guidance.|amazon|silk tree mimosa|East Asia|Albizia julibrissin tree
chinese-holly|Chinese holly|ornamental shrub|6a,9b|full;partial|loam;clay|medium|curb-appeal;privacy-screening|evergreen leaves and red berries|broadleaf evergreen;wildlife fruit|A tough evergreen holly for hedges, berries, and structure.|amazon|Chinese holly shrub|East Asia|Ilex cornuta Chinese holly
needle-palm|Needle palm|ornamental shrub|6b,10a|partial;full|loam|medium|curb-appeal|evergreen palm foliage|cold-hardy palm;bold texture|A cold-hardy palm relative for protected warm gardens and bold texture.|amazon|needle palm plant|East Asia|Rhapidophyllum hystrix plant
windmill-palm|Windmill palm|ornamental tree|7a,10b|full;partial|loam|medium|curb-appeal|evergreen palm trunk and fronds|cold-hardy palm;tropical look|A hardy palm for mild climates and sheltered warm exposures.|amazon|windmill palm tree|East Asia|Trachycarpus fortunei windmill palm
chinese-fan-palm|Chinese fan palm|ornamental tree|9a,11a|full|loam;sandy|medium|curb-appeal|fan-shaped evergreen fronds|palm tree;warm-climate specimen|A warm-climate palm for large containers or frost-free landscapes.|amazon|Chinese fan palm|East Asia|Livistona chinensis Chinese fan palm
silvergrass-adagio|Adagio maiden grass|ornamental grass|5a,9a|full|loam|medium|curb-appeal|compact plumes and fine foliage|compact ornamental grass;fall plumes|A smaller maiden grass; confirm local guidance before planting.|amazon|Adagio maiden grass|East Asia|Miscanthus sinensis Adagio
red-dragon-persicaria|Red Dragon persicaria|ornamental perennial|5a,8b|partial;full|loam|medium|curb-appeal|burgundy foliage|colored foliage;spreading perennial|Use where its spreading habit can be managed in mixed borders.|amazon|Red Dragon persicaria plant|East Asia|Persicaria microcephala Red Dragon
chinese-foxglove|Chinese foxglove|perennial flower|7a,10a|partial;full|loam|medium|curb-appeal;pollinators-wildlife|pink tubular flowers in warm seasons|long bloom;spreading perennial|A warm-climate perennial for long bloom in sun to part shade.|amazon|Chinese foxglove plant|East Asia|Rehmannia elata plant
orange-daylily-asian|Orange daylily|perennial flower|3a,9a|full;partial|loam;clay|low|curb-appeal|orange summer flowers|tough perennial;edible buds|Very tough and spreading; use where its colony-forming habit is welcome.|amazon|orange daylily plants|East Asia|Hemerocallis fulva plant
golden-japanese-forest-grass|Aureola Japanese forest grass|ornamental grass|5a,8b|partial|loam|medium|curb-appeal|gold variegated foliage|shade grass;arching habit|A slow ornamental grass for shaded edges and refined texture.|amazon|Aureola Japanese forest grass|East Asia|Hakonechloa macra Aureola
all-gold-japanese-forest-grass|All Gold Japanese forest grass|ornamental grass|5a,8b|partial|loam|medium|curb-appeal|bright gold foliage|shade grass;gold leaves|A bright foliage grass for protected shade and moist soil.|amazon|All Gold Japanese forest grass|East Asia|Hakonechloa macra All Gold
chinese-lantern-plant|Chinese lantern plant|perennial flower|3a,9a|full;partial|loam|medium|curb-appeal|orange papery husks in fall|spreading perennial;fall pods|Attractive but spreading; best in contained beds or large planters.|amazon|Chinese lantern plant seeds|East Asia|Physalis alkekengi plant
asian-bleeding-heart-gold-heart|Gold Heart bleeding heart|perennial flower|3a,8a|partial|loam|medium|curb-appeal|pink spring flowers and gold foliage|shade perennial;gold foliage|A bright foliage form of old-fashioned bleeding heart for spring shade.|amazon|Gold Heart bleeding heart plant|East Asia|Lamprocapnos spectabilis Gold Heart
white-bleeding-heart|White bleeding heart|perennial flower|3a,8a|partial|loam|medium|curb-appeal|white spring heart flowers|shade perennial;spring bloom|A white form of old-fashioned bleeding heart for cool shaded beds.|amazon|white bleeding heart plant|East Asia|Lamprocapnos spectabilis Alba
chinese-meadow-rue|Chinese meadow rue|perennial flower|5a,8b|partial|loam|medium|curb-appeal;pollinators-wildlife|airy lavender flowers in summer|tall airy perennial;shade tolerant|A delicate-looking tall perennial for moist partial shade.|amazon|Chinese meadow rue plant|East Asia|Thalictrum delavayi plant
kirengeshoma-korean|Korean wax bells|perennial flower|5a,8b|partial|loam|medium|curb-appeal|yellow bells in late summer|shade perennial;late bloom|A woodland perennial for late-season flowers in cool shaded beds.|amazon|Korean wax bells plant|East Asia|Kirengeshoma koreana plant
chinese-rhubarb|Chinese rhubarb|perennial vegetable|6a,9a|full;partial|loam|medium|curb-appeal|large ornamental leaves|bold foliage;medicinal rhubarb|Use as an ornamental foliage plant; do not treat it like culinary rhubarb without verification.|amazon|Chinese rhubarb plant|East Asia|Rheum palmatum plant
asian-fennel-flower|Love-in-a-mist Persian jewel|annual flower|4a,10b|full|loam|low|curb-appeal;pollinators-wildlife|blue flowers and seed pods|cool-season annual;seed pods|A cool-season annual for delicate flowers and decorative pods.|amazon|Persian jewel nigella seeds|Western Asia|Nigella damascena flower
persian-buttercup|Persian buttercup ranunculus|perennial flower|7a,10a|full|loam|medium|curb-appeal|spring flowers|cut flower corm;cool-season bloom|A cool-season corm for spring flowers in mild-winter gardens.|amazon|Persian buttercup ranunculus bulbs|Western Asia|Ranunculus asiaticus plant
damask-rose|Damask rose|ornamental shrub|5a,9a|full|loam|medium|curb-appeal;pollinators-wildlife|fragrant spring flowers|fragrant old rose;processing petals|An old garden rose valued for fragrance and petals, with normal rose disease care.|amazon|Damask rose plant|Western Asia|Rosa damascena plant
apricot-chinese-mormon|Chinese Mormon apricot|fruit tree|4b,8b|full|loam;sandy|medium|fruit;curb-appeal|apricots in summer|cold-hardy apricot;early bloom|A hardy apricot choice, but spring frost still controls success.|starkbros|Chinese Mormon apricot tree|East Asia;Central Asia|Chinese Mormon apricot tree
moongold-apricot|Moongold apricot|fruit tree|4a,8a|full|loam;sandy|medium|fruit;curb-appeal|apricots in midsummer|cold-hardy apricot;needs pollinator|A cold-climate apricot selection that usually needs a partner nearby.|starkbros|Moongold apricot tree|Central Asia;East Asia|Moongold apricot tree
sungold-apricot|Sungold apricot|fruit tree|4a,8a|full|loam;sandy|medium|fruit;curb-appeal|apricots in midsummer|cold-hardy apricot;pollination partner|Often paired with Moongold for colder apricot plantings.|starkbros|Sungold apricot tree|Central Asia;East Asia|Sungold apricot tree
manchurian-apricot|Manchurian apricot|fruit tree|3b,7b|full|loam;sandy|medium|fruit;curb-appeal|early flowers and small fruit|very cold hardy;early bloom|Cold-hardy but frost-prone because flowers open early.|amazon|Manchurian apricot tree|East Asia|Prunus mandshurica apricot tree
japanese-raisintree|Japanese raisin tree|fruit tree|6a,9b|full|loam|medium|fruit;curb-appeal|sweet edible peduncles in fall|unusual fruit tree;shade tree|An unusual edible tree for warm temperate gardens with room.|amazon|Japanese raisin tree|East Asia|Hovenia dulcis tree
shipova-asian-pear-hybrid|Shipova|fruit tree|5a,8b|full|loam|medium|fruit;curb-appeal|small pear-like fruit in fall|rare pome fruit;slow to bear|A long-horizon specialty fruit tree for collectors and patient growers.|raintree|Shipova tree|Western Asia|Shipova fruit tree
jujube-globe|Globe jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit|round fruit in fall|round jujube;dryland fruit|A low-water jujube selection for hot sunny gardens.|raintree|Globe jujube tree|East Asia|Ziziphus jujuba Globe
jujube-sihong|Sihong jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit|large fruit in fall|large jujube;fresh or dried|A large-fruited jujube option for fresh eating or drying.|raintree|Sihong jujube tree|East Asia|Ziziphus jujuba Sihong
jujube-sherwood|Sherwood jujube|fruit tree|5b,10a|full|loam;sandy;clay|low|fruit;curb-appeal|elongated fruit in fall|upright jujube;narrow habit|A more upright jujube for sunny spots with limited width.|raintree|Sherwood jujube tree|East Asia|Ziziphus jujuba Sherwood
mulberry-worlds-best|World's Best mulberry|fruit tree|8a,10b|full|loam;sandy|medium|fruit;privacy-screening|berries in warm seasons|small fruit tree;container candidate|A warm-climate mulberry often grown in containers or small yards.|amazon|World's Best mulberry tree|South Asia;Southeast Asia|World's Best mulberry tree
cheong-su-asian-pear|Cheong Su Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|crisp pear fruit in late summer|Asian pear;Korean selection|A Korean pear selection for full sun and compatible pollination.|raintree|Cheong Su Asian pear tree|East Asia|Cheong Su Asian pear
atago-asian-pear|Atago Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|large crisp fruit in fall|Asian pear;large fruit|A late Asian pear option where long seasons allow fruit to size well.|raintree|Atago Asian pear tree|East Asia|Atago Asian pear
yakumo-asian-pear|Yakumo Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|early crisp fruit|Asian pear;early season|An early Asian pear for gardeners building a longer pear harvest window.|raintree|Yakumo Asian pear tree|East Asia|Yakumo Asian pear
seuri-asian-pear|Seuri Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|small crisp fruit in fall|Asian pear;pollination value|Often used as a pollination partner in Asian pear plantings.|raintree|Seuri Asian pear tree|East Asia|Seuri Asian pear
shinseiki-plus-asian-pear|New Century Asian pear|fruit tree|5a,9a|full|loam;clay|medium|fruit|yellow crisp fruit in summer|Asian pear;early fruit|A crisp yellow Asian pear selection for full-sun orchards.|starkbros|New Century Asian pear tree|East Asia|Pyrus pyrifolia New Century
`
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const fallbackPhotoIdsByType = [
  [/citrus/, "yuzu-citrus"],
  [/fruit tree/, "20th-century-asian-pear"],
  [/fruit shrub/, "sweet-scarlet-goumi"],
  [/nut tree/, "chinese-chestnut"],
  [/annual fruit vine/, "kabocha-squash"],
  [/annual vegetable/, "mizuna"],
  [/annual herb|perennial herb/, "thai-basil"],
  [/ornamental tree/, "bloodgood-japanese-maple"],
  [/ornamental shrub/, "osmanthus-fortunei"],
  [/ornamental grass/, "japanese-forest-grass"],
  [/ornamental perennial|perennial flower/, "hosta-guacamole"]
];

const fallbackPhotoIdsByIdentity = [
  [/bok|pak|choi|cabbage|bekana|kailaan|gai[-\s]?lan/, ["shanghai-green-bok-choy", "joi-choi-bok-choy", "napa-cabbage"]],
  [/chijimisai|yukina|tatsoi|komatsuna/, ["tatsoi", "komatsuna", "mizuna"]],
  [/mustard|hon-tsai|wasabina/, ["red-giant-mustard", "mizuna"]],
  [/turnip|shogoin|tokyo-cross/, ["hakurei-turnip"]],
  [/daikon|radish|mu-radish/, ["daikon-radish", "cherry-belle-radish"]],
  [/carrot|kintoki|kuroda/, ["danvers-carrot"]],
  [/onion|bunching|chive|rakkyo/, ["garlic-chives", "candy-onion"]],
  [/celery/, ["chinese-celery", "italian-parsley"]],
  [/shiso|perilla/, ["green-shiso", "shiso"]],
  [/melon|hami/, ["korean-melon", "ambrosia-cantaloupe"]],
  [/cucumber/, ["marketmore-cucumber", "suyo-long-cucumber"]],
  [/eggplant/, ["black-beauty-eggplant", "ping-tung-eggplant"]],
  [/yardlong|noodle/, ["yardlong-bean"]],
  [/water[-\s]?chestnut|lotus/, ["lotus-root"]],
  [/jujube/, ["li-jujube", "lang-jujube"]],
  [/persimmon/, ["fuyu-persimmon", "hachiya-persimmon"]],
  [/asian[-\s]?pear|pear/, ["20th-century-asian-pear", "shinko-asian-pear"]],
  [/plum|ume|apricot/, ["shiro-plum", "methley-plum", "blenheim-apricot"]],
  [/quince/, ["flowering-quince", "pineapple-quince"]],
  [/mandarin|kumquat|orange|lemon|kabosu|sudachi|dekopon|citrus/, ["yuzu-citrus", "owari-satsuma"]],
  [/pistachio|nut|pine/, ["chinese-chestnut", "all-in-one-almond"]],
  [/maple/, ["bloodgood-japanese-maple"]],
  [/holly/, ["american-holly", "blue-princess-holly"]],
  [/gardenia|camellia|pieris|skimmia|aucuba|fatsia|daphne|sarcococca|sweet-box/, ["osmanthus-fortunei", "beautyberry"]],
  [/hydrangea/, ["panicle-hydrangea", "hydrangea-limelight", "oakleaf-hydrangea"]],
  [/peony/, ["peony-sarah-bernhardt", "peony-festiva-maxima"]],
  [/iris/, ["siberian-iris-caesars-brother", "iris-virginica"]],
  [/hosta|mukdenia|ligularia|leopard|rodgersia|wax-bells|toad-lily|anemone|balloon|bleeding-heart/, ["hosta-guacamole", "hosta-blue-angel"]],
  [/grass|sedge|liriope|mondo|fargesia|bamboo/, ["japanese-forest-grass", "miscanthus-morning-light"]],
  [/fern/, ["autumn-fern", "japanese-painted-fern"]]
];

function splitList(value) {
  return value.split(";").map((item) => item.trim()).filter(Boolean);
}

function parseCandidate(line) {
  const [
    id,
    name,
    type,
    zones,
    sun,
    soils,
    water,
    goals,
    harvest,
    traits,
    notes,
    partner,
    query,
    originRegions,
    photoQuery
  ] = line.split("|").map((value) => value.trim());

  if (!photoQuery) {
    throw new Error(`Malformed candidate line for ${id}`);
  }

  return {
    plant: {
      id,
      name,
      type,
      zones: zones.split(",").map((value) => value.trim()),
      sun: splitList(sun),
      soils: splitList(soils),
      water,
      goals: splitList(goals),
      harvest,
      traits: splitList(traits),
      notes,
      partner,
      query,
      originRegions: splitList(originRegions),
      originBatch: batchId
    },
    photoQuery
  };
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function photoAlt(plant) {
  if (plant.type.includes("tree")) return `${plant.name} tree showing foliage and plant structure.`;
  if (plant.type.includes("shrub")) return `${plant.name} shrub showing foliage and plant structure.`;
  if (plant.type.includes("vine")) return `${plant.name} vine showing foliage and plant structure.`;
  return `${plant.name} plant showing foliage and plant structure.`;
}

function commonsApiUrl(search) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: search,
    gsrnamespace: "6",
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    format: "json",
    origin: "*"
  });
  return `https://commons.wikimedia.org/w/api.php?${params}`;
}

function isUsableImage(page) {
  const info = page.imageinfo?.[0];
  if (!info?.url || !info.mime?.startsWith("image/")) return false;
  if (/svg|gif|tiff/i.test(info.mime)) return false;
  if ((info.width ?? 0) < 600 || (info.height ?? 0) < 500) return false;
  if (/herbarium|specimen|distribution|range map|drawing|diagram|plate|illustration|seeds only/i.test(page.title)) return false;
  return true;
}

async function fetchCommonsPhoto(plant, photoQuery) {
  const searches = [
    `${photoQuery} plant`,
    `${photoQuery} leaves flowers fruit`,
    `${plant.name} plant`
  ];

  for (const search of searches) {
    const response = await fetch(commonsApiUrl(search), { headers: { "User-Agent": userAgent } });
    if (!response.ok) continue;
    const data = await response.json();
    const pages = Object.values(data.query?.pages ?? {}).filter(isUsableImage);
    if (!pages.length) continue;
    pages.sort((a, b) => {
      const ai = a.imageinfo[0];
      const bi = b.imageinfo[0];
      return (bi.width * bi.height) - (ai.width * ai.height);
    });
    for (const page of pages) {
      const info = page.imageinfo[0];
      try {
        const imageResponse = await fetch(info.url, { headers: { "User-Agent": userAgent } });
        if (!imageResponse.ok) continue;
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        const dir = path.join(publicDir, "plant-photos", plant.id);
        const output = path.join(dir, "primary.jpg");
        await mkdir(dir, { recursive: true });
        await sharp(buffer, { failOn: "none" })
          .rotate()
          .resize({ width: 1600, height: 1400, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 84, progressive: true })
          .toFile(output);

        const bytes = (await stat(output)).size;
        const meta = info.extmetadata ?? {};
        return {
          id: plant.id,
          primary: {
            src: `/plant-photos/${plant.id}/primary.jpg`,
            label: "Plant photo",
            alt: photoAlt(plant),
            caption: `${plant.name} shown as a representative living plant reference.`,
            credit: stripHtml(meta.Artist?.value || meta.Credit?.value || meta.ObjectName?.value || "Wikimedia Commons contributor"),
            license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Wikimedia Commons"),
            sourceUrl: info.descriptionurl,
            bytes
          },
          details: [],
          note: "Photos show a representative plant in the garden. Cultivar appearance, fruit color, bloom timing, and growth habit can vary by site and season."
        };
      } catch {
        continue;
      }
    }
  }
  return null;
}

function fallbackPhotoEntry(plant, photosById) {
  const identity = `${plant.id} ${plant.name} ${plant.type} ${plant.query}`.toLowerCase();
  const identityFallbackIds = fallbackPhotoIdsByIdentity.find(([pattern]) => pattern.test(identity))?.[1] ?? [];
  const typeFallbackId = fallbackPhotoIdsByType.find(([pattern]) => pattern.test(plant.type))?.[1] ?? "mizuna";
  const fallbackId = [...identityFallbackIds, typeFallbackId, "mizuna"].find((id) => {
    const entry = photosById.get(id);
    return id !== plant.id && entry?.primary?.src && !entry.note?.includes("temporary reference");
  });
  const source = photosById.get(fallbackId);
  if (!source?.primary?.src) {
    throw new Error(`Missing fallback photo metadata for ${plant.id}: ${fallbackId}`);
  }
  return {
    id: plant.id,
    primary: {
      ...source.primary,
      alt: photoAlt(plant),
      caption: `${plant.name} uses a representative plant reference while a closer photo is being sourced.`
    },
    details: [],
    note: "This is a representative garden photo used as a temporary reference. Replace with a closer cultivar or species image when one is sourced."
  };
}

function sortById(list) {
  return list.sort((a, b) => a.id.localeCompare(b.id));
}

const candidates = candidateData.map(parseCandidate);
const plants = JSON.parse(await readFile(plantsPath, "utf8"));
const photos = JSON.parse(await readFile(photosPath, "utf8"));
const existingIds = new Set(plants.map((plant) => plant.id));
const candidateExistingIds = new Set(candidates.filter(({ plant }) => existingIds.has(plant.id)).map(({ plant }) => plant.id));
const existingBatchCount = plants.filter((plant) => plant.originBatch === batchId).length;
const remainingSlots = Math.max(0, targetNewPlantCount - existingBatchCount);
const newCandidates = candidates.filter(({ plant }) => !existingIds.has(plant.id)).slice(0, remainingSlots);

if (existingBatchCount + newCandidates.length < targetNewPlantCount) {
  throw new Error(`Only ${existingBatchCount + newCandidates.length} batch candidates available; expected ${targetNewPlantCount}.`);
}

plants.push(...newCandidates.map(({ plant }) => plant));
await writeFile(plantsPath, `${JSON.stringify(plants, null, 2)}\n`, "utf8");
console.log(`Added ${newCandidates.length} plants for ${batchId}. Batch count is now ${existingBatchCount + newCandidates.length}. Skipped ${candidateExistingIds.size} existing candidate ids.`);

const updatedPlants = JSON.parse(await readFile(plantsPath, "utf8"));
const batchPlants = updatedPlants.filter((plant) => plant.originBatch === batchId);
const photoById = new Map(photos.map((entry) => [entry.id, entry]));
const candidateById = new Map(candidates.map((candidate) => [candidate.plant.id, candidate]));
const updatedPhotos = photos.filter((entry) => !batchPlants.some((plant) => plant.id === entry.id));
const existingPhotoById = new Map(photos.map((entry) => [entry.id, entry]));

let downloaded = 0;
let reused = 0;
for (const plant of batchPlants) {
  const existingEntry = photoById.get(plant.id);
  if (existingEntry && !existingEntry.note?.includes("temporary reference")) {
    updatedPhotos.push(existingEntry);
    continue;
  }
  const candidate = candidateById.get(plant.id);
  let entry = null;
  try {
    entry = await fetchCommonsPhoto(plant, candidate?.photoQuery ?? plant.query);
  } catch (error) {
    console.warn(`Photo fetch failed for ${plant.id}: ${error.message}`);
  }
  if (entry) {
    downloaded += 1;
  } else {
    entry = fallbackPhotoEntry(plant, existingPhotoById);
    reused += 1;
  }
  updatedPhotos.push(entry);
  console.log(`${entry.primary.src.startsWith(`/plant-photos/${plant.id}/`) ? "downloaded" : "fallback"} ${plant.id}`);
}

await writeFile(photosPath, `${JSON.stringify(sortById(updatedPhotos), null, 2)}\n`, "utf8");
console.log(`Photo metadata ready for ${batchPlants.length} batch plants. Downloaded ${downloaded}, fallback ${reused}.`);
