declare module 'bcrypt' {
  /**
   * Hash input using a salt string or number of rounds.
   */
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;

  /**
   * Compare plaintext input with a previously hashed string.
   */
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;

  /** Sync variants */
  export function hashSync(data: string | Buffer, saltOrRounds: string | number): string;
  export function compareSync(data: string | Buffer, encrypted: string): boolean;
}