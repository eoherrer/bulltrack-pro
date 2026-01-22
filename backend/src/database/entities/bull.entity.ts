import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Favorite } from './favorite.entity';

export enum BullUso {
  VAQUILLONA = 'vaquillona',
  VACA = 'vaca',
}

export enum BullOrigen {
  PROPIO = 'propio',
  CATALOGO = 'catalogo',
}

export enum BullPelaje {
  NEGRO = 'negro',
  COLORADO = 'colorado',
}

@Entity('bulls')
@Index(['origen', 'uso', 'pelaje'])
export class Bull {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  caravana: string;

  @Column()
  @Index()
  nombre: string;

  @Column({
    type: 'enum',
    enum: BullUso,
  })
  uso: BullUso;

  @Column({
    type: 'enum',
    enum: BullOrigen,
  })
  @Index()
  origen: BullOrigen;

  @Column({
    type: 'enum',
    enum: BullPelaje,
  })
  @Index()
  pelaje: BullPelaje;

  @Column()
  raza: string;

  @Column({ name: 'edad_meses' })
  edadMeses: number;

  @Column({ name: 'caracteristica_destacada', type: 'varchar', length: 255, nullable: true })
  caracteristicaDestacada: string | null;

  @Column()
  crecimiento: number;

  @Column({ name: 'facilidad_parto' })
  facilidadParto: number;

  @Column()
  reproduccion: number;

  @Column()
  moderacion: number;

  @Column()
  carcasa: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.bull)
  favorites: Favorite[];

  // Calculated field - Bull Score
  get bullScore(): number {
    return Number(
      (
        this.crecimiento * 0.3 +
        this.facilidadParto * 0.25 +
        this.reproduccion * 0.2 +
        this.moderacion * 0.15 +
        this.carcasa * 0.1
      ).toFixed(2),
    );
  }
}
