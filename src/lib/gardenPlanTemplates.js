import { isSourcedValue, plantUrl } from "./plantUtils.js";

export const GARDEN_PLAN_TEMPLATES = [
  {
    slug: "zone-7-4x8-vegetable-garden",
    path: "/garden-plans/zone-7-4x8-vegetable-garden/",
    shortTitle: "Zone 7 4x8 vegetable bed",
    title: "Zone 7 4x8 Vegetable Garden Plan",
    eyebrow: "Raised bed template",
    description: "A practical 4x8 raised-bed vegetable garden template for Zone 7, with warm-season anchors, herbs, and quick greens.",
    summary: "Use this as a starter layout for one full-sun 4x8 bed. It is intentionally compact, with tomatoes and cucumbers treated as supported crops.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "black-krim-tomato", quantity: 1, role: "Main summer crop" },
      { id: "banana-pepper", quantity: 2, role: "Long-season producer" },
      { id: "marketmore-cucumber", quantity: 1, role: "Trellis crop" },
      { id: "genovese-basil", quantity: 3, role: "Herb layer" },
      { id: "bloomsdale-spinach", quantity: 4, role: "Cool-season shoulder crop" }
    ],
    layout: {
      "black-krim-tomato__1": { x: 22, y: 50 },
      "banana-pepper__1": { x: 44, y: 35 },
      "banana-pepper__2": { x: 44, y: 67 },
      "marketmore-cucumber__1": { x: 76, y: 50 },
      "genovese-basil__1": { x: 25, y: 22 },
      "genovese-basil__2": { x: 25, y: 78 },
      "genovese-basil__3": { x: 54, y: 78 },
      "bloomsdale-spinach__1": { x: 58, y: 22 },
      "bloomsdale-spinach__2": { x: 65, y: 22 },
      "bloomsdale-spinach__3": { x: 58, y: 38 },
      "bloomsdale-spinach__4": { x: 65, y: 38 }
    },
    productIds: ["soil-test-lab-mailer", "finished-compost", "drip-irrigation-kit", "tomato-cage-stakes", "insect-netting"]
  },
  {
    slug: "salsa-garden-raised-bed",
    path: "/garden-plans/salsa-garden-raised-bed/",
    shortTitle: "Salsa garden",
    title: "Salsa Garden Raised Bed Plan",
    eyebrow: "Kitchen garden template",
    description: "A full-sun salsa garden plan with tomato, pepper, cilantro, onion, and basil in one raised-bed workflow.",
    summary: "This template puts the tall summer crops where they can be supported, then uses smaller herbs and onions around them.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "roma-tomato", quantity: 1, role: "Sauce tomato" },
      { id: "jalapeno-pepper", quantity: 2, role: "Heat" },
      { id: "cilantro", quantity: 4, role: "Fresh herb succession" },
      { id: "candy-onion", quantity: 10, role: "Bulb crop" },
      { id: "genovese-basil", quantity: 2, role: "Flexible herb" }
    ],
    layout: {
      "roma-tomato__1": { x: 22, y: 50 },
      "jalapeno-pepper__1": { x: 45, y: 35 },
      "jalapeno-pepper__2": { x: 45, y: 68 },
      "cilantro__1": { x: 68, y: 28 },
      "cilantro__2": { x: 76, y: 28 },
      "cilantro__3": { x: 68, y: 45 },
      "cilantro__4": { x: 76, y: 45 },
      "candy-onion__1": { x: 62, y: 70 },
      "candy-onion__2": { x: 67, y: 70 },
      "candy-onion__3": { x: 72, y: 70 },
      "candy-onion__4": { x: 77, y: 70 },
      "candy-onion__5": { x: 82, y: 70 },
      "candy-onion__6": { x: 62, y: 84 },
      "candy-onion__7": { x: 67, y: 84 },
      "candy-onion__8": { x: 72, y: 84 },
      "candy-onion__9": { x: 77, y: 84 },
      "candy-onion__10": { x: 82, y: 84 },
      "genovese-basil__1": { x: 24, y: 22 },
      "genovese-basil__2": { x: 24, y: 78 }
    },
    productIds: ["soil-test-lab-mailer", "seed-starting-trays", "grow-light", "tomato-cage-stakes", "plant-labels"]
  },
  {
    slug: "4x8-salad-garden",
    path: "/garden-plans/4x8-salad-garden/",
    shortTitle: "4x8 salad garden",
    title: "4x8 Salad Garden Plan",
    eyebrow: "Cool-season template",
    description: "A 4x8 salad garden layout for lettuce, spinach, arugula, carrots, beets, and bunching onions.",
    summary: "This is a succession-style bed: sow small blocks, harvest young, and replant open squares as weather allows.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "buttercrunch-lettuce", quantity: 4, role: "Leaf lettuce" },
      { id: "parris-island-romaine", quantity: 4, role: "Romaine block" },
      { id: "bloomsdale-spinach", quantity: 6, role: "Cool-season greens" },
      { id: "wild-arugula", quantity: 4, role: "Peppery cut-and-come-again greens" },
      { id: "danvers-carrot", quantity: 16, role: "Root crop strip" },
      { id: "evergreen-bunching-onion", quantity: 8, role: "Edge crop" }
    ],
    layout: {
      "buttercrunch-lettuce__1": { x: 20, y: 25 },
      "buttercrunch-lettuce__2": { x: 28, y: 25 },
      "buttercrunch-lettuce__3": { x: 20, y: 45 },
      "buttercrunch-lettuce__4": { x: 28, y: 45 },
      "parris-island-romaine__1": { x: 45, y: 25 },
      "parris-island-romaine__2": { x: 53, y: 25 },
      "parris-island-romaine__3": { x: 45, y: 45 },
      "parris-island-romaine__4": { x: 53, y: 45 },
      "bloomsdale-spinach__1": { x: 70, y: 25 },
      "bloomsdale-spinach__2": { x: 78, y: 25 },
      "bloomsdale-spinach__3": { x: 86, y: 25 },
      "bloomsdale-spinach__4": { x: 70, y: 45 },
      "bloomsdale-spinach__5": { x: 78, y: 45 },
      "bloomsdale-spinach__6": { x: 86, y: 45 },
      "wild-arugula__1": { x: 20, y: 68 },
      "wild-arugula__2": { x: 28, y: 68 },
      "wild-arugula__3": { x: 20, y: 84 },
      "wild-arugula__4": { x: 28, y: 84 }
    },
    productIds: ["soil-thermometer", "floating-row-cover", "low-tunnel-hoops", "garden-clips", "watering-wand"]
  },
  {
    slug: "deer-resistant-pollinator-bed",
    path: "/garden-plans/deer-resistant-pollinator-bed/",
    shortTitle: "Deer-resistant pollinator bed",
    title: "Deer-Resistant Pollinator Bed Plan",
    eyebrow: "Habitat template",
    description: "A simple full-sun pollinator bed template using plants with better deer-resistance cues in the Plant by ZIP database.",
    summary: "No plant is deer proof, but this template starts with sturdy, sunny plants that are less attractive than many tender garden crops.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "low",
      mode: "in-ground",
      deerPressure: "deer-pressure",
      walnut: "ignore"
    },
    plants: [
      { id: "purple-coneflower", quantity: 1, role: "Summer bloom" },
      { id: "black-eyed-susan", quantity: 1, role: "Long bloom" },
      { id: "butterfly-weed", quantity: 1, role: "Milkweed host plant" },
      { id: "moonshine-yarrow", quantity: 1, role: "Low aromatic flower" },
      { id: "russian-sage", quantity: 1, role: "Aromatic structure" },
      { id: "october-skies-aster", quantity: 1, role: "Late-season bloom" }
    ],
    layout: {
      "russian-sage__1": { x: 20, y: 50 },
      "purple-coneflower__1": { x: 40, y: 30 },
      "black-eyed-susan__1": { x: 40, y: 70 },
      "butterfly-weed__1": { x: 62, y: 32 },
      "october-skies-aster__1": { x: 74, y: 60 },
      "moonshine-yarrow__1": { x: 62, y: 78 }
    },
    productIds: ["soil-test-lab-mailer", "organic-mulch", "watering-wand", "animal-protection", "hand-trowel"]
  },
  {
    slug: "4x4-beginner-vegetable-bed",
    path: "/garden-plans/4x4-beginner-vegetable-bed/",
    shortTitle: "4x4 beginner vegetable bed",
    title: "4x4 Beginner Vegetable Garden Plan",
    eyebrow: "Small raised bed template",
    description: "A compact 4x4 starter bed with one fruiting anchor, herbs, quick greens, and radishes.",
    summary: "This is a low-commitment first bed: one supported crop, a pepper, herbs for frequent harvest, and fast shoulder-season crops.",
    settings: {
      zone: "7b",
      bedLength: 4,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "roma-tomato", quantity: 1, role: "Supported summer anchor" },
      { id: "california-wonder-pepper", quantity: 1, role: "Compact fruiting crop" },
      { id: "genovese-basil", quantity: 2, role: "Herb edge" },
      { id: "buttercrunch-lettuce", quantity: 4, role: "Quick spring/fall greens" },
      { id: "cherry-belle-radish", quantity: 8, role: "Fast gap crop" }
    ],
    layout: {
      "roma-tomato__1": { x: 24, y: 35 },
      "california-wonder-pepper__1": { x: 68, y: 40 },
      "genovese-basil__1": { x: 25, y: 78 },
      "genovese-basil__2": { x: 52, y: 78 },
      "buttercrunch-lettuce__1": { x: 70, y: 70 },
      "buttercrunch-lettuce__2": { x: 82, y: 70 },
      "buttercrunch-lettuce__3": { x: 70, y: 84 },
      "buttercrunch-lettuce__4": { x: 82, y: 84 }
    },
    productIds: ["finished-compost", "soil-thermometer", "tomato-cage-stakes", "plant-labels", "watering-wand"]
  },
  {
    slug: "2x8-narrow-herb-bed",
    path: "/garden-plans/2x8-narrow-herb-bed/",
    shortTitle: "2x8 herb strip",
    title: "2x8 Narrow Herb Bed Plan",
    eyebrow: "Herb strip template",
    description: "A narrow herb-bed layout for basil, parsley, thyme, oregano, sage, and dill along a walkway or patio edge.",
    summary: "Use this for a small edge bed where regular picking is easy. Keep Mediterranean herbs slightly drier than basil and parsley.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 2,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "genovese-basil", quantity: 2, role: "Warm-season herb" },
      { id: "italian-parsley", quantity: 2, role: "Cool-season herb" },
      { id: "english-thyme", quantity: 1, role: "Dry-edge perennial herb" },
      { id: "oregano-greek", quantity: 1, role: "Perennial herb" },
      { id: "sage-berggarten", quantity: 1, role: "Woody herb" },
      { id: "bouquet-dill", quantity: 2, role: "Succession herb" }
    ],
    layout: {
      "sage-berggarten__1": { x: 14, y: 50 },
      "oregano-greek__1": { x: 30, y: 50 },
      "english-thyme__1": { x: 44, y: 50 },
      "genovese-basil__1": { x: 60, y: 38 },
      "genovese-basil__2": { x: 60, y: 68 },
      "italian-parsley__1": { x: 76, y: 38 },
      "italian-parsley__2": { x: 76, y: 68 },
      "bouquet-dill__1": { x: 90, y: 36 },
      "bouquet-dill__2": { x: 90, y: 70 }
    },
    productIds: ["hand-trowel", "plant-labels", "watering-wand", "balanced-fertilizer", "organic-mulch"]
  },
  {
    slug: "8x8-family-vegetable-garden",
    path: "/garden-plans/8x8-family-vegetable-garden/",
    shortTitle: "8x8 family vegetable garden",
    title: "8x8 Family Vegetable Garden Plan",
    eyebrow: "Larger raised bed template",
    description: "An 8x8 vegetable garden template with tomatoes, peppers, cucumbers, beans, greens, roots, and herbs.",
    summary: "This layout uses the extra footprint for a more complete kitchen garden while keeping tall crops toward the back and edges.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 8,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "black-krim-tomato", quantity: 1, role: "Slicing tomato" },
      { id: "sungold-tomato", quantity: 1, role: "Cherry tomato" },
      { id: "banana-pepper", quantity: 2, role: "Pepper block" },
      { id: "marketmore-cucumber", quantity: 2, role: "Trellis crop" },
      { id: "provider-bush-bean", quantity: 6, role: "Succession crop" },
      { id: "bloomsdale-spinach", quantity: 6, role: "Cool-season greens" },
      { id: "danvers-carrot", quantity: 12, role: "Root crop strip" },
      { id: "genovese-basil", quantity: 3, role: "Herb pockets" }
    ],
    layout: {
      "black-krim-tomato__1": { x: 18, y: 28 },
      "sungold-tomato__1": { x: 18, y: 72 },
      "banana-pepper__1": { x: 42, y: 32 },
      "banana-pepper__2": { x: 42, y: 60 },
      "marketmore-cucumber__1": { x: 76, y: 25 },
      "marketmore-cucumber__2": { x: 76, y: 55 },
      "genovese-basil__1": { x: 26, y: 48 },
      "genovese-basil__2": { x: 52, y: 45 },
      "genovese-basil__3": { x: 64, y: 78 }
    },
    productIds: ["soil-test-lab-mailer", "finished-compost", "drip-irrigation-kit", "trellis-netting", "tomato-cage-stakes"]
  },
  {
    slug: "4x8-tomato-basil-bed",
    path: "/garden-plans/4x8-tomato-basil-bed/",
    shortTitle: "4x8 tomato basil bed",
    title: "4x8 Tomato and Basil Bed Plan",
    eyebrow: "Summer crop template",
    description: "A 4x8 tomato-focused bed with basil and marigolds used as edge companions rather than crowded understory plants.",
    summary: "This template keeps tomatoes supported and gives basil/marigolds harvest and airflow space near the edges.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "cherokee-purple-tomato", quantity: 1, role: "Slicing tomato" },
      { id: "sungold-tomato", quantity: 1, role: "Cherry tomato" },
      { id: "genovese-basil", quantity: 4, role: "Harvest edge" },
      { id: "durango-marigold", quantity: 4, role: "Flowering edge" }
    ],
    layout: {
      "cherokee-purple-tomato__1": { x: 25, y: 45 },
      "sungold-tomato__1": { x: 62, y: 45 },
      "genovese-basil__1": { x: 22, y: 78 },
      "genovese-basil__2": { x: 38, y: 78 },
      "genovese-basil__3": { x: 58, y: 78 },
      "genovese-basil__4": { x: 75, y: 78 },
      "durango-marigold__1": { x: 20, y: 18 },
      "durango-marigold__2": { x: 38, y: 18 },
      "durango-marigold__3": { x: 60, y: 18 },
      "durango-marigold__4": { x: 78, y: 18 }
    },
    productIds: ["tomato-cage-stakes", "soft-plant-ties", "drip-irrigation-kit", "balanced-fertilizer", "plant-labels"]
  },
  {
    slug: "4x8-pickle-garden",
    path: "/garden-plans/4x8-pickle-garden/",
    shortTitle: "4x8 pickle garden",
    title: "4x8 Pickle Garden Plan",
    eyebrow: "Cucumber bed template",
    description: "A cucumber, dill, bean, and radish bed for gardeners who want a compact pickle-and-snack layout.",
    summary: "Trellis cucumbers on one long side, keep dill where it will not shade the vines, and use radishes as fast gap crops.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "national-pickling-cucumber", quantity: 2, role: "Trellised cucumber" },
      { id: "bouquet-dill", quantity: 3, role: "Pickling herb" },
      { id: "provider-bush-bean", quantity: 6, role: "Fast summer crop" },
      { id: "cherry-belle-radish", quantity: 8, role: "Early gap crop" }
    ],
    layout: {
      "national-pickling-cucumber__1": { x: 24, y: 24 },
      "national-pickling-cucumber__2": { x: 52, y: 24 },
      "bouquet-dill__1": { x: 76, y: 24 },
      "bouquet-dill__2": { x: 76, y: 50 },
      "bouquet-dill__3": { x: 76, y: 76 },
      "provider-bush-bean__1": { x: 24, y: 70 },
      "provider-bush-bean__2": { x: 34, y: 70 },
      "provider-bush-bean__3": { x: 44, y: 70 },
      "provider-bush-bean__4": { x: 24, y: 86 },
      "provider-bush-bean__5": { x: 34, y: 86 },
      "provider-bush-bean__6": { x: 44, y: 86 }
    },
    productIds: ["trellis-netting", "soft-plant-ties", "drip-irrigation-kit", "insect-netting", "plant-labels"]
  },
  {
    slug: "4x8-cut-flower-pollinator-bed",
    path: "/garden-plans/4x8-cut-flower-pollinator-bed/",
    shortTitle: "4x8 flower pollinator bed",
    title: "4x8 Cut Flower and Pollinator Bed Plan",
    eyebrow: "Flower bed template",
    description: "A full-sun 4x8 flower bed with zinnia, cosmos, calendula, borage, and marigold for pollinators and cutting.",
    summary: "This plan uses annual flowers that are easy to direct sow or transplant and can support nearby vegetable beds.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "benary-zinnia", quantity: 4, role: "Cut flower anchor" },
      { id: "sensation-cosmos", quantity: 3, role: "Airy summer bloom" },
      { id: "calendula-pacific-beauty", quantity: 4, role: "Cool-season bloom" },
      { id: "borage", quantity: 1, role: "Pollinator draw" },
      { id: "durango-marigold", quantity: 4, role: "Edge color" }
    ],
    layout: {
      "borage__1": { x: 18, y: 52 },
      "benary-zinnia__1": { x: 38, y: 28 },
      "benary-zinnia__2": { x: 52, y: 28 },
      "benary-zinnia__3": { x: 38, y: 58 },
      "benary-zinnia__4": { x: 52, y: 58 },
      "sensation-cosmos__1": { x: 74, y: 24 },
      "sensation-cosmos__2": { x: 74, y: 52 },
      "sensation-cosmos__3": { x: 74, y: 78 },
      "durango-marigold__1": { x: 24, y: 84 },
      "durango-marigold__2": { x: 40, y: 84 },
      "durango-marigold__3": { x: 56, y: 84 },
      "durango-marigold__4": { x: 72, y: 84 }
    },
    productIds: ["seed-starting-trays", "grow-light", "watering-wand", "plant-labels", "hand-trowel"]
  },
  {
    slug: "4x4-shade-greens-herb-bed",
    path: "/garden-plans/4x4-shade-greens-herb-bed/",
    shortTitle: "4x4 shade greens bed",
    title: "4x4 Shade Greens and Herb Bed Plan",
    eyebrow: "Lower-light template",
    description: "A partial-shade 4x4 layout for leafy greens and herbs that can handle less than all-day sun.",
    summary: "Use this for a bright edge, east exposure, or part-sun bed where fruiting vegetables struggle.",
    settings: {
      zone: "7b",
      bedLength: 4,
      bedWidth: 4,
      bedCount: 1,
      sun: "partial",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "bloomsdale-spinach", quantity: 6, role: "Leafy green" },
      { id: "arugula-astro", quantity: 4, role: "Fast green" },
      { id: "buttercrunch-lettuce", quantity: 4, role: "Leaf lettuce" },
      { id: "italian-parsley", quantity: 2, role: "Herb" },
      { id: "mitsuba", quantity: 2, role: "Shade-tolerant herb" }
    ],
    layout: {
      "italian-parsley__1": { x: 18, y: 25 },
      "italian-parsley__2": { x: 18, y: 52 },
      "mitsuba__1": { x: 18, y: 78 },
      "mitsuba__2": { x: 36, y: 78 },
      "buttercrunch-lettuce__1": { x: 42, y: 25 },
      "buttercrunch-lettuce__2": { x: 58, y: 25 },
      "buttercrunch-lettuce__3": { x: 42, y: 50 },
      "buttercrunch-lettuce__4": { x: 58, y: 50 },
      "arugula-astro__1": { x: 76, y: 25 },
      "arugula-astro__2": { x: 86, y: 25 },
      "arugula-astro__3": { x: 76, y: 50 },
      "arugula-astro__4": { x: 86, y: 50 }
    },
    productIds: ["finished-compost", "floating-row-cover", "shade-cloth", "watering-wand", "hand-trowel"]
  },
  {
    slug: "4x8-asian-greens-bed",
    path: "/garden-plans/4x8-asian-greens-bed/",
    shortTitle: "4x8 Asian greens bed",
    title: "4x8 Asian Greens Garden Plan",
    eyebrow: "Cool-season greens template",
    description: "A 4x8 bed plan for napa cabbage, komatsuna, mizuna, tatsoi, gai lan, and bok choy.",
    summary: "This plan turns the new Asian greens database expansion into a practical cool-season bed template.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "napa-cabbage", quantity: 2, role: "Heading brassica" },
      { id: "komatsuna", quantity: 4, role: "Leafy green" },
      { id: "mizuna", quantity: 4, role: "Cut-and-come-again green" },
      { id: "tatsoi", quantity: 4, role: "Rosette green" },
      { id: "gai-lan", quantity: 2, role: "Stem brassica" },
      { id: "joi-choi-bok-choy", quantity: 3, role: "Bok choy block" }
    ],
    layout: {
      "napa-cabbage__1": { x: 20, y: 34 },
      "napa-cabbage__2": { x: 20, y: 68 },
      "gai-lan__1": { x: 43, y: 30 },
      "gai-lan__2": { x: 43, y: 62 },
      "joi-choi-bok-choy__1": { x: 62, y: 25 },
      "joi-choi-bok-choy__2": { x: 62, y: 50 },
      "joi-choi-bok-choy__3": { x: 62, y: 75 },
      "komatsuna__1": { x: 80, y: 22 },
      "komatsuna__2": { x: 88, y: 22 },
      "komatsuna__3": { x: 80, y: 42 },
      "komatsuna__4": { x: 88, y: 42 }
    },
    productIds: ["soil-thermometer", "floating-row-cover", "insect-netting", "low-tunnel-hoops", "garden-clips"]
  },
  {
    slug: "2x8-deer-resistant-pollinator-strip",
    path: "/garden-plans/2x8-deer-resistant-pollinator-strip/",
    shortTitle: "2x8 deer-resistant strip",
    title: "2x8 Deer-Resistant Pollinator Strip Plan",
    eyebrow: "Narrow habitat template",
    description: "A narrow full-sun pollinator strip using aromatic or tougher plants with better deer-pressure cues.",
    summary: "No plant is deer proof, but this strip starts with plants that are better candidates where browse pressure is real.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 2,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "low",
      mode: "in-ground",
      deerPressure: "deer-pressure",
      walnut: "ignore"
    },
    plants: [
      { id: "moonshine-yarrow", quantity: 2, role: "Low bloom" },
      { id: "russian-sage", quantity: 1, role: "Aromatic structure" },
      { id: "purple-coneflower", quantity: 2, role: "Summer bloom" },
      { id: "october-skies-aster", quantity: 2, role: "Fall bloom" },
      { id: "little-bluestem", quantity: 2, role: "Grass structure" }
    ],
    layout: {
      "russian-sage__1": { x: 16, y: 50 },
      "moonshine-yarrow__1": { x: 32, y: 35 },
      "moonshine-yarrow__2": { x: 32, y: 68 },
      "purple-coneflower__1": { x: 52, y: 35 },
      "purple-coneflower__2": { x: 52, y: 68 },
      "october-skies-aster__1": { x: 72, y: 35 },
      "october-skies-aster__2": { x: 72, y: 68 },
      "little-bluestem__1": { x: 90, y: 35 },
      "little-bluestem__2": { x: 90, y: 68 }
    },
    productIds: ["animal-protection", "organic-mulch", "hand-trowel", "watering-wand", "soil-test-lab-mailer"]
  }
];

