import {
  faInstagram,
  faGithub,
  faLinkedin,
  IconDefinition,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export type socialNetworkEnum = "instagram" | "github" | "linkedin" | "youtube";

export const socialNetworkMap = new Map<socialNetworkEnum, IconDefinition>([
  ["instagram", faInstagram],
  ["linkedin", faLinkedin],
  ["github", faGithub],
  ["youtube", faYoutube],
]);

export interface SocialNetworkInterface {
  name: socialNetworkEnum;
  link: string;
}
