export type CharacterId =
  | 'ben'
  | 'heatblast'
  | 'fourarms'
  | 'xlr8'
  | 'diamondhead'
  | 'bigchill'
  | 'humungousaur'
  | 'wildmutt'
  | 'upgrade'
  | 'cannonbolt'
  | 'ghostfreak'
  | 'greymatter'
  | 'stinkfly'
  | 'swampfire'
  | 'rath'
  | 'feedback'
  | 'alienx';

export type ActionState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'fall'
  | 'land'
  | 'punch'
  | 'kick'
  | 'special'
  | 'hurt'
  | 'transforming'
  | 'detransforming';

export interface AlienData {
  id: CharacterId;
  name: string;
  species: string;
  homeWorld: string;
  playlist: number; // 1, 2, or 3
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stats: {
    iq: number; // 1-10
    strength: number; // 1-10
    speed: number; // 1-10
    durability: number; // 1-10
    agility: number; // 1-10
  };
  specialName: string;
  specialDescription: string;
  specialCooldown: number; // ms
  specialIcon: string;
  punchPowerName: string;
  speedModifier: number;
  damageModifier: number;
  defenseModifier: number;
  jumpModifier: number;
  canFly?: boolean;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isFlying?: boolean;
  facing: 'left' | 'right';
  characterId: CharacterId;
  action: ActionState;
  actionTimer: number;
  animFrame: number;
  hp: number;
  maxHp: number;
  omnitrixEnergy: number; // 0 to 100
  isTransformed: boolean;
  transformationTimer: number; // flash duration
  specialCooldownTimer: number;
  comboCount: number;
  comboResetTimer: number;
  score: number;
  coins: number; // Claim 100 coins per defeated enemy!
  invulnerableTimer?: number;
}

export interface Enemy {
  id: string;
  name: string;
  type: 'drone' | 'boss_mech' | 'dnalien' | 'sentinel' | 'robot' | 'vilgax' | 'kevin' | 'monster';
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  phase: number;
  maxPhases: number;
  attackTimer: number;
  currentAttack: 'idle' | 'telegraph_laser' | 'firing_laser' | 'rockets' | 'slam' | 'hurt' | 'frozen' | 'charge' | 'slash';
  frozenTimer?: number;
  laserAngle: number;
  telegraphTimer: number;
  facing: 'left' | 'right';
  animTimer: number;
  scoreValue: number;
}

export interface Projectile {
  id: string;
  owner: 'player' | 'enemy';
  type:
    | 'fireball'
    | 'crystal_shard'
    | 'laser'
    | 'slime'
    | 'electricity'
    | 'sonic'
    | 'rocket'
    | 'ice_beam'
    | 'plant_seed'
    | 'cosmic_blast'
    | 'black_hole';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  maxLife: number;
  color: string;
  glowColor: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'spark' | 'smoke' | 'crystal' | 'flame' | 'leaf' | 'ice' | 'star' | 'coin';
}

export interface CrystalSpike {
  x: number;
  y: number;
  height: number;
  maxHeight: number;
  width: number;
  life: number;
  alpha: number;
  damageDealt?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface DestructibleObject {
  id: string;
  type: 'crate' | 'hydrant' | 'trash_can';
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  broken: boolean;
}

export interface JoystickInput {
  x: number; // -1 to 1
  y: number; // -1 to 1
  active: boolean;
  angle: number; // radians
  distance: number; // 0 to 1
}
