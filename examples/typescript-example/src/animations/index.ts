import hallowinCat from "./hallowinCat.json";
import github from "./github.json";
import lovingit from "./loving_it.json";
import cuteGirl from "./cuteGirl.json";
import winking from "./winking.json";
import spinner from "./spinner.json";
import rocket from "./rocket.json";
import twitterheart from "./twitter-heart.json";
import Maps from "./maps.json";

export enum Animation {
  Maps = "Maps",
  Github = "Github",
  Spinner = "Spinner",
  Rocket = "Rocket",
  Twitter = "Twitter",
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
  {
    id: 9,
    title: Animation.Twitter,
  },
  {
    id: 11,
    title: Animation.Maps,
  },
];

export const animationTable = {
  [Animation.Github]: github,
  [Animation.Rocket]: rocket,
  [Animation.Spinner]: spinner,
  [Animation.Twitter]: twitterheart,
  [Animation.Maps]: Maps,
  [Animation["Winking Emoji"]]: winking,
  [Animation["Hallowin Witch"]]: cuteGirl,
  [Animation["Loving It"]]: lovingit,
  [Animation["Hallowin Cat"]]: hallowinCat,
};
