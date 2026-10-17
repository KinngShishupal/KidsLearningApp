/**
 * Question pools for the Science screen games.
 * Each pool holds 50 questions; a round draws `*_ROUND_LENGTH` of them at random.
 */

export type AnimalQuestion = {
  question: string;
  animal: string;
  options: string[];
  answer: string;
};

export type PlanetOption = {
  name: string;
  emoji: string;
  color: string;
  description: string;
};

export type PlanetQuestion = {
  question: string;
  options: PlanetOption[];
  answer: string;
};

export type NatureQuestion = {
  question: string;
  options: { text: string; correct: boolean }[];
};

export type ScienceQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  emoji: string;
};

export const ANIMAL_ROUND_LENGTH = 10;
export const PLANET_ROUND_LENGTH = 10;
export const NATURE_ROUND_LENGTH = 5;
export const SCIENCE_ROUND_LENGTH = 5;

// ---------------------------------------------------------------------------
// Animals
// ---------------------------------------------------------------------------

export const ANIMAL_POOL: AnimalQuestion[] = [
  { question: 'What sound does a lion make?', animal: '🦁', options: ['Meow', 'Roar', 'Woof', 'Quack'], answer: 'Roar' },
  { question: 'What sound does a cow make?', animal: '🐮', options: ['Moo', 'Baa', 'Oink', 'Neigh'], answer: 'Moo' },
  { question: 'What sound does a cat make?', animal: '🐱', options: ['Woof', 'Meow', 'Roar', 'Chirp'], answer: 'Meow' },
  { question: 'What sound does a bird make?', animal: '🐦', options: ['Moo', 'Roar', 'Chirp', 'Hiss'], answer: 'Chirp' },
  { question: 'What sound does a dog make?', animal: '🐕', options: ['Meow', 'Woof', 'Moo', 'Quack'], answer: 'Woof' },
  { question: 'What sound does a sheep make?', animal: '🐑', options: ['Baa', 'Moo', 'Oink', 'Neigh'], answer: 'Baa' },
  { question: 'What sound does a pig make?', animal: '🐷', options: ['Moo', 'Baa', 'Oink', 'Chirp'], answer: 'Oink' },
  { question: 'What sound does a duck make?', animal: '🦆', options: ['Quack', 'Chirp', 'Roar', 'Meow'], answer: 'Quack' },
  { question: 'What sound does a horse make?', animal: '🐴', options: ['Neigh', 'Moo', 'Baa', 'Roar'], answer: 'Neigh' },
  { question: 'What sound does a frog make?', animal: '🐸', options: ['Ribbit', 'Chirp', 'Hiss', 'Woof'], answer: 'Ribbit' },
  // Sounds
  { question: 'What sound does a snake make?', animal: '🐍', options: ['Moo', 'Hiss', 'Woof', 'Neigh'], answer: 'Hiss' },
  { question: 'What sound does a rooster make?', animal: '🐓', options: ['Oink', 'Baa', 'Cock-a-doodle-doo', 'Ribbit'], answer: 'Cock-a-doodle-doo' },
  { question: 'What sound does an owl make?', animal: '🦉', options: ['Hoot', 'Moo', 'Oink', 'Baa'], answer: 'Hoot' },
  { question: 'What sound does a bee make?', animal: '🐝', options: ['Quack', 'Neigh', 'Roar', 'Buzz'], answer: 'Buzz' },
  { question: 'What sound does a mouse make?', animal: '🐭', options: ['Squeak', 'Roar', 'Moo', 'Neigh'], answer: 'Squeak' },
  { question: 'What sound does a turkey make?', animal: '🦃', options: ['Baa', 'Gobble', 'Woof', 'Hiss'], answer: 'Gobble' },
  { question: 'What sound does a wolf make?', animal: '🐺', options: ['Moo', 'Quack', 'Howl', 'Oink'], answer: 'Howl' },
  { question: 'What sound does an elephant make?', animal: '🐘', options: ['Meow', 'Quack', 'Oink', 'Trumpet'], answer: 'Trumpet' },
  // Baby animals
  { question: 'What is a baby dog called?', animal: '🐶', options: ['Kitten', 'Calf', 'Puppy', 'Chick'], answer: 'Puppy' },
  { question: 'What is a baby cat called?', animal: '🐱', options: ['Kitten', 'Puppy', 'Lamb', 'Foal'], answer: 'Kitten' },
  { question: 'What is a baby cow called?', animal: '🐮', options: ['Piglet', 'Calf', 'Kitten', 'Duckling'], answer: 'Calf' },
  { question: 'What is a baby sheep called?', animal: '🐑', options: ['Foal', 'Chick', 'Puppy', 'Lamb'], answer: 'Lamb' },
  { question: 'What is a baby pig called?', animal: '🐷', options: ['Piglet', 'Lamb', 'Cub', 'Kitten'], answer: 'Piglet' },
  { question: 'What is a baby duck called?', animal: '🦆', options: ['Calf', 'Duckling', 'Puppy', 'Foal'], answer: 'Duckling' },
  { question: 'What is a baby horse called?', animal: '🐴', options: ['Kitten', 'Lamb', 'Foal', 'Piglet'], answer: 'Foal' },
  { question: 'What is a baby lion called?', animal: '🦁', options: ['Puppy', 'Calf', 'Chick', 'Cub'], answer: 'Cub' },
  { question: 'What is a baby hen called?', animal: '🐔', options: ['Chick', 'Cub', 'Lamb', 'Foal'], answer: 'Chick' },
  { question: 'What is a baby frog called?', animal: '🐸', options: ['Kitten', 'Tadpole', 'Puppy', 'Calf'], answer: 'Tadpole' },
  { question: 'What is a baby bear called?', animal: '🐻', options: ['Lamb', 'Piglet', 'Cub', 'Duckling'], answer: 'Cub' },
  // Homes
  { question: 'Where does a fish live?', animal: '🐟', options: ['Water', 'Tree', 'Desert', 'Nest'], answer: 'Water' },
  { question: 'Where does a bee live?', animal: '🐝', options: ['Den', 'Hive', 'Nest', 'Pond'], answer: 'Hive' },
  { question: 'Where does a bird lay its eggs?', animal: '🐦', options: ['Hive', 'Kennel', 'Nest', 'Stable'], answer: 'Nest' },
  { question: 'What does a spider spin to catch its food?', animal: '🕷️', options: ['Hive', 'Stable', 'Kennel', 'Web'], answer: 'Web' },
  { question: 'Where does a camel live?', animal: '🐫', options: ['Ocean', 'Desert', 'Ice', 'Pond'], answer: 'Desert' },
  { question: 'Where does a frog like to live?', animal: '🐸', options: ['Desert', 'Hive', 'Pond', 'Nest'], answer: 'Pond' },
  // Food
  { question: 'What does a rabbit love to eat?', animal: '🐰', options: ['Carrots', 'Fish', 'Meat', 'Bones'], answer: 'Carrots' },
  { question: 'What does a monkey love to eat?', animal: '🐵', options: ['Bones', 'Bananas', 'Fish', 'Rocks'], answer: 'Bananas' },
  { question: 'What does a cow eat?', animal: '🐮', options: ['Fish', 'Meat', 'Grass', 'Bones'], answer: 'Grass' },
  { question: 'What does a panda love to eat?', animal: '🐼', options: ['Fish', 'Carrots', 'Cheese', 'Bamboo'], answer: 'Bamboo' },
  { question: 'What does a koala eat?', animal: '🐨', options: ['Fish', 'Leaves', 'Meat', 'Bananas'], answer: 'Leaves' },
  { question: 'What does a squirrel love to eat?', animal: '🐿️', options: ['Rocks', 'Fish', 'Nuts', 'Pizza'], answer: 'Nuts' },
  // Bodies
  { question: 'How many legs does a dog have?', animal: '🐕', options: ['2', '6', '4', '8'], answer: '4' },
  { question: 'How many legs does a bird have?', animal: '🐦', options: ['2', '4', '6', '8'], answer: '2' },
  { question: 'How many legs does an ant have?', animal: '🐜', options: ['4', '8', '2', '6'], answer: '6' },
  { question: 'What does an elephant use to pick things up?', animal: '🐘', options: ['Tail', 'Trunk', 'Ears', 'Wings'], answer: 'Trunk' },
  { question: 'What does a turtle carry on its back?', animal: '🐢', options: ['Wings', 'Fur', 'Shell', 'Feathers'], answer: 'Shell' },
  { question: "What covers a bird's body?", animal: '🐦', options: ['Scales', 'Fur', 'Feathers', 'Shell'], answer: 'Feathers' },
  { question: "What covers a fish's body?", animal: '🐟', options: ['Feathers', 'Fur', 'Wool', 'Scales'], answer: 'Scales' },
  { question: 'What can a caterpillar grow up to be?', animal: '🐛', options: ['Bee', 'Butterfly', 'Frog', 'Bird'], answer: 'Butterfly' },
  { question: 'What soft fluffy thing do we get from a sheep?', animal: '🐑', options: ['Honey', 'Wool', 'Shells', 'Feathers'], answer: 'Wool' },
];

