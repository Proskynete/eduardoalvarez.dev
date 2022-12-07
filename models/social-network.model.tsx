import {
  faGithub,
  faInstagram,
  faLinkedin,
  faNpm,
  faYoutube,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";

export type socialNetworkEnum =
  | "instagram"
  | "github"
  | "linkedin"
  | "npm"
  | "youtube";

export const socialNetworkMap = new Map<socialNetworkEnum, IconDefinition>([
  ["instagram", faInstagram],
  ["linkedin", faLinkedin],
  ["github", faGithub],
  ["npm", faNpm],
  ["youtube", faYoutube],
]);

export interface SocialNetworkInterface {
  name: socialNetworkEnum;
  link: string;
  show: boolean;
}