export function gardenPlanBySlug(slug) {
  return GARDEN_PLAN_TEMPLATES.find((template) => template.slug === slug);
}

export function gardenPlanInternalLinks() {
  return GARDEN_PLAN_TEMPLATES.map((template) => ({
    href: template.path,
    title: template.shortTitle,
    description: template.description
  }));
}

export function gardenPlanPlannerUrl(template) {
  return `/?garden-template=${encodeURIComponent(template.slug)}#garden-planner`;
}

export function gardenPlanTemplatePayloads() {
  return GARDEN_PLAN_TEMPLATES.map((template) => ({
    slug: template.slug,
    title: template.title,
    settings: template.settings,
    plants: template.plants.map(({ id, quantity }) => ({ id, quantity })),
    layout: template.layout
  }));
}

export function gardenPlanPlantEntries(template, plants, plantMetrics) {
  return template.plants
    .map((planPlant) => {
      const plant = plants.find((candidate) => candidate.id === planPlant.id);
      if (!plant) return null;
      return {
        ...planPlant,
        plant,
        metrics: plantMetrics[plant.id] ?? {}
      };
    })
    .filter(Boolean);
}

export function gardenPlanSpaceStats(template, plantMetrics) {
  return template.plants.reduce((stats, planPlant) => {
    const metrics = plantMetrics[planPlant.id] ?? {};
    const quantity = Math.max(1, Number(planPlant.quantity) || 1);
    const min = Number(metrics.spacingAreaSqFtMin);
    const max = Number(metrics.spacingAreaSqFtMax);
    const yieldMin = Number(metrics.yieldLbsMin);
    const yieldMax = Number(metrics.yieldLbsMax);
    return {
      minSqFt: stats.minSqFt + (Number.isFinite(min) ? min * quantity : 0),
      maxSqFt: stats.maxSqFt + (Number.isFinite(max) ? max * quantity : 0),
      minYield: stats.minYield + (Number.isFinite(yieldMin) ? yieldMin * quantity : 0),
      maxYield: stats.maxYield + (Number.isFinite(yieldMax) ? yieldMax * quantity : 0),
      sourcedYieldRows: stats.sourcedYieldRows + (isSourcedValue(metrics.display?.yieldLbs) ? 1 : 0)
    };
  }, {
    minSqFt: 0,
    maxSqFt: 0,
    minYield: 0,
    maxYield: 0,
    sourcedYieldRows: 0
  });
}

export function gardenPlanItemList(entries, siteUrl) {
  return entries.map(({ plant }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    url: siteUrl(plantUrl(plant))
  }));
}
