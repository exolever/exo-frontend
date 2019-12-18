export interface ConfigurationInterface {
  placeholder: string;
  title: string;
  hint: string;
  levels: LevelInterface;
  hintLevels: LevelInterface;
}

interface LevelInterface {
  low: string;
  medium: string;
  high: string;
}