// ---------------------------------------------------------------------------
// Planets & space
// ---------------------------------------------------------------------------

const MERCURY: PlanetOption = { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' };
const VENUS: PlanetOption = { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' };
const EARTH: PlanetOption = { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' };
const MARS: PlanetOption = { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' };
const JUPITER: PlanetOption = { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' };
const SATURN: PlanetOption = { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' };
const URANUS: PlanetOption = { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' };
const NEPTUNE: PlanetOption = { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' };
const SUN: PlanetOption = { name: 'Sun', emoji: '🌞', color: '#FDB813', description: 'Our Star' };
const MOON: PlanetOption = { name: 'Moon', emoji: '🌙', color: '#A9A9B8', description: 'Night Light' };
const STAR: PlanetOption = { name: 'Star', emoji: '⭐', color: '#F5C400', description: 'Twinkle' };
const COMET: PlanetOption = { name: 'Comet', emoji: '☄️', color: '#5DADE2', description: 'Icy Tail' };
const METEOR: PlanetOption = { name: 'Meteor', emoji: '🌠', color: '#8E7CC3', description: 'Shooting Star' };
const PLANET: PlanetOption = { name: 'Planet', emoji: '🌎', color: '#48A868', description: 'Round World' };
const ROCKET: PlanetOption = { name: 'Rocket', emoji: '🚀', color: '#FF6B6B', description: 'Blast Off' };
const AIRPLANE: PlanetOption = { name: 'Airplane', emoji: '✈️', color: '#90A4AE', description: 'Sky Flyer' };
const BALLOON: PlanetOption = { name: 'Balloon', emoji: '🎈', color: '#EC7063', description: 'Floaty' };
const CAR: PlanetOption = { name: 'Car', emoji: '🚗', color: '#5D6D7E', description: 'On Roads' };

export const PLANET_POOL: PlanetQuestion[] = [
  {
    question: 'Which planet is closest to the Sun?',
    options: [
      { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
    ],
    answer: 'Mercury',
  },
  {
    question: 'Which planet do we live on?',
    options: [
      { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
    ],
    answer: 'Earth',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: [
      { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
    ],
    answer: 'Mars',
  },
  {
    question: 'Which is the largest planet?',
    options: [
      { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
      { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
    ],
    answer: 'Jupiter',
  },
  {
    question: 'Which planet has beautiful rings?',
    options: [
      { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
      { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
      { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
      { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
    ],
    answer: 'Saturn',
  },
  {
    question: 'Which planet is the hottest?',
    options: [
      { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
    ],
    answer: 'Venus',
  },
  {
    question: 'Which planet is known as the Blue Planet?',
    options: [
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
      { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
    ],
    answer: 'Earth',
  },
  {
    question: 'Which planet has water and life?',
    options: [
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
    ],
    answer: 'Earth',
  },
  {
    question: 'Which is the smallest planet?',
    options: [
      { name: 'Mercury', emoji: '☀️', color: '#8B8B8B', description: 'Tiny & Gray' },
      { name: 'Mars', emoji: '🔴', color: '#E27B58', description: 'Red' },
      { name: 'Venus', emoji: '🌥️', color: '#FFC649', description: 'Cloudy' },
      { name: 'Earth', emoji: '🌍', color: '#4A90E2', description: 'Home' },
    ],
    answer: 'Mercury',
  },
  {
    question: 'Which planet is farthest from the Sun?',
    options: [
      { name: 'Neptune', emoji: '🔵', color: '#4169E1', description: 'Blue' },
      { name: 'Uranus', emoji: '💙', color: '#7CB9E8', description: 'Tilted' },
      { name: 'Saturn', emoji: '💍', color: '#F4D03F', description: 'Rings' },
      { name: 'Jupiter', emoji: '🟤', color: '#D4A574', description: 'Giant' },
    ],
    answer: 'Neptune',
  },
  // The Sun, Moon and other space objects
  { question: 'What is the star at the center of our solar system?', options: [MOON, SUN, EARTH, JUPITER], answer: 'Sun' },
  { question: 'What travels around the Earth about once a month?', options: [SUN, MOON, MARS, VENUS], answer: 'Moon' },
  { question: 'What seems to change shape in the night sky every month?', options: [SUN, EARTH, MOON, JUPITER], answer: 'Moon' },
  { question: 'What kind of space object is the Sun?', options: [PLANET, MOON, STAR, COMET], answer: 'Star' },
  { question: 'Which of these is the biggest?', options: [EARTH, MOON, MARS, SUN], answer: 'Sun' },
  { question: 'Which of these is the smallest?', options: [EARTH, MOON, JUPITER, SUN], answer: 'Moon' },
  { question: 'What has a long glowing tail and is made of ice and dust?', options: [COMET, MOON, SUN, EARTH], answer: 'Comet' },
  { question: 'What do astronauts ride into space?', options: [AIRPLANE, BALLOON, CAR, ROCKET], answer: 'Rocket' },
  { question: 'Where have astronauts walked, other than Earth?', options: [MARS, SUN, MOON, VENUS], answer: 'Moon' },
  { question: 'What does the Earth travel around once a year?', options: [MOON, SUN, MARS, JUPITER], answer: 'Sun' },
  { question: 'Which of these is the hottest?', options: [MOON, EARTH, NEPTUNE, SUN], answer: 'Sun' },
  { question: 'What twinkles in the night sky?', options: [SUN, STAR, EARTH, ROCKET], answer: 'Star' },
  { question: "Where does the Moon's light really come from?", options: [EARTH, MARS, SUN, COMET], answer: 'Sun' },
  { question: 'What is a shooting star really?', options: [MOON, METEOR, SUN, EARTH], answer: 'Meteor' },
  { question: 'What is the closest star to Earth?', options: [MOON, MARS, VENUS, SUN], answer: 'Sun' },
  // Planet order
  { question: 'Which planet is third from the Sun?', options: [MARS, VENUS, EARTH, JUPITER], answer: 'Earth' },
  { question: 'Which planet is second from the Sun?', options: [VENUS, MERCURY, EARTH, MARS], answer: 'Venus' },
  { question: 'Which planet is fourth from the Sun?', options: [EARTH, JUPITER, VENUS, MARS], answer: 'Mars' },
  { question: 'Which planet is fifth from the Sun?', options: [SATURN, JUPITER, MARS, URANUS], answer: 'Jupiter' },
  { question: 'Which planet is sixth from the Sun?', options: [JUPITER, URANUS, SATURN, NEPTUNE], answer: 'Saturn' },
  { question: 'Which planet is seventh from the Sun?', options: [URANUS, NEPTUNE, SATURN, MARS], answer: 'Uranus' },
  { question: 'Which planet is next to Earth, a bit closer to the Sun?', options: [MARS, VENUS, JUPITER, NEPTUNE], answer: 'Venus' },
  { question: 'Which planet is next to Earth, a bit farther from the Sun?', options: [MARS, VENUS, MERCURY, SATURN], answer: 'Mars' },
  { question: 'Which planet is between Mars and Saturn?', options: [VENUS, EARTH, NEPTUNE, JUPITER], answer: 'Jupiter' },
  { question: 'Which planet is between Venus and Mars?', options: [MERCURY, EARTH, JUPITER, URANUS], answer: 'Earth' },
  { question: 'Which planet is between Saturn and Neptune?', options: [MARS, EARTH, MERCURY, URANUS], answer: 'Uranus' },
  { question: 'Which of these planets is closest to the Sun?', options: [MARS, JUPITER, EARTH, NEPTUNE], answer: 'Earth' },
  // Planet facts
  { question: 'Which planet spins while lying on its side?', options: [EARTH, MARS, URANUS, JUPITER], answer: 'Uranus' },
  { question: 'Which planet has a giant storm called the Great Red Spot?', options: [MARS, JUPITER, EARTH, VENUS], answer: 'Jupiter' },
  { question: 'Which is the second biggest planet?', options: [EARTH, MARS, MERCURY, SATURN], answer: 'Saturn' },
  { question: 'Which planet has the strongest winds?', options: [EARTH, MERCURY, NEPTUNE, MARS], answer: 'Neptune' },
  { question: 'Which planet is covered in thick yellow clouds?', options: [MARS, EARTH, VENUS, MERCURY], answer: 'Venus' },
  { question: 'Which of these planets is the coldest?', options: [EARTH, VENUS, MERCURY, NEPTUNE], answer: 'Neptune' },
  { question: 'Which planet is almost the same size as Earth?', options: [JUPITER, VENUS, SATURN, NEPTUNE], answer: 'Venus' },
  { question: 'Which of these planets is the biggest?', options: [MARS, EARTH, NEPTUNE, MERCURY], answer: 'Neptune' },
  { question: 'Which of these planets is the smallest?', options: [MARS, JUPITER, SATURN, EARTH], answer: 'Mars' },
  { question: 'Which planet has the shortest year?', options: [NEPTUNE, MERCURY, SATURN, MARS], answer: 'Mercury' },
  { question: 'Which planet has the longest year?', options: [EARTH, MARS, NEPTUNE, VENUS], answer: 'Neptune' },
  { question: 'Which planet has the shortest day?', options: [JUPITER, EARTH, VENUS, MERCURY], answer: 'Jupiter' },
  { question: 'Which planet have robot rovers driven around on?', options: [VENUS, MARS, JUPITER, SATURN], answer: 'Mars' },
];

// ---------------------------------------------------------------------------
// Nature (multiple options can be correct)
// ---------------------------------------------------------------------------

export const NATURE_POOL: NatureQuestion[] = [
  {
    question: 'What does a plant need to grow?',
    options: [
      { text: '☀️ Sunlight', correct: true },
      { text: '💧 Water', correct: true },
      { text: '🍕 Pizza', correct: false },
      { text: '🌱 Soil', correct: true },
    ],
  },
  {
    question: 'Which of these are trees?',
    options: [
      { text: '🌲 Pine Tree', correct: true },
      { text: '🌻 Sunflower', correct: false },
      { text: '🌳 Oak Tree', correct: true },
      { text: '🌹 Rose', correct: false },
    ],
  },
  {
    question: 'What do bees make?',
    options: [
      { text: '🍯 Honey', correct: true },
      { text: '🥛 Milk', correct: false },
      { text: '🌼 Flowers', correct: false },
      { text: '🐝 More Bees', correct: true },
    ],
  },
  {
    question: 'Which animals can fly?',
    options: [
      { text: '🐦 Bird', correct: true },
      { text: '🐟 Fish', correct: false },
      { text: '🦋 Butterfly', correct: true },
      { text: '🐘 Elephant', correct: false },
    ],
  },
  {
    question: 'What comes from clouds?',
    options: [
      { text: '🌧️ Rain', correct: true },
      { text: '🍔 Burgers', correct: false },
      { text: '❄️ Snow', correct: true },
      { text: '🎈 Balloons', correct: false },
    ],
  },
  {
    question: 'Which of these are fruits?',
    options: [
      { text: '🍎 Apple', correct: true },
      { text: '🥕 Carrot', correct: false },
      { text: '🍌 Banana', correct: true },
      { text: '🥦 Broccoli', correct: false },
    ],
  },
  {
    question: 'Which of these are vegetables?',
    options: [
      { text: '🍓 Strawberry', correct: false },
      { text: '🥕 Carrot', correct: true },
      { text: '🍇 Grapes', correct: false },
      { text: '🥦 Broccoli', correct: true },
    ],
  },
  {
    question: 'Which animals live in the ocean?',
    options: [
      { text: '🐳 Whale', correct: true },
      { text: '🐄 Cow', correct: false },
      { text: '🐒 Monkey', correct: false },
      { text: '🐙 Octopus', correct: true },
    ],
  },
  {
    question: 'Which animals have feathers?',
    options: [
      { text: '🐶 Dog', correct: false },
      { text: '🐔 Chicken', correct: true },
      { text: '🦉 Owl', correct: true },
      { text: '🐟 Fish', correct: false },
    ],
  },
  {
    question: 'Which of these are insects?',
    options: [
      { text: '🐜 Ant', correct: true },
      { text: '🕷️ Spider', correct: false },
      { text: '🐝 Bee', correct: true },
      { text: '🐌 Snail', correct: false },
    ],
  },
  {
    question: 'Which of these can you see in the sky?',
    options: [
      { text: '🐟 Fish', correct: false },
      { text: '☁️ Clouds', correct: true },
      { text: '🌈 Rainbow', correct: true },
      { text: '🐌 Snail', correct: false },
    ],
  },
  {
    question: 'Which of these are hot?',
    options: [
      { text: '🔥 Fire', correct: true },
      { text: '❄️ Snow', correct: false },
      { text: '⛄ Snowman', correct: false },
      { text: '☀️ Sun', correct: true },
    ],
  },
  {
    question: 'Which of these are cold?',
    options: [
      { text: '☕ Hot Cocoa', correct: false },
      { text: '⛄ Snowman', correct: true },
      { text: '🔥 Fire', correct: false },
      { text: '🍦 Ice Cream', correct: true },
    ],
  },
  {
    question: 'Which animals have stripes?',
    options: [
      { text: '🐑 Sheep', correct: false },
      { text: '🐯 Tiger', correct: true },
      { text: '🦓 Zebra', correct: true },
      { text: '🐷 Pig', correct: false },
    ],
  },
  {
    question: 'Which animals hop?',
    options: [
      { text: '🐰 Rabbit', correct: true },
      { text: '🐍 Snake', correct: false },
      { text: '🐟 Fish', correct: false },
      { text: '🐸 Frog', correct: true },
    ],
  },
  {
    question: 'Which animals have shells?',
    options: [
      { text: '🐶 Dog', correct: false },
      { text: '🐢 Turtle', correct: true },
      { text: '🐦 Bird', correct: false },
      { text: '🐌 Snail', correct: true },
    ],
  },
  {
    question: 'Which of these grow on trees?',
    options: [
      { text: '🍎 Apple', correct: true },
      { text: '🥕 Carrot', correct: false },
      { text: '🍊 Orange', correct: true },
      { text: '🥔 Potato', correct: false },
    ],
  },
  {
    question: 'Which animals give us milk?',
    options: [
      { text: '🐔 Chicken', correct: false },
      { text: '🐄 Cow', correct: true },
      { text: '🐟 Fish', correct: false },
      { text: '🐐 Goat', correct: true },
    ],
  },
  {
    question: 'Which animals lay eggs?',
    options: [
      { text: '🐶 Dog', correct: false },
      { text: '🐱 Cat', correct: false },
      { text: '🐔 Chicken', correct: true },
      { text: '🐢 Turtle', correct: true },
    ],
  },
  {
    question: 'Which are parts of a plant?',
    options: [
      { text: '🌸 Flower', correct: true },
      { text: '⚽ Ball', correct: false },
      { text: '🍃 Leaves', correct: true },
      { text: '🔑 Key', correct: false },
    ],
  },
  {
    question: 'Which animals live on a farm?',
    options: [
      { text: '🦈 Shark', correct: false },
      { text: '🐷 Pig', correct: true },
      { text: '🐧 Penguin', correct: false },
      { text: '🐴 Horse', correct: true },
    ],
  },
  {
    question: 'Which animals live in the jungle?',
    options: [
      { text: '🐒 Monkey', correct: true },
      { text: '🐧 Penguin', correct: false },
      { text: '🐯 Tiger', correct: true },
      { text: '🐫 Camel', correct: false },
    ],
  },
  {
    question: 'Which of these are kinds of weather?',
    options: [
      { text: '🍎 Apple', correct: false },
      { text: '☀️ Sunny', correct: true },
      { text: '🚗 Car', correct: false },
      { text: '🌬️ Windy', correct: true },
    ],
  },
  {
    question: 'Which of these are seasons?',
    options: [
      { text: '❄️ Winter', correct: true },
      { text: '🍕 Pizza', correct: false },
      { text: '🚲 Bicycle', correct: false },
      { text: '🌸 Spring', correct: true },
    ],
  },
  {
    question: 'Which of these need water to live?',
    options: [
      { text: '⚽ Ball', correct: false },
      { text: '🌻 Sunflower', correct: true },
      { text: '🐶 Dog', correct: true },
      { text: '🚗 Car', correct: false },
    ],
  },
  {
    question: 'Which of these are living things?',
    options: [
      { text: '🌳 Tree', correct: true },
      { text: '🚗 Car', correct: false },
      { text: '🐱 Cat', correct: true },
      { text: '📚 Books', correct: false },
    ],
  },
  {
    question: 'Which animals have fins?',
    options: [
      { text: '🐴 Horse', correct: false },
      { text: '🐟 Fish', correct: true },
      { text: '🐦 Bird', correct: false },
      { text: '🦈 Shark', correct: true },
    ],
  },
  {
    question: 'Which animals have wings?',
    options: [
      { text: '🦆 Duck', correct: true },
      { text: '🐍 Snake', correct: false },
      { text: '🐝 Bee', correct: true },
      { text: '🐢 Turtle', correct: false },
    ],
  },
  {
    question: 'Which can you see in the sky at night?',
    options: [
      { text: '☀️ Sun', correct: false },
      { text: '🌙 Moon', correct: true },
      { text: '🦋 Butterfly', correct: false },
      { text: '⭐ Stars', correct: true },
    ],
  },
  {
    question: 'Which of these come from animals?',
    options: [
      { text: '🍯 Honey', correct: true },
      { text: '🍎 Apple', correct: false },
      { text: '🥚 Egg', correct: true },
      { text: '🥕 Carrot', correct: false },
    ],
  },
  {
    question: 'Which animals have fur?',
    options: [
      { text: '🐟 Fish', correct: false },
      { text: '🐻 Bear', correct: true },
      { text: '🐸 Frog', correct: false },
      { text: '🐰 Rabbit', correct: true },
    ],
  },
  {
    question: 'Which animals have scales?',
    options: [
      { text: '🐟 Fish', correct: true },
      { text: '🐑 Sheep', correct: false },
      { text: '🐍 Snake', correct: true },
      { text: '🐶 Dog', correct: false },
    ],
  },
  {
    question: 'Which of these can melt?',
    options: [
      { text: '🌳 Tree', correct: false },
      { text: '⛄ Snowman', correct: true },
      { text: '🏠 House', correct: false },
      { text: '🍦 Ice Cream', correct: true },
    ],
  },
  {
    question: 'Which animals live in the desert?',
    options: [
      { text: '🐫 Camel', correct: true },
      { text: '🐧 Penguin', correct: false },
      { text: '🦂 Scorpion', correct: true },
      { text: '🐳 Whale', correct: false },
    ],
  },
  {
    question: 'Which of these are parts of your body?',
    options: [
      { text: '🍎 Apple', correct: false },
      { text: '👀 Eyes', correct: true },
      { text: '⚽ Ball', correct: false },
      { text: '👃 Nose', correct: true },
    ],
  },
  {
    question: 'Which of these float in water?',
    options: [
      { text: '🦆 Duck', correct: true },
      { text: '🔨 Hammer', correct: false },
      { text: '⛵ Boat', correct: true },
      { text: '🔑 Key', correct: false },
    ],
  },
  {
    question: 'Which animals eat grass?',
    options: [
      { text: '🦈 Shark', correct: false },
      { text: '🐄 Cow', correct: true },
      { text: '🦁 Lion', correct: false },
      { text: '🐑 Sheep', correct: true },
    ],
  },
  {
    question: 'Which animals eat meat?',
    options: [
      { text: '🦁 Lion', correct: true },
      { text: '🐰 Rabbit', correct: false },
      { text: '🦈 Shark', correct: true },
      { text: '🐄 Cow', correct: false },
    ],
  },
  {
    question: 'Which of these grow from seeds?',
    options: [
      { text: '⚽ Ball', correct: false },
      { text: '🌻 Sunflower', correct: true },
      { text: '🧸 Teddy Bear', correct: false },
      { text: '🌳 Tree', correct: true },
    ],
  },
  {
    question: 'Which of these grow under the ground?',
    options: [
      { text: '🥕 Carrot', correct: true },
      { text: '🍎 Apple', correct: false },
      { text: '🍌 Banana', correct: false },
      { text: '🥔 Potato', correct: true },
    ],
  },
  {
    question: 'Which of these give off light?',
    options: [
      { text: '☀️ Sun', correct: true },
      { text: '💡 Light Bulb', correct: true },
      { text: '🍎 Apple', correct: false },
      { text: '🔦 Flashlight', correct: true },
    ],
  },
  {
    question: 'Which animals live in trees?',
    options: [
      { text: '🐟 Fish', correct: false },
      { text: '🐒 Monkey', correct: true },
      { text: '🐿️ Squirrel', correct: true },
      { text: '🐄 Cow', correct: false },
    ],
  },
  {
    question: 'Which of these colors are in a rainbow?',
    options: [
      { text: '❤️ Red', correct: true },
      { text: '🖤 Black', correct: false },
      { text: '💛 Yellow', correct: true },
      { text: '💙 Blue', correct: true },
    ],
  },
  {
    question: 'Which of these are flowers?',
    options: [
      { text: '🌲 Pine Tree', correct: false },
      { text: '🌹 Rose', correct: true },
      { text: '🌷 Tulip', correct: true },
      { text: '🍄 Mushroom', correct: false },
    ],
  },
  {
    question: 'Which of these are birds?',
    options: [
      { text: '🦇 Bat', correct: false },
      { text: '🦉 Owl', correct: true },
      { text: '🐝 Bee', correct: false },
      { text: '🐧 Penguin', correct: true },
    ],
  },
  {
    question: 'Which animals are reptiles?',
    options: [
      { text: '🐍 Snake', correct: true },
      { text: '🐸 Frog', correct: false },
      { text: '🐢 Turtle', correct: true },
      { text: '🐊 Crocodile', correct: true },
    ],
  },
  {
    question: 'Which animals live in a pond?',
    options: [
      { text: '🐪 Camel', correct: false },
      { text: '🐸 Frog', correct: true },
      { text: '🦆 Duck', correct: true },
      { text: '🦁 Lion', correct: false },
    ],
  },
  {
    question: 'Which animals have horns?',
    options: [
      { text: '🐐 Goat', correct: true },
      { text: '🐶 Dog', correct: false },
      { text: '🐱 Cat', correct: false },
      { text: '🐂 Ox', correct: true },
    ],
  },
  {
    question: 'Which animals are awake at night?',
    options: [
      { text: '🐔 Chicken', correct: false },
      { text: '🦉 Owl', correct: true },
      { text: '🦇 Bat', correct: true },
      { text: '🦋 Butterfly', correct: false },
    ],
  },
  {
    question: 'Which foods come from cows?',
    options: [
      { text: '🥛 Milk', correct: true },
      { text: '🍯 Honey', correct: false },
      { text: '🥚 Egg', correct: false },
      { text: '🧀 Cheese', correct: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Speed science (one correct answer)
// ---------------------------------------------------------------------------

export const SCIENCE_POOL: ScienceQuestion[] = [
  { question: 'Which animal lives in water?', options: ['Cat', 'Fish', 'Dog', 'Bird'], correctAnswer: 'Fish', emoji: '🐠' },
  { question: 'What do bees make?', options: ['Milk', 'Honey', 'Eggs', 'Wool'], correctAnswer: 'Honey', emoji: '🐝' },
  { question: 'Where do birds live?', options: ['Nests', 'Caves', 'Ocean', 'Desert'], correctAnswer: 'Nests', emoji: '🐦' },
  { question: 'What color is the sun?', options: ['Blue', 'Green', 'Yellow', 'Purple'], correctAnswer: 'Yellow', emoji: '☀️' },
  { question: 'How many legs does a spider have?', options: ['6', '8', '4', '10'], correctAnswer: '8', emoji: '🕷️' },
  { question: 'How many legs does an insect have?', options: ['4', '6', '8', '10'], correctAnswer: '6', emoji: '🐜' },
  { question: 'What do cows give us to drink?', options: ['Milk', 'Honey', 'Juice', 'Soda'], correctAnswer: 'Milk', emoji: '🐄' },
  { question: 'What can a caterpillar become?', options: ['Bee', 'Frog', 'Butterfly', 'Bird'], correctAnswer: 'Butterfly', emoji: '🐛' },
  { question: 'What does a thermometer measure?', options: ['Weight', 'Temperature', 'Time', 'Length'], correctAnswer: 'Temperature', emoji: '🌡️' },
  { question: 'What is frozen water called?', options: ['Ice', 'Steam', 'Sand', 'Juice'], correctAnswer: 'Ice', emoji: '❄️' },
  { question: 'What do plants need from the sun?', options: ['Music', 'Toys', 'Light', 'Candy'], correctAnswer: 'Light', emoji: '🌻' },
  { question: 'Which star is closest to Earth?', options: ['Moon', 'Mars', 'Venus', 'Sun'], correctAnswer: 'Sun', emoji: '🌞' },
  { question: 'What does a seed grow into?', options: ['Rock', 'Plant', 'Shell', 'Cloud'], correctAnswer: 'Plant', emoji: '🌱' },
  { question: 'What do fish use to breathe underwater?', options: ['Wings', 'Gills', 'Feathers', 'Fur'], correctAnswer: 'Gills', emoji: '🐟' },
  { question: 'Which body part pumps blood?', options: ['Heart', 'Brain', 'Stomach', 'Lungs'], correctAnswer: 'Heart', emoji: '❤️' },
  { question: 'Which body part do we think with?', options: ['Heart', 'Knee', 'Brain', 'Elbow'], correctAnswer: 'Brain', emoji: '🤔' },
  { question: 'What do we use to smell?', options: ['Eyes', 'Ears', 'Hands', 'Nose'], correctAnswer: 'Nose', emoji: '👃' },
  { question: 'What do we use to hear?', options: ['Ears', 'Nose', 'Feet', 'Mouth'], correctAnswer: 'Ears', emoji: '👂' },
  { question: 'What does a magnet stick to?', options: ['Wood', 'Iron', 'Paper', 'Glass'], correctAnswer: 'Iron', emoji: '📎' },
  { question: 'What falls from clouds when it is very cold?', options: ['Leaves', 'Sand', 'Snow', 'Rocks'], correctAnswer: 'Snow', emoji: '🌨️' },
  { question: 'What can you see in the sky after rain and sun?', options: ['Snowman', 'Rainbow', 'Sandcastle', 'Fire'], correctAnswer: 'Rainbow', emoji: '🌈' },
  { question: 'What do bees collect from flowers?', options: ['Sand', 'Nectar', 'Rocks', 'Milk'], correctAnswer: 'Nectar', emoji: '🌼' },
  { question: 'What color are most leaves in summer?', options: ['Blue', 'Purple', 'Black', 'Green'], correctAnswer: 'Green', emoji: '🍃' },
  { question: 'What does water turn into when it boils?', options: ['Ice', 'Steam', 'Sand', 'Milk'], correctAnswer: 'Steam', emoji: '💨' },
  { question: 'What is a baby frog called?', options: ['Puppy', 'Tadpole', 'Kitten', 'Calf'], correctAnswer: 'Tadpole', emoji: '🐸' },
  { question: 'Which is the biggest animal in the world?', options: ['Elephant', 'Giraffe', 'Blue Whale', 'Lion'], correctAnswer: 'Blue Whale', emoji: '🐳' },
  { question: 'Which is the fastest land animal?', options: ['Turtle', 'Cheetah', 'Snail', 'Cow'], correctAnswer: 'Cheetah', emoji: '🐆' },
  { question: 'What do spiders spin?', options: ['Webs', 'Nests', 'Hives', 'Shells'], correctAnswer: 'Webs', emoji: '🕸️' },
  { question: 'Which part of a plant drinks water from the soil?', options: ['Flowers', 'Seeds', 'Roots', 'Fruits'], correctAnswer: 'Roots', emoji: '🌿' },
  { question: 'Which sense do you use your eyes for?', options: ['Taste', 'Smell', 'Sight', 'Touch'], correctAnswer: 'Sight', emoji: '👀' },
  { question: 'Which sense uses your tongue?', options: ['Taste', 'Hearing', 'Sight', 'Smell'], correctAnswer: 'Taste', emoji: '👅' },
  { question: 'Where does rain come from?', options: ['Trees', 'Clouds', 'Rocks', 'Grass'], correctAnswer: 'Clouds', emoji: '🌧️' },
  { question: 'Which animal can change its color to hide?', options: ['Dog', 'Cow', 'Horse', 'Chameleon'], correctAnswer: 'Chameleon', emoji: '🦎' },
  { question: 'What do we need to breathe?', options: ['Air', 'Sand', 'Juice', 'Rocks'], correctAnswer: 'Air', emoji: '🌬️' },
  { question: 'Which planet does the Moon go around?', options: ['Mars', 'Earth', 'Jupiter', 'Venus'], correctAnswer: 'Earth', emoji: '🌙' },
  { question: 'What do we call water falling from the sky?', options: ['Wind', 'Sand', 'Rain', 'Smoke'], correctAnswer: 'Rain', emoji: '☔' },
  { question: 'What makes ice melt?', options: ['Cold', 'Heat', 'Darkness', 'Snow'], correctAnswer: 'Heat', emoji: '🔥' },
  { question: 'Which animal lays eggs?', options: ['Dog', 'Cat', 'Cow', 'Chicken'], correctAnswer: 'Chicken', emoji: '🥚' },
  { question: 'Which animal has a long trunk?', options: ['Zebra', 'Elephant', 'Lion', 'Monkey'], correctAnswer: 'Elephant', emoji: '🐘' },
  { question: 'What do birds use to fly?', options: ['Wings', 'Fins', 'Wheels', 'Roots'], correctAnswer: 'Wings', emoji: '🕊️' },
  { question: 'What color is the sky on a clear day?', options: ['Green', 'Red', 'Blue', 'Pink'], correctAnswer: 'Blue', emoji: '🌤️' },
  { question: 'Which part of a plant is often colorful and smells nice?', options: ['Root', 'Stem', 'Seed', 'Flower'], correctAnswer: 'Flower', emoji: '🌸' },
  { question: 'What tool helps you see tiny things up close?', options: ['Hammer', 'Magnifying Glass', 'Spoon', 'Ruler'], correctAnswer: 'Magnifying Glass', emoji: '🔍' },
  { question: 'Which of these is a liquid?', options: ['Rock', 'Wood', 'Water', 'Ice'], correctAnswer: 'Water', emoji: '💧' },
  { question: 'Which of these is a solid?', options: ['Juice', 'Milk', 'Steam', 'Rock'], correctAnswer: 'Rock', emoji: '⛰️' },
  { question: 'What keeps us from floating off the ground?', options: ['Gravity', 'Wind', 'Magic', 'Clouds'], correctAnswer: 'Gravity', emoji: '🌍' },
  { question: 'What do pandas mostly eat?', options: ['Fish', 'Meat', 'Bamboo', 'Cheese'], correctAnswer: 'Bamboo', emoji: '🐼' },
  { question: 'Which animal lives in a hive?', options: ['Dog', 'Bee', 'Cow', 'Fish'], correctAnswer: 'Bee', emoji: '🍯' },
  { question: 'What is a baby cat called?', options: ['Puppy', 'Calf', 'Foal', 'Kitten'], correctAnswer: 'Kitten', emoji: '🐱' },
  { question: 'Which animal sleeps hanging upside down?', options: ['Bat', 'Cow', 'Dog', 'Fish'], correctAnswer: 'Bat', emoji: '🦇' },
];
