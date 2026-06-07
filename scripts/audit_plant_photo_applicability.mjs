import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const [plants, photoEntries] = await Promise.all([
  readJson("plants.json"),
  readJson("plantPhotos.json")
]);

function readJson(file) {
  return readFile(path.join(root, "src", "data", file), "utf8").then((contents) => JSON.parse(contents));
}

const plantById = new Map(plants.map((plant) => [plant.id, plant]));

const collisionRules = [
  {
    label: "plant assigned nursery catalog scan",
    plant: /./i,
    photo: /Henry G\. Gilbert|Nursery and Seed Trade Catalog|Currie's bulbs|Our new guide to rose culture|Planting guide/i
  },
  {
    label: "watermelon assigned citrus",
    plant: /watermelon/i,
    photo: /eureka-lemon|citrus|lemon branch|lime branch|citrus branch/i
  },
  {
    label: "hydrangea assigned citrus",
    plant: /hydrangea/i,
    photo: /eureka-lemon|citrus|lemon branch|lime branch|citrus branch/i
  },
  {
    label: "zinnia assigned citrus",
    plant: /zinnia/i,
    photo: /eureka-lemon|citrus|lemon branch|lime branch|citrus branch/i
  },
  {
    label: "goldenrod assigned citrus",
    plant: /goldenrod/i,
    photo: /eureka-lemon|citrus|lemon branch|lime branch|citrus branch/i
  },
  {
    label: "mayapple assigned apple tree",
    plant: /mayapple/i,
    photo: /anna-apple|apple branch|malus|jablan/i
  },
  {
    label: "agastache assigned stone fruit",
    plant: /agastache|anise hyssop|korean mint/i,
    photo: /apricot branch|peach branch|prunus|stone fruit|lavender plant|lavand/i
  },
  {
    label: "pawpaw assigned sunflower",
    plant: /pawpaw/i,
    photo: /helianthus|sunflower plants|sunflower bloom|helianthus-lemon-queen/i
  },
  {
    label: "tomato assigned pear tree",
    plant: /tomato/i,
    photo: /bartlett-pear|pear fruit|pear branch|pyrus/i
  },
  {
    label: "rudbeckia assigned cherry tree",
    plant: /rudbeckia|black-eyed susan/i,
    photo: /balaton-cherry|cherry branch|sweet cherry|tart cherry|prunus avium|prunus cerasus/i
  },
  {
    label: "cherry laurel assigned edible cherry",
    plant: /cherry laurel|cherry-laurel/i,
    photo: /balaton-cherry|sweet cherry|tart cherry|prunus avium|prunus cerasus/i
  },
  {
    label: "bee balm assigned raspberry cane",
    plant: /bee balm|bee-balm|monarda/i,
    photo: /fall-gold-raspberry|raspberry cane|rubus/i
  },
  {
    label: "gardenia assigned olive",
    plant: /gardenia/i,
    photo: /arbequina-olive|olive branch|olea europaea/i
  },
  {
    label: "osmanthus assigned olive",
    plant: /osmanthus|tea olive/i,
    photo: /arbequina-olive|olive branch|olea europaea/i
  },
  {
    label: "toad lily assigned hosta",
    plant: /toad lily|toad-lily|tricyrtis/i,
    photo: /hosta-blue-angel|hosta plant|hosta foliage/i
  },
  {
    label: "mukdenia assigned hosta",
    plant: /mukdenia/i,
    photo: /hosta-blue-angel|hosta plant|hosta foliage/i
  },
  {
    label: "iris assigned lavender or hyssop",
    plant: /iris/i,
    photo: /hyssop-anise|lavender plant|lavand|agastache/i
  },
  {
    label: "eryngium assigned aster",
    plant: /eryngium|rattlesnake master/i,
    photo: /aromatic-aster|aster plant|symphyotrichum/i
  },
  {
    label: "lavender assigned aster or hyssop",
    plant: /lavender|lavandin/i,
    photo: /aromatic-aster|aster plant|symphyotrichum|hyssop-anise|agastache/i
  },
  {
    label: "hawthorn assigned pear tree",
    plant: /hawthorn/i,
    photo: /asian-pear|pear fruit|pear branch|pyrus/i
  },
  {
    label: "inkberry assigned boxwood",
    plant: /inkberry/i,
    photo: /boxwood|buxus/i
  },
  {
    label: "corn salad assigned maize",
    plant: /corn salad|corn-salad|mache/i,
    photo: /glass-gem-corn|corn plants|maize|zea mays/i
  }
];

const failures = [];

for (const entry of photoEntries) {
  const plant = plantById.get(entry.id);
  if (!plant) continue;

  const plantText = [
    entry.id,
    plant.name,
    plant.type,
    plant.query,
    ...(plant.traits ?? [])
  ].join(" ");

  const photoText = [
    entry.primary?.src,
    entry.primary?.alt,
    entry.primary?.caption,
    entry.primary?.credit,
    entry.primary?.sourceUrl,
    entry.note
  ].join(" ");

  for (const rule of collisionRules) {
    if (rule.plant.test(plantText) && rule.photo.test(photoText)) {
      failures.push({
        id: entry.id,
        name: plant.name,
        source: entry.primary?.src,
        caption: entry.primary?.caption,
        rule: rule.label
      });
    }
  }
}

if (failures.length) {
  console.table(failures);
  throw new Error(`Photo applicability audit found ${failures.length} likely mismatched plant photo assignments.`);
}

console.log(`Photo applicability audit passed for ${photoEntries.length} photo records.`);
