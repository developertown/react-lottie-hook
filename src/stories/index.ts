import hallowinCat from "./assets/halloween-cat.json";
import github from "./assets/github.json";
import lovingit from "./assets/loving-it.json";
import cuteGirl from "./assets/cuteGirl.json";
import winking from "./assets/winking.json";
import spinner from "./assets/spinner.json";
import rocket from "./assets/rocket.json";

export enum Animation {
  Github = "Github",
  Spinner = "Spinner",
  Rocket = "Rocket",
  "Hallowin Cat" = "Hallowin Cat",
  "Loving It" = "Loving It",
  "Hallowin Witch" = "Hallowin Witch",
  "Winking Emoji" = "Winking Emoji",
}

export type AnimationTitle = keyof typeof Animation;

export interface AnimationData {
  id: string;
  title: AnimationTitle;
}

export const animations = [
  {
    id: 0,
    title: Animation.Github,
  },
  {
    id: 2,
    title: Animation["Hallowin Cat"],
  },
  {
    id: 3,
    title: Animation["Loving It"],
  },
  {
    id: 4,
    title: Animation["Hallowin Witch"],
  },
  {
    id: 6,
    title: Animation["Winking Emoji"],
  },
  {
    id: 7,
    title: Animation.Spinner,
  },
  {
    id: 8,
    title: Animation.Rocket,
  },
];

export const animationTable = {
  [Animation.Github]: github,
  [Animation.Rocket]: rocket,
  [Animation.Spinner]: spinner,
  [Animation["Winking Emoji"]]: winking,
  [Animation["Hallowin Witch"]]: cuteGirl,
  [Animation["Loving It"]]: lovingit,
  [Animation["Hallowin Cat"]]: hallowinCat,
};
